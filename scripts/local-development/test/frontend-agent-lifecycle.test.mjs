// @vitest-environment node
import { expect, it, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import * as agent from '../frontend-agent.mjs'
import { createFrontendRuntime } from '../frontend-runtime.mjs'

it('starts listening before asking the BE to start and closes after runtime shutdown', async () => {
  const events = []
  const signals = new EventEmitter()
  const clearKeepAlive = vi.fn()
  const request = vi.fn(async (path, body) => {
    events.push(path)
    if (path === 'health') return { status: 'ok' }
    if (path === 'frontend/actions') {
      expect(body).toEqual({ type: 'start' })
      return { operationId: 'frontend-1' }
    }
    return { frontend: { state: 'passed', operationId: 'frontend-1' } }
  })
  await agent.serveFrontend({
    runtime: { shutdown: async () => events.push('shutdown') },
    request,
    signals,
    listen: async () => {
      events.push('listen')
      return { close: async () => events.push('close') }
    },
    keepAlive: () => 'timer',
    clearKeepAlive,
  })
  expect(events).toEqual(['listen', 'health', 'frontend/actions', 'status'])
  signals.emit('SIGTERM')
  await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledWith('timer'))
  expect(events.slice(-2)).toEqual(['shutdown', 'close'])
})

it('keeps its agent available after a startup failure for a later local:start retry', async () => {
  const signals = new EventEmitter()
  const close = vi.fn()
  const shutdown = vi.fn()
  const clearKeepAlive = vi.fn()
  const reportError = vi.fn()
  await agent.serveFrontend({
    runtime: { shutdown },
    signals,
    request: async (path) =>
      path === 'health'
        ? { status: 'ok' }
        : path === 'frontend/actions'
          ? { operationId: 'frontend-1' }
          : { frontend: { state: 'failed', operationId: 'frontend-1', error: 'Build failed' } },
    listen: async () => ({ close }),
    keepAlive: () => 'timer',
    clearKeepAlive,
    reportError,
  })
  expect(reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Build failed' }))
  expect(close).not.toHaveBeenCalled()
  expect(shutdown).not.toHaveBeenCalled()
  signals.emit('SIGTERM')
  await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledWith('timer'))
})

it.each(['health', 'status'])(
  'cancels %s waiting on SIGTERM before any future request',
  async (waitingPath) => {
    const signals = new EventEmitter()
    const clearKeepAlive = vi.fn()
    const request = vi.fn(async (path, _body, { signal }) => {
      if (path === waitingPath)
        return new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(signal.reason), { once: true })
        })
      if (path === 'health') return { status: 'ok' }
      return { operationId: 'frontend-1' }
    })
    const serving = agent.serveFrontend({
      runtime: { shutdown: vi.fn() },
      request,
      signals,
      listen: async () => ({ close: vi.fn() }),
      keepAlive: () => 'timer',
      clearKeepAlive,
      reportError: vi.fn(),
    })
    await vi.waitFor(() =>
      expect(request.mock.calls.some(([path]) => path === waitingPath)).toBe(true)
    )
    const count = request.mock.calls.length
    signals.emit('SIGTERM')
    await serving
    await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledOnce())
    expect(request).toHaveBeenCalledTimes(count)
  }
)

it('closes a listener that finishes opening after shutdown and handles both signals once', async () => {
  const signals = new EventEmitter()
  let opened
  const listening = new Promise((resolve) => {
    opened = resolve
  })
  const close = vi.fn()
  const shutdown = vi.fn()
  const request = vi.fn()
  const clearKeepAlive = vi.fn()
  const serving = agent.serveFrontend({
    runtime: { shutdown },
    request,
    signals,
    listen: () => listening,
    keepAlive: () => 'timer',
    clearKeepAlive,
  })
  signals.emit('SIGINT')
  signals.emit('SIGTERM')
  opened({ close })
  await serving
  await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledOnce())
  expect(shutdown).toHaveBeenCalledOnce()
  expect(close).toHaveBeenCalledOnce()
  expect(request).not.toHaveBeenCalled()
})

