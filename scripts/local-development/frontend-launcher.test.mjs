// @vitest-environment node
import { expect, it, vi } from 'vitest'
import { readFile } from 'node:fs/promises'
import * as client from './frontend-launcher.mjs'
import { EventEmitter } from 'node:events'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { createFrontendRuntime } from './frontend-runtime.mjs'

const serveFrontend = (options) =>
  client.serveFrontend({ observe: async () => ({ close: async () => {} }), ...options })

function fixture({ ready = true, failedAction } = {}) {
  const events = []
  const actions = []
  const request = vi.fn(async (path, body) => {
    if (path === 'health') return { status: 'ok' }
    if (path === 'actions') {
      events.push(body.type)
      actions.push(body)
      return { operationId: body.type }
    }
    if (path === 'status')
      return {
        operations: actions.map(({ type }) => ({
          id: type,
          state: type === failedAction ? 'failed' : 'passed',
          phases: [],
          error: type === failedAction ? 'Build failed' : undefined,
        })),
      }
    if (path === 'identities')
      return {
        ready,
        tenants: [
          {
            key: 'comune',
            users: [
              { id: 'admin-id', key: 'admin' },
              { id: 'reviewer-id', key: 'reviewer' },
            ],
          },
        ],
      }
    if (path === 'identity') {
      events.push(`identity:${body.userId}`)
      return { sessionToken: 'header.payload.signature' }
    }
    throw new Error(`Unexpected API path: ${path}`)
  })
  const runtime = {
    exclusive: (task) => task(),
    status: async () => ({ running: false }),
    install: async () => events.push('install'),
    storeToken: async (token, identity) => events.push(['token', token, identity]),
    identity: async () => ({ tenantKey: 'comune', userKey: 'admin' }),
    start: async (mode) => events.push(`vite:${mode}`),
    stop: async () => events.push('vite:stop'),
    smoke: async () => events.push('smoke'),
    browserChecks: async () => events.push('browser-checks'),
    reportStartup: vi.fn(),
  }
  return { events, actions, request, runtime }
}

it('starts the frontend container through ordered backend APIs, persists its token and checks Vite', async () => {
  const { events, actions, request, runtime } = fixture()
  await client.createFrontendLauncher({ request, runtime }).start()
  expect(actions).toEqual([
    { type: 'infra.start' },
    { type: 'preset.start', id: 'frontend-full' },
    { type: 'seed' },
  ])
  expect(events).toEqual([
    'install',
    'infra.start',
    'preset.start',
    'seed',
    'identity:admin-id',
    ['token', 'header.payload.signature', { tenantKey: 'comune', userKey: 'admin' }],
    'vite:local',
    'smoke',
    'browser-checks',
  ])
})

it('keeps the container available while waiting for the dashboard API before backend actions', async () => {
  const { events, request, runtime } = fixture()
  let ready
  const dashboardReady = new Promise((resolve) => {
    ready = resolve
  })
  const waitingRequest = vi.fn(async (path, body) => {
    if (path === 'health') await dashboardReady
    return request(path, body)
  })
  const signals = new EventEmitter()
  const serving = serveFrontend({
    runtime,
    launcher: client.createFrontendLauncher({ runtime, request: waitingRequest }),
    signals,
    keepAlive: () => undefined,
  })
  try {
    await vi.waitFor(() => expect(waitingRequest).toHaveBeenCalledWith('health'))
    expect(events).toEqual(['install'])
    expect(request).not.toHaveBeenCalled()
    expect(runtime.reportStartup).toHaveBeenCalledWith(
      expect.objectContaining({ state: 'running' })
    )
    expect(signals.listenerCount('SIGTERM')).toBe(1)
  } finally {
    ready()
    await serving
  }
  expect(events).toContain('vite:local')
  expect(events).toContain('browser-checks')
})

it('aborts before seed/token/Vite when a backend operation fails', async () => {
  const { events, request, runtime } = fixture({ failedAction: 'preset.start' })
  await expect(client.createFrontendLauncher({ request, runtime }).start()).rejects.toThrow(
    'Build failed'
  )
  expect(events).toEqual(['install', 'infra.start', 'preset.start'])
  expect(runtime.reportStartup).toHaveBeenLastCalledWith(
    expect.objectContaining({
      phases: expect.arrayContaining([
        { id: 'install', label: expect.any(String), state: 'passed' },
        { id: 'infra', label: expect.any(String), state: 'passed', operationId: 'infra.start' },
        {
          id: 'backend',
          label: expect.any(String),
          state: 'failed',
          operationId: 'preset.start',
          error: 'Build failed',
        },
        { id: 'seed', label: expect.any(String), state: 'skipped' },
        { id: 'vite', label: expect.any(String), state: 'skipped' },
      ]),
    })
  )
})

