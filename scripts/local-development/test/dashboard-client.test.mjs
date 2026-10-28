// @vitest-environment node
import { expect, it, vi } from 'vitest'
import { execFile, spawn } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import * as client from '../dashboard-client.mjs'

it.each([
  { type: 'start' },
  { type: 'stop' },
  { type: 'use-local' },
  { type: 'use-dev' },
  { type: 'identity', tenantKey: 'comune', userKey: 'reviewer' },
  { type: 'reset' },
])('forwards frontend $type and waits for its matching BE operation', async (action) => {
  const request = vi
    .fn()
    .mockResolvedValueOnce({ operationId: 'frontend-2' })
    .mockResolvedValueOnce({ frontend: { operationId: 'frontend-2', state: 'running' } })
    .mockResolvedValueOnce({
      frontend: { operationId: 'frontend-2', state: action.type === 'stop' ? 'stopped' : 'passed' },
    })
  const result = await client.runFrontendAction(action, { request, pause: async () => {} })
  expect(request).toHaveBeenNthCalledWith(1, 'frontend/actions', action)
  expect(request).toHaveBeenCalledTimes(3)
  expect(result).toMatchObject({ operationId: 'frontend-2' })
})

it.each([undefined, 'another-operation'])(
  'reports lost or superseded startup instead of polling indefinitely: %s',
  async (operationId) => {
    const request = vi
      .fn()
      .mockResolvedValueOnce({ operationId: 'startup' })
      .mockResolvedValue({ frontend: { operationId, state: 'passed' } })
    await expect(
      client.runFrontendAction({ type: 'start' }, { request, pause: async () => {} })
    ).rejects.toThrow(/lost or superseded/)
    expect(request).toHaveBeenCalledTimes(2)
  }
)

it('surfaces the authoritative failed frontend phase', async () => {
  const request = vi
    .fn()
    .mockResolvedValueOnce({ operationId: 'frontend-1' })
    .mockResolvedValueOnce({
      frontend: {
        operationId: 'frontend-1',
        state: 'failed',
        phases: [{ id: 'seed', state: 'failed', error: 'Seed failed' }],
      },
    })
  await expect(client.runFrontendAction({ type: 'start' }, { request })).rejects.toThrow(
    'Seed failed'
  )
})

it('cancels unavailable dashboard retries without starting later work', async () => {
  const controller = new AbortController()
  const request = vi.fn(async () => {
    controller.abort(new Error('Frontend stopped'))
    throw new Error('Dashboard unavailable')
  })
  const pause = vi.fn()
  await expect(
    client.waitForDashboard({ request, pause, signal: controller.signal })
  ).rejects.toThrow('Frontend stopped')
  expect(request).toHaveBeenCalledOnce()
  expect(pause).not.toHaveBeenCalled()
})

it('cancels frontend operation polling before requesting more work', async () => {
  const controller = new AbortController()
  const request = vi
    .fn()
    .mockResolvedValueOnce({ operationId: 'frontend-1' })
    .mockResolvedValueOnce({ frontend: { operationId: 'frontend-1', state: 'running' } })
  const pause = vi.fn(async () => controller.abort(new Error('Frontend stopped')))
  await expect(
    client.runFrontendAction({ type: 'start' }, { request, pause, signal: controller.signal })
  ).rejects.toThrow('Frontend stopped')
  expect(request).toHaveBeenCalledTimes(2)
})

it('waits for the accepted operation before reporting successful startup', async () => {
  const request = vi
    .fn()
    .mockResolvedValueOnce({ operationId: 'start-1' })
    .mockResolvedValueOnce({ operations: [{ id: 'start-1', state: 'running', phases: [] }] })
    .mockResolvedValueOnce({ operations: [{ id: 'start-1', state: 'passed', phases: [] }] })
  await expect(
    client.runAction(
      { type: 'preset.start', id: 'frontend-full' },
      { request, pause: async () => {} }
    )
  ).resolves.toMatchObject({ state: 'passed' })
  expect(request).toHaveBeenNthCalledWith(1, 'actions', {
    type: 'preset.start',
    id: 'frontend-full',
  })
  expect(request).toHaveBeenCalledTimes(3)
})

it('reports startup phase errors instead of accepting HTTP 202 as completion', async () => {
  const request = vi
    .fn()
    .mockResolvedValueOnce({ operationId: 'start-1' })
    .mockResolvedValueOnce({
      operations: [{ id: 'start-1', state: 'failed', error: 'Backend build failed', phases: [] }],
    })
  await expect(
    client.runAction({ type: 'preset.start', id: 'frontend-full' }, { request })
  ).rejects.toThrow('Backend build failed')
})

