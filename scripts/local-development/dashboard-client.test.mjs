// @vitest-environment node
import { expect, it, vi } from 'vitest'
import { execFile } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import * as client from './dashboard-client.mjs'
import { createFrontendRuntime } from './frontend-runtime.mjs'

it.each(['start', 'stop', 'use-local', 'use-dev', 'identity', 'reset', 'frontend.stop'])(
  'keeps the active startup outcome when a concurrent %s command cannot acquire the lock',
  async (command) => {
    const root = await mkdtemp(join(tmpdir(), 'interop-frontend-cli-'))
    const scripts = join(root, 'scripts/local-development')
    await mkdir(scripts, { recursive: true })
    for (const file of [
      'dashboard-client.mjs',
      'frontend-launcher.mjs',
      'frontend-runtime.mjs',
      'frontend-observer.mjs',
      'vite-config.mjs',
    ]) {
      await copyFile(new URL(file, import.meta.url), join(scripts, file))
    }
    const runtime = createFrontendRuntime({ root })
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
      await expect(
        promisify(execFile)(process.execPath, [join(scripts, 'dashboard-client.mjs'), command], {
          timeout: 10_000,
        })
      ).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining('Another frontend lifecycle command is running'),
      })
      expect(await runtime.startup()).toEqual({ state: 'running' })
    } finally {
      finish?.()
      await active
      await rm(root, { recursive: true, force: true })
    }
  }
)

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