it.each(['install', 'smoke'])(
  'cancels %s on SIGTERM, stops Vite and releases its kernel lock',
  async (command) => {
    const root = await mkdtemp(join(tmpdir(), 'interop-frontend-cancel-'))
    const signals = new EventEmitter()
    const processes = []
    const spawnProcess = vi.fn((_command, [script], options) => {
      const child = Object.assign(new EventEmitter(), {
        pid: 4242 + processes.length,
        unref: vi.fn(),
      })
      processes.push({
        child,
        script: basename(script),
        owner: options.env.INTEROP_FRONTEND_OWNER,
        alive: true,
      })
      queueMicrotask(() => child.emit('spawn'))
      return child
    })
    const signal = vi.fn((group, name) => {
      const active = processes.find(({ child }) => child.pid === -group)
      if (name === 'SIGKILL' || active.script === 'run-frontend.sh') {
        active.alive = false
        active.child.emit('close', null, name)
      }
    })
    const options = {
      root,
      environment: {},
      spawnProcess,
      signal,
      owns: async (pid, owner) =>
        processes.some((item) => item.child.pid === pid && item.owner === owner && item.alive),
      available: async () => true,
      probe: async () => ({ ok: true }),
      wait: async () => {},
    }
    const runtime = createFrontendRuntime(options)
    let listener
    const clearKeepAlive = vi.fn()
    let commandResponse
    const serving = agent.serveFrontend({
      runtime,
      signals,
      listen: async () => {
        listener = await agent.startFrontendAgent({ runtime, port: 0, host: '127.0.0.1' })
        return listener
      },
      request: async (path, _body, { signal }) => {
        if (path === 'health') return { status: 'ok' }
        if (path === 'frontend/actions') {
          if (command === 'smoke') await runtime.exclusive(() => runtime.start('dev'))
          commandResponse = fetch(`http://127.0.0.1:${listener.port}/commands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: command }),
          })
          return { operationId: 'frontend-1' }
        }
        return new Promise((_resolve, reject) =>
          signal.addEventListener('abort', () => reject(signal.reason), { once: true })
        )
      },
      keepAlive: () => 'timer',
      clearKeepAlive,
      reportError: vi.fn(),
    })
    try {
      const activeScript = command === 'install' ? 'runtime.sh' : 'smoke.sh'
      await vi.waitFor(() =>
        expect(processes.some(({ script }) => script === activeScript)).toBe(true)
      )
      const freshRuntime = createFrontendRuntime(options)
      await expect(freshRuntime.exclusive(async () => {})).rejects.toThrow(
        'Another frontend lifecycle command'
      )
      signals.emit('SIGTERM')
      await serving
      expect((await commandResponse).status).toBe(409)
      await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledWith('timer'))
      const active = processes.find(({ script }) => script === activeScript)
      const vite = processes.find(({ script }) => script === 'run-frontend.sh')
      expect(signal.mock.calls).toEqual([
        [-active.child.pid, 'SIGTERM'],
        ...(vite ? [[-vite.child.pid, 'SIGTERM']] : []),
        [-active.child.pid, 'SIGKILL'],
      ])
      expect(processes.every(({ alive }) => !alive)).toBe(true)
      expect(await runtime.status()).toEqual({ running: false })
      expect(await runtime.startup()).toMatchObject({
        state: 'failed',
        error: `${activeScript} failed (SIGKILL)`,
      })
      await expect(freshRuntime.exclusive(async () => 'reacquired')).resolves.toBe('reacquired')
    } finally {
      signals.emit('SIGTERM')
      for (const active of processes)
        if (active.alive) {
          active.alive = false
          active.child.emit('close', null, 'SIGKILL')
        }
      await serving
      await rm(root, { recursive: true, force: true })
    }
  }
)

it.each(['install', 'start', 'smoke', 'browser'])(
  'cancels an HTTP-disconnected %s command, releases its lock and permits a retry',
  async (command) => {
    const root = await mkdtemp(join(tmpdir(), 'interop-frontend-disconnect-'))
    const processes = []
    let retry = false
    let probing = false
    let releaseProbe
    const spawnProcess = vi.fn((_command, [script], options) => {
      const child = Object.assign(new EventEmitter(), {
        pid: 5200 + processes.length,
        unref: vi.fn(),
      })
      const active = {
        child,
        script: basename(script),
        owner: options.env.INTEROP_FRONTEND_OWNER,
        alive: true,
      }
      processes.push(active)
      queueMicrotask(() => {
        child.emit('spawn')
        if (retry && active.script !== 'run-frontend.sh') {
          active.alive = false
          child.emit('close', 0)
        }
      })
      return child
    })
    const signal = vi.fn((group, name) => {
      const active = processes.find(({ child }) => child.pid === -group)
      if (name === 'SIGKILL' || active.script === 'run-frontend.sh') {
        active.alive = false
        active.child.emit('close', null, name)
      }
    })
    const runtime = createFrontendRuntime({
      root,
      environment: {},
      spawnProcess,
      signal,
      owns: async (pid, owner) =>
        processes.some((item) => item.child.pid === pid && item.owner === owner && item.alive),
      available: async () => true,
      probe: async (_url, { signal }) => {
        if (retry) return { ok: true }
        probing = true
        return new Promise((resolve, reject) => {
          releaseProbe = () => resolve({ ok: true })
          signal.addEventListener('abort', () => reject(signal.reason), { once: true })
        })
      },
      wait: async () => {},
    })
    const check = command === 'smoke' || command === 'browser'
    if (check) {
      retry = true
      await runtime.exclusive(() => runtime.start('dev'))
      retry = false
    }
    const listener = await agent.startFrontendAgent({ runtime, port: 0, host: '127.0.0.1' })
    const controller = new AbortController()
    const send = (body, signal) =>
      fetch(`http://127.0.0.1:${listener.port}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      })
    const accepted = send(
      command === 'start' ? { type: command, mode: 'dev' } : { type: command },
      controller.signal
    )
    // Attach rejection handling before aborting the real HTTP request.
    const disconnected = accepted.catch((error) => error)
    try {
      await vi.waitFor(() =>
        command === 'start'
          ? expect(probing).toBe(true)
          : expect(processes).toHaveLength(check ? 2 : 1)
      )
      controller.abort(new Error('Dashboard stopped'))
      expect(await disconnected).toMatchObject({ message: 'Dashboard stopped' })
      await vi.waitFor(async () => expect((await runtime.startup()).state).toBe('failed'))
      expect(processes.filter(({ alive }) => alive)).toHaveLength(check ? 1 : 0)
      expect((await runtime.status()).running).toBe(check)
      const active = processes.at(-1)
      expect(signal.mock.calls).toContainEqual([-active.child.pid, 'SIGTERM'])
      if (command !== 'start')
        expect(signal.mock.calls).toContainEqual([-active.child.pid, 'SIGKILL'])
      if (check)
        expect(signal.mock.calls.some(([group]) => group === -processes[0].child.pid)).toBe(false)
      retry = true
      releaseProbe?.()
      const retried = await send(
        command === 'start' ? { type: command, mode: 'dev' } : { type: command }
      )
      expect(retried.status).toBe(200)
      await retried.json()
      expect((await runtime.startup()).state).toBe(command === 'install' ? 'stopped' : 'passed')
      await expect(runtime.exclusive(async () => 'lock released')).resolves.toBe('lock released')
      if (command !== 'install') expect((await runtime.status()).running).toBe(true)
    } finally {
      controller.abort()
      releaseProbe?.()
      await runtime.shutdown()
      await listener.close()
      await rm(root, { recursive: true, force: true })
    }
  }
)

it('does not spawn Vite after a disconnected start resumes its pending port check', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-frontend-disconnect-before-start-'))
  let releasePort
  const portChecked = vi.fn(
    () =>
      new Promise((resolve) => {
        releasePort = () => resolve(true)
      })
  )
  const spawnProcess = vi.fn()
  const runtime = createFrontendRuntime({ root, available: portChecked, spawnProcess })
  const listener = await agent.startFrontendAgent({ runtime, port: 0, host: '127.0.0.1' })
  const controller = new AbortController()
  const disconnected = fetch(`http://127.0.0.1:${listener.port}/commands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'start', mode: 'dev' }),
    signal: controller.signal,
  }).catch((error) => error)
  try {
    await vi.waitFor(() => expect(portChecked).toHaveBeenCalledOnce())
    controller.abort(new Error('Dashboard stopped'))
    expect(await disconnected).toMatchObject({ message: 'Dashboard stopped' })
    // Let the server observe the socket close before the paused command continues.
    await new Promise((resolve) => setTimeout(resolve, 20))
    releasePort()
    await vi.waitFor(async () => expect((await runtime.startup()).state).toBe('failed'))
    expect(spawnProcess).not.toHaveBeenCalled()
    await expect(runtime.exclusive(async () => 'retry allowed')).resolves.toBe('retry allowed')
  } finally {
    releasePort?.()
    await runtime.shutdown()
    await listener.close()
    await rm(root, { recursive: true, force: true })
  }
})