it('reports the accepted operation ID before polling its completion', async () => {
  const onAccepted = vi.fn()
  const request = vi.fn(async (path) => {
    if (path === 'actions') return { operationId: 'infra-1' }
    expect(onAccepted).toHaveBeenCalledWith('infra-1')
    return { operations: [{ id: 'infra-1', state: 'passed', phases: [] }] }
  })
  await client.runAction({ type: 'infra.start' }, { request, onAccepted })
})

it('keeps CLI status authoritative, forwards lifecycle commands and checks BE success plus actual process ownership', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-frontend-cli-'))
  const scripts = join(root, 'scripts/local-development')
  await mkdir(scripts, { recursive: true })
  for (const file of [
    'dashboard-client.mjs',
    'frontend-agent.mjs',
    'frontend-runtime.mjs',
    'vite-config.mjs',
  ]) {
    await copyFile(new URL(`../${file}`, import.meta.url), join(scripts, file))
  }
  let frontend = {
    state: 'passed',
    operationId: 'frontend-1',
    phases: [{ id: 'seed', state: 'passed' }],
  }
  const actions = []
  const server = createServer(async (request, response) => {
    if (request.method === 'POST' && request.url !== '/__local-dashboard/api/frontend/actions') {
      response.writeHead(400, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Unexpected mutation' }))
      return
    }
    if (request.method === 'POST') {
      let body = ''
      for await (const chunk of request) body += chunk
      const action = JSON.parse(body)
      expect(request.url).toBe('/__local-dashboard/api/frontend/actions')
      actions.push(action)
      frontend = { ...frontend, state: action.type === 'stop' ? 'stopped' : 'passed' }
      response.writeHead(202, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ operationId: frontend.operationId }))
    } else response.end(JSON.stringify({ frontend }))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const run = (...args) =>
    promisify(execFile)(process.execPath, [join(scripts, 'dashboard-client.mjs'), ...args], {
      env: { ...process.env, INTEROP_DASHBOARD_URL: `http://127.0.0.1:${server.address().port}` },
      timeout: 10_000,
    })
  let owned
  try {
    expect(JSON.parse((await run('status')).stdout)).toEqual({ frontend })
    expect((await run('startup-state')).stdout.trim()).toBe('stopped')
    for (const command of ['ready', 'startup-status'])
      await expect(run(command)).rejects.toMatchObject({ code: 1 })
    await expect(run('runtime-health')).rejects.toMatchObject({ code: 1 })
    for (const command of ['start', 'stop', 'use-local', 'use-dev', 'reset']) await run(command)
    await run('identity', 'comune', 'reviewer')
    expect(actions).toEqual([
      { type: 'start' },
      { type: 'stop' },
      { type: 'use-local' },
      { type: 'use-dev' },
      { type: 'reset' },
      { type: 'identity', tenantKey: 'comune', userKey: 'reviewer' },
    ])
    // Stand-in process only: no Vite, shell scripts, containers or infrastructure.
    owned = spawn(process.execPath, ['--eval', 'setInterval(() => {}, 1000)'], {
      env: { ...process.env, INTEROP_FRONTEND_OWNER: 'cli-test' },
      detached: true,
      stdio: 'ignore',
    })
    await new Promise((resolve, reject) => {
      owned.once('spawn', resolve)
      owned.once('error', reject)
    })
    const stateRoot = join(root, '.local-development/frontend')
    await mkdir(stateRoot, { recursive: true })
    await writeFile(
      join(stateRoot, 'process.json'),
      JSON.stringify({ pid: owned.pid, owner: 'cli-test', mode: 'dev' })
    )
    for (const command of ['ready', 'startup-status'])
      await expect(run(command)).resolves.toMatchObject({ stderr: '' })
    await expect(run('runtime-health')).resolves.toMatchObject({ stderr: '' })
    frontend = { ...frontend, state: 'failed' }
    for (const command of ['ready', 'startup-status'])
      await expect(run(command)).rejects.toMatchObject({ code: 1 })
    expect((await run('startup-state')).stdout.trim()).toBe('failed')
    await expect(run('runtime-health')).resolves.toMatchObject({ stderr: '' })
  } finally {
    if (owned) {
      const exited = new Promise((resolve) => owned.once('exit', resolve))
      owned.kill('SIGTERM')
      await exited
    }
    await new Promise((resolve) => server.close(resolve))
    await rm(root, { recursive: true, force: true })
  }
}, 20_000)