it('resolves CLI user keys through the identity API and only restarts frontend processes', async () => {
  const { events, request, runtime } = fixture()
  await client.createFrontendLauncher({ request, runtime }).selectIdentity('comune', 'reviewer')
  expect(request).toHaveBeenCalledWith('identity', { tenantKey: 'comune', userId: 'reviewer-id' })
  expect(events).toEqual([
    'identity:reviewer-id',
    ['token', 'header.payload.signature', { tenantKey: 'comune', userKey: 'reviewer' }],
    'vite:stop',
    'vite:local',
  ])
})

it('refuses an unseeded identity before invoking the token endpoint', async () => {
  const { request, runtime } = fixture({ ready: false })
  await expect(
    client.createFrontendLauncher({ request, runtime }).selectIdentity('comune', 'admin')
  ).rejects.toThrow('unseeded')
  expect(request).not.toHaveBeenCalledWith('identity', expect.anything())
})

it('stops only Vite and its backend preset, preserving unrelated backend packages', async () => {
  const { events, request, runtime, actions } = fixture()
  await client.createFrontendLauncher({ request, runtime }).stop()
  expect(actions).toEqual([{ type: 'preset.stop', id: 'frontend-full' }])
  expect(events).toEqual(['vite:stop', 'preset.stop'])
})

it('switches to shared development without issuing backend actions or local tokens', async () => {
  const { events, request, runtime } = fixture()
  await client.createFrontendLauncher({ request, runtime }).useMode('dev')
  expect(request).not.toHaveBeenCalled()
  expect(events).toEqual(['vite:stop', 'vite:dev'])
})

it('restarts existing Vite after refreshing its token without reinstalling dependencies', async () => {
  const { events, request, runtime } = fixture()
  runtime.status = async () => ({ running: true, mode: 'local' })
  await client.createFrontendLauncher({ request, runtime }).start()
  expect(events).not.toContain('install')
  expect(events.slice(-4)).toEqual(['vite:stop', 'vite:local', 'smoke', 'browser-checks'])
})

it.each([true, false])(
  'records an accepted startup failure and cleans Vite only for serve=%s',
  async (serve) => {
    const root = await mkdtemp(join(tmpdir(), 'interop-frontend-start-'))
    const runtime = createFrontendRuntime({ root })
    const stop = vi.spyOn(runtime, 'stop')
    const signals = new EventEmitter()
    const clearKeepAlive = vi.fn()
    runtime.shutdown = vi.fn(async () => {})
    runtime.install = async () => {
      if (serve) expect(signals.listenerCount('SIGTERM')).toBe(1)
      expect(await runtime.startup()).toMatchObject({
        state: 'running',
        phases: expect.arrayContaining([
          expect.objectContaining({ id: 'install', state: 'running' }),
        ]),
      })
      await expect(runtime.exclusive(async () => {})).rejects.toThrow(
        'Another frontend lifecycle command'
      )
      throw new Error('Dependency install failed')
    }
    const launcher = client.createFrontendLauncher({ runtime })
    try {
      if (serve) {
        await serveFrontend({
          runtime,
          launcher,
          signals,
          keepAlive: () => 'timer',
          clearKeepAlive,
          reportError: vi.fn(),
        })
      } else {
        await expect(launcher.start()).rejects.toThrow('Dependency install failed')
      }
      expect(await runtime.startup()).toMatchObject({
        state: 'failed',
        error: 'Dependency install failed',
      })
      expect(stop).toHaveBeenCalledTimes(serve ? 1 : 0)
      if (serve) {
        expect(clearKeepAlive).not.toHaveBeenCalled()
        signals.emit('SIGTERM')
        await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledWith('timer'))
        expect(runtime.shutdown).toHaveBeenCalledOnce()
      }
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }
)

