// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createFrontendRuntime } from '../frontend-runtime.mjs'
import { startFrontendAgent } from '../frontend-agent.mjs'

const cleanups = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup()
})

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'interop-observer-'))
  cleanups.push(() => rm(root, { recursive: true, force: true }))
  const runtime = createFrontendRuntime({ root, owns: async () => true })
  const observer = await startFrontendAgent({ runtime, port: 0, host: '127.0.0.1' })
  cleanups.push(() => observer.close())
  const request = (path, options) => fetch(`http://127.0.0.1:${observer.port}${path}`, options)
  return { root, runtime, request }
}

it('observes persisted startup phases with actual Vite liveness and exposes no process ownership', async () => {
  const { root, runtime, request } = await fixture()
  expect(await (await request('/status')).json()).toEqual({
    available: true,
    state: 'pending',
    running: false,
    phases: [],
    identity: { tenantKey: 'comune', userKey: 'admin' },
  })
  const phases = [{ id: 'infra', label: 'Infrastructure', state: 'passed', operationId: 'infra-1' }]
  await runtime.reportStartup({ state: 'passed', phases })
  expect(await (await request('/status')).json()).toEqual({
    available: true,
    state: 'stopped',
    running: false,
    phases,
    identity: { tenantKey: 'comune', userKey: 'admin' },
  })
  await writeFile(
    join(root, '.local-development/frontend/process.json'),
    JSON.stringify({
      pid: 1234,
      owner: 'private-owner',
      mode: 'local',
    })
  )
  expect(await (await request('/status')).json()).toEqual({
    available: true,
    state: 'passed',
    running: true,
    mode: 'local',
    phases,
    identity: { tenantKey: 'comune', userKey: 'admin' },
  })
})

it('returns only bounded tails of the two known logs, with empty content before files exist', async () => {
  const { root, request } = await fixture()
  expect(await (await request('/logs?source=startup')).json()).toEqual({ content: '' })
  const directory = join(root, '.local-development/frontend')
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'startup.log'), `${'x'.repeat(100_000)}startup-tail`)
  await writeFile(join(directory, 'vite.log'), 'vite-tail')
  await writeFile(join(directory, 'identity.json'), 'private-identity')
  const { content } = await (await request('/logs?source=startup')).json()
  expect(Buffer.byteLength(content)).toBe(65_536)
  expect(content.endsWith('startup-tail')).toBe(true)
  expect(await (await request('/logs?source=vite')).json()).toEqual({ content: 'vite-tail' })
  for (const path of [
    '/logs',
    '/logs?source=identity',
    '/logs?source=../../frontend-token',
    '/identity',
    '/status?path=identity.json',
  ]) {
    expect((await request(path)).status).toBe(404)
  }
  expect((await request('/status', { method: 'POST' })).status).toBe(405)
})

it('keeps phase evidence when exclusive finalizes success, failure and later stop', async () => {
  const { runtime, request } = await fixture()
  const phases = [{ id: 'smoke', label: 'Smoke checks', state: 'failed', error: 'Smoke failed' }]
  await expect(
    runtime.exclusive(async () => {
      await runtime.reportStartup({ state: 'running', phases })
      throw new Error('Smoke failed')
    })
  ).rejects.toThrow('Smoke failed')
  expect(await (await request('/status')).json()).toEqual({
    available: true,
    state: 'failed',
    running: false,
    phases,
    error: 'Smoke failed',
    identity: { tenantKey: 'comune', userKey: 'admin' },
  })
  await runtime.exclusive(async () => {})
  expect(await (await request('/status')).json()).toEqual({
    available: true,
    state: 'stopped',
    running: false,
    phases: [],
    identity: { tenantKey: 'comune', userKey: 'admin' },
  })
})

