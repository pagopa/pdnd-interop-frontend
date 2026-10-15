// @vitest-environment node
import { afterEach, expect, it } from 'vitest'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createFrontendRuntime } from '../frontend-runtime.mjs'
import { startFrontendObserver } from '../frontend-observer.mjs'

const cleanups = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup()
})

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'interop-observer-'))
  cleanups.push(() => rm(root, { recursive: true, force: true }))
  const runtime = createFrontendRuntime({ root, owns: async () => true })
  const observer = await startFrontendObserver({ runtime, port: 0, host: '127.0.0.1' })
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
  })
  const phases = [{ id: 'infra', label: 'Infrastructure', state: 'passed', operationId: 'infra-1' }]
  await runtime.reportStartup({ state: 'passed', phases })
  expect(await (await request('/status')).json()).toEqual({
    available: true,
    state: 'stopped',
    running: false,
    phases,
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
  })
  await runtime.exclusive(async () => {})
  expect(await (await request('/status')).json()).toEqual({
    available: true,
    state: 'stopped',
    running: false,
    phases: [],
  })
})
