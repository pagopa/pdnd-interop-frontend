// @vitest-environment node
import { expect, it, vi } from 'vitest'
import { readFile } from 'node:fs/promises'
import * as client from './frontend-launcher.mjs'
import { EventEmitter } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createFrontendRuntime } from './frontend-runtime.mjs'

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

it('aborts before seed/token/Vite when a backend operation fails', async () => {
  const { events, request, runtime } = fixture({ failedAction: 'preset.start' })
  await expect(client.createFrontendLauncher({ request, runtime }).start()).rejects.toThrow(
    'Build failed'
  )
  expect(events).toEqual(['install', 'infra.start', 'preset.start'])
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
      expect(await runtime.startup()).toEqual({ state: 'running' })
      await expect(runtime.exclusive(async () => {})).rejects.toThrow(
        'Another frontend lifecycle command'
      )
      throw new Error('Dependency install failed')
    }
    const launcher = client.createFrontendLauncher({ runtime })
    try {
      if (serve) {
        await client.serveFrontend({
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
      expect(await runtime.startup()).toEqual({
        state: 'failed',
        error: 'Dependency install failed',
      })
      expect(stop).toHaveBeenCalledTimes(serve ? 1 : 0)
      if (serve) {
        expect(clearKeepAlive).not.toHaveBeenCalled()
        signals.emit('SIGTERM')
        await Promise.resolve()
        expect(runtime.shutdown).toHaveBeenCalledOnce()
        expect(clearKeepAlive).toHaveBeenCalledWith('timer')
      }
    } finally {
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
    await client.serveFrontend({
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