it.each(['install', 'smoke'])(
  'cancels %s on SIGTERM, stops Vite and releases the lifecycle lock',
  async (phase) => {
    const root = await mkdtemp(join(tmpdir(), 'interop-frontend-cancel-'))
    const { request } = fixture()
    const signals = new EventEmitter()
    const processes = []
    const activeScript = phase === 'install' ? 'runtime.sh' : 'smoke.sh'
    const spawnProcess = vi.fn((_command, [script], options) => {
      const child = Object.assign(new EventEmitter(), {
        pid: 4242 + processes.length,
        unref: vi.fn(),
      })
      const process = {
        child,
        script: basename(script),
        owner: options.env.INTEROP_FRONTEND_OWNER,
        alive: true,
      }
      processes.push(process)
      queueMicrotask(() => {
        child.emit('spawn')
        if (process.script === 'runtime.sh' && phase === 'smoke') {
          process.alive = false
          child.emit('close', 0)
        }
      })
      return child
    })
    const signal = vi.fn((group, name) => {
      const process = processes.find(({ child }) => child.pid === -group)
      if (name === 'SIGKILL' || process.script === 'run-frontend.sh') {
        process.alive = false
        process.child.emit('close', null, name)
      }
    })
    const runtimeOptions = {
      root,
      environment: {},
      spawnProcess,
      signal,
      owns: async (pid, owner) =>
        processes.some(
          (process) => process.child.pid === pid && process.owner === owner && process.alive
        ),
      available: async () => true,
      probe: async () => ({ ok: true }),
      wait: async () => {},
    }
    const runtime = createFrontendRuntime(runtimeOptions)
    const start = vi.spyOn(runtime, 'start')
    const storeToken = vi.spyOn(runtime, 'storeToken')
    const browserChecks = vi.spyOn(runtime, 'browserChecks')
    const clearKeepAlive = vi.fn()
    const reportError = vi.fn()
    const serving = serveFrontend({
      runtime,
      launcher: client.createFrontendLauncher({ runtime, request }),
      signals,
      keepAlive: () => 'timer',
      clearKeepAlive,
      reportError,
    })
    try {
      await vi.waitFor(() => {
        expect(processes.some(({ script }) => script === activeScript)).toBe(true)
      })
      const freshRuntime = createFrontendRuntime(runtimeOptions)
      await expect(freshRuntime.exclusive(async () => {})).rejects.toThrow(
        'Another frontend lifecycle command'
      )
      expect((await runtime.status()).running).toBe(phase === 'smoke')
      signals.emit('SIGTERM')
      await vi.waitFor(() => expect(reportError).toHaveBeenCalled())
      await serving
      await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledWith('timer'))

      const active = processes.find(({ script }) => script === activeScript)
      const vite = processes.find(({ script }) => script === 'run-frontend.sh')
      expect(signal.mock.calls).toEqual([
        [-active.child.pid, 'SIGTERM'],
        ...(vite ? [[-vite.child.pid, 'SIGTERM']] : []),
        [-active.child.pid, 'SIGKILL'],
      ])
      expect(processes.every(({ alive }) => !alive)).toBe(true)
      expect(processes.map(({ script }) => script)).toEqual(
        phase === 'install' ? ['runtime.sh'] : ['runtime.sh', 'run-frontend.sh', 'smoke.sh']
      )
      expect(start).toHaveBeenCalledTimes(phase === 'install' ? 0 : 1)
      expect(storeToken).toHaveBeenCalledTimes(phase === 'install' ? 0 : 1)
      expect(browserChecks).not.toHaveBeenCalled()
      if (phase === 'install') {
        expect(request).not.toHaveBeenCalled()
        await expect(
          readFile(join(root, '.local-development/frontend-token'))
        ).rejects.toMatchObject({
          code: 'ENOENT',
        })
      }
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({ message: `${activeScript} failed (SIGKILL)` })
      )
      expect(await runtime.status()).toEqual({ running: false })
      expect(await runtime.startup()).toMatchObject({
        state: 'failed',
        error: `${activeScript} failed (SIGKILL)`,
      })
      await expect(freshRuntime.exclusive(async () => 'reacquired')).resolves.toBe('reacquired')
    } finally {
      signals.emit('SIGTERM')
      for (const process of processes) {
        if (process.alive) {
          process.alive = false
          process.child.emit('close', null, 'SIGKILL')
        }
      }
      await serving
      await rm(root, { recursive: true, force: true })
    }
  }
)

it('does not report failure or stop the active owner when a concurrent serve cannot acquire the lock', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-frontend-serve-'))
  const runtime = createFrontendRuntime({ root })
  const stop = vi.spyOn(runtime, 'stop')
  const reportError = vi.fn()
  let finish
  let entered
  const ready = new Promise((resolve) => {
    entered = resolve
  })
  const active = runtime.exclusive(async () => {
    await runtime.reportStartup({ state: 'running' })
    entered()
    await new Promise((resolve) => {
      finish = resolve
    })
  })
  try {
    await ready
    await serveFrontend({
      runtime,
      launcher: client.createFrontendLauncher({ runtime }),
      signals: new EventEmitter(),
      keepAlive: () => undefined,
      reportError,
    })
    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Another frontend lifecycle command is running' })
    )
    expect(await runtime.startup()).toEqual({ state: 'running' })
    expect(stop).not.toHaveBeenCalled()
  } finally {
    finish?.()
    await active
    await rm(root, { recursive: true, force: true })
  }
})