it('executes only allowlisted commands under the runtime lock and refreshes a local start', async () => {
  const { runtime, request } = await fixture()
  const events = []
  const originalExclusive = runtime.exclusive
  runtime.exclusive = vi.fn((task) =>
    originalExclusive(async () => {
      events.push('lock')
      await task()
    })
  )
  for (const name of ['install', 'stop', 'smoke', 'browserChecks', 'start', 'storeToken']) {
    runtime[name] = vi.fn(async (...args) => events.push([name, ...args]))
  }
  const identity = { tenantKey: 'comune', userKey: 'reviewer' }
  for (const command of [
    { type: 'install' },
    { type: 'stop' },
    { type: 'smoke' },
    { type: 'browser' },
    { type: 'start', mode: 'dev' },
    { type: 'start', mode: 'local', sessionToken: 'header.payload.signature', identity },
  ]) {
    const response = await request('/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({})
  }
  expect(events).toEqual([
    'lock',
    ['install'],
    'lock',
    ['stop'],
    'lock',
    ['smoke'],
    'lock',
    ['browserChecks'],
    'lock',
    ['stop'],
    ['start', 'dev'],
    'lock',
    ['stop'],
    ['storeToken', 'header.payload.signature', identity],
    ['start', 'local'],
  ])
})

it('awaits commands and rejects overlap without replacing the active command state', async () => {
  const { runtime, request } = await fixture()
  let finish
  runtime.install = vi.fn(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"type":"install"}',
  }
  let completed = false
  const first = request('/commands', options).then((response) => {
    completed = true
    return response
  })
  try {
    await vi.waitFor(() => expect(runtime.install).toHaveBeenCalledOnce())
    expect(completed).toBe(false)
    const second = await request('/commands', options)
    expect(second.status).toBe(409)
    expect(await second.json()).toEqual({ error: 'Another frontend lifecycle command is running' })
    expect((await runtime.startup()).state).toBe('running')
  } finally {
    finish?.()
    expect((await first).status).toBe(200)
  }
})

it('rejects browser mutations, oversized bodies and unknown command shapes before execution', async () => {
  const { runtime, request } = await fixture()
  const exclusive = vi.spyOn(runtime, 'exclusive')
  const valid = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"type":"install"}',
  }
  for (const options of [
    { ...valid, headers: { ...valid.headers, Origin: 'https://example.com' } },
    { ...valid, headers: { ...valid.headers, 'Sec-Fetch-Site': 'cross-site' } },
    { ...valid, headers: { 'Content-Type': 'text/plain' } },
    { ...valid, body: 'x'.repeat(65_537) },
    { ...valid, body: '{' },
    ...[
      { type: 'exec', command: 'echo unsafe' },
      { type: 'install', args: ['unsafe'] },
      { type: 'start', mode: 'local' },
      { type: 'start', mode: 'dev', sessionToken: 'private' },
      {
        type: 'start',
        mode: 'local',
        sessionToken: 'invalid',
        identity: { tenantKey: 'comune', userKey: 'admin' },
      },
    ].map((command) => ({ ...valid, body: JSON.stringify(command) })),
  ]) {
    expect((await request('/commands', options)).status).toBeGreaterThanOrEqual(400)
  }
  expect(exclusive).not.toHaveBeenCalled()
})

it('returns command failure without reflecting the private session token', async () => {
  const { runtime, request } = await fixture()
  runtime.storeToken = async () => {
    throw new Error('Cannot write header.payload.signature')
  }
  const response = await request('/commands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'start',
      mode: 'local',
      sessionToken: 'header.payload.signature',
      identity: { tenantKey: 'comune', userKey: 'admin' },
    }),
  })
  expect(response.status).toBe(409)
  expect(await response.text()).not.toContain('header.payload.signature')
})

it('bounds command failure responses while retaining the full diagnostic in state and logs', async () => {
  const { root, runtime, request } = await fixture()
  const error = `Vite exited during startup; log: ${join(root, '.local-development/frontend/vite.log')}\n${'build diagnostic\n'.repeat(600)}final diagnostic`
  await mkdir(join(root, '.local-development/frontend'), { recursive: true })
  await writeFile(join(root, '.local-development/frontend/vite.log'), error)
  runtime.start = async () => {
    throw new Error(error)
  }
  const response = await request('/commands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'start', mode: 'dev' }),
  })
  expect(response.status).toBe(409)
  const result = await response.json()
  expect(result.error.length).toBeLessThanOrEqual(2000)
  expect(result.error).toContain('Vite exited during startup; log:')
  expect(result.error).toContain('vite.log')
  expect((await runtime.startup()).error).toBe(error)
  expect((await (await request('/logs?source=vite')).json()).content).toBe(error)
})
