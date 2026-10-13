// @vitest-environment node
import { expect, it, vi } from 'vitest'
import { readFile } from 'node:fs/promises'
import * as client from './frontend-launcher.mjs'
import { EventEmitter } from 'node:events'

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

it('keeps the editor container alive after failed startup and registers shutdown before setup', async () => {
  const signals = new EventEmitter()
  const runtime = { reportStartup: vi.fn(), stop: vi.fn(), shutdown: vi.fn(async () => {}) }
  const clearKeepAlive = vi.fn()
  const reportError = vi.fn()
  const launcher = {
    start: async () => {
      expect(signals.listenerCount('SIGTERM')).toBe(1)
      throw new Error('Dependency install failed')
    },
  }
  await client.serveFrontend({
    runtime,
    launcher,
    signals,
    keepAlive: () => 'timer',
    clearKeepAlive,
    reportError,
  })
  expect(runtime.reportStartup).toHaveBeenLastCalledWith({
    state: 'failed',
    error: 'Dependency install failed',
  })
  expect(clearKeepAlive).not.toHaveBeenCalled()
  signals.emit('SIGTERM')
  await Promise.resolve()
  expect(runtime.shutdown).toHaveBeenCalledOnce()
  expect(clearKeepAlive).toHaveBeenCalledWith('timer')
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