it('aborts dashboard readiness immediately when the runtime starts shutting down', async () => {
  const { runtime } = fixture()
  let stopping = false
  runtime.assertActive = () => {
    if (stopping) throw new Error('Runtime stopped')
  }
  const request = vi.fn(async () => {
    stopping = true
    throw new Error('Dashboard is still unavailable')
  })
  const pause = vi.fn(async () => {})
  await expect(client.createFrontendLauncher({ request, runtime, pause }).start()).rejects.toThrow(
    'Runtime stopped'
  )
  expect(request).toHaveBeenCalledOnce()
  expect(pause).not.toHaveBeenCalled()
})

it('starts its observer before installation and closes it after runtime shutdown', async () => {
  const events = []
  const signals = new EventEmitter()
  const close = vi.fn(async () => events.push('observer:close'))
  const clearKeepAlive = vi.fn()
  await client.serveFrontend({
    runtime: { shutdown: async () => events.push('shutdown') },
    launcher: { start: async () => events.push('startup') },
    observe: async () => {
      events.push('observer:start')
      return { close }
    },
    signals,
    keepAlive: () => 'timer',
    clearKeepAlive,
  })
  expect(events).toEqual(['observer:start', 'startup'])
  signals.emit('SIGTERM')
  await vi.waitFor(() => expect(clearKeepAlive).toHaveBeenCalledWith('timer'))
  expect(events).toEqual(['observer:start', 'startup', 'shutdown', 'observer:close'])
})

it('closes an observer that finishes opening after shutdown and handles both signals only once', async () => {
  const signals = new EventEmitter()
  let opened
  const observerReady = new Promise((resolve) => {
    opened = resolve
  })
  const close = vi.fn(async () => {})
  const shutdown = vi.fn(async () => {})
  const start = vi.fn(async () => {})
  const clearKeepAlive = vi.fn()
  const serving = client.serveFrontend({
    runtime: { shutdown },
    launcher: { start },
    observe: () => observerReady,
    signals,
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
  expect(start).not.toHaveBeenCalled()
})

it('resets failed phases and operation IDs on retry, preserving successful final phase results', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-frontend-retry-'))
  const runtime = createFrontendRuntime({ root, owns: async () => true })
  const { request } = fixture()
  runtime.install = vi
    .fn()
    .mockRejectedValueOnce(new Error('Install failed'))
    .mockResolvedValue(undefined)
  runtime.start = async (mode) => {
    await writeFile(
      join(root, '.local-development/frontend/process.json'),
      JSON.stringify({ pid: 4242, owner: 'test', mode })
    )
  }
  runtime.stop = async () => {
    await rm(join(root, '.local-development/frontend/process.json'), { force: true })
  }
  runtime.smoke = async () => {}
  runtime.browserChecks = async () => {}
  const launcher = client.createFrontendLauncher({ runtime, request })
  try {
    await expect(launcher.start()).rejects.toThrow('Install failed')
    expect(await runtime.startup()).toMatchObject({ state: 'failed', error: 'Install failed' })
    await launcher.start()
    const state = await runtime.startup()
    expect(state.state).toBe('passed')
    expect(state).not.toHaveProperty('error')
    expect(state.phases).toHaveLength(9)
    expect(state.phases.every(({ state, error }) => state === 'passed' && !error)).toBe(true)
    expect(state.phases.find(({ id }) => id === 'infra').operationId).toBe('infra.start')
    await launcher.useMode('dev')
    expect((await runtime.startup()).phases.filter(({ state }) => state !== 'skipped')).toEqual([
      { id: 'vite', label: 'Vite', state: 'passed' },
    ])
    await launcher.stop()
    expect((await runtime.startup()).state).toBe('stopped')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('attaches VS Code to the separate frontend service and prepares no frontend mount in the backend', async () => {
  const config = JSON.parse(
    await readFile(new URL('../../.devcontainer/devcontainer.json', import.meta.url), 'utf8')
  )
  expect(config.service).toBe('frontend')
  expect(config.runServices).toContain('dashboard')
  expect(config.workspaceFolder).toBe('${localWorkspaceFolder}')
  const initialize = await readFile(
    new URL('../../.devcontainer/initialize.sh', import.meta.url),
    'utf8'
  )
  expect(initialize).not.toContain('prepare --frontend')
})
