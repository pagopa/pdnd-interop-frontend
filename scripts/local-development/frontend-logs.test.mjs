// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { appendFile, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createStartupLogFollower } from './frontend-logs.mjs'

const roots = []
afterEach(async () => {
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
})

it('retries an unavailable dashboard and incrementally follows frontend and orchestration logs without replay', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const directory = join(root, '.local-development/frontend')
  await mkdir(directory, { recursive: true })
  const startup = join(directory, 'startup.log')
  await writeFile(startup, 'Installing dependencies\n')
  const write = vi.fn()
  const request = vi
    .fn()
    .mockRejectedValueOnce(new Error('not ready'))
    .mockResolvedValueOnce({
      entries: [{ source: 'orchestration', message: 'Infrastructure ready' }],
      cursors: { orchestration: 'generation:1' },
    })
    .mockResolvedValueOnce({ entries: [], cursors: { orchestration: 'generation:1' } })
  const follower = createStartupLogFollower({ root, request, write })
  await follower.poll()
  await appendFile(startup, 'Vite ready\n')
  await follower.poll()
  await follower.poll()
  const output = write.mock.calls.flat().join('')
  expect(output.match(/Installing dependencies/g)).toHaveLength(1)
  expect(output.match(/Vite ready/g)).toHaveLength(1)
  expect(output.match(/Infrastructure ready/g)).toHaveLength(1)
  expect(output).toContain('Waiting for backend dashboard logs')
  const query = new URLSearchParams(request.mock.calls[2][0].split('?')[1])
  expect(query.get('source')).toBe('orchestration')
  expect(JSON.parse(query.get('cursors'))).toEqual({ orchestration: 'generation:1' })
  expect(request.mock.calls.every(([path]) => path.startsWith('logs?'))).toBe(true)
})

it('bounds frontend reads and follows a truncated startup log', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const directory = join(root, '.local-development/frontend')
  await mkdir(directory, { recursive: true })
  const startup = join(directory, 'startup.log')
  await writeFile(startup, 'x'.repeat(100_000))
  const write = vi.fn()
  const follower = createStartupLogFollower({
    root,
    request: async () => ({ entries: [], cursors: {} }),
    write,
  })
  await follower.poll()
  expect(write.mock.calls[0][0].length).toBeLessThan(65_600)
  await writeFile(startup, 'Retrying startup\n')
  await follower.poll()
  expect(write.mock.calls.flat().join('')).toContain('Retrying startup')
})

it('opens the status page only after dashboard health, once per terminal attachment', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  let healthy = false
  const openDashboard = vi.fn(async () => {})
  const request = vi.fn(async (path) => {
    if (path === 'health') {
      if (!healthy) throw new Error('Dashboard building')
      return { status: 'ok' }
    }
    return { entries: [], cursors: {} }
  })
  const follower = createStartupLogFollower({ root, request, write: () => {}, openDashboard })
  await follower.poll()
  expect(openDashboard).not.toHaveBeenCalled()
  healthy = true
  await follower.poll()
  await follower.poll()
  expect(openDashboard).toHaveBeenCalledExactlyOnceWith('http://localhost:8076/#/status')
  const reattached = createStartupLogFollower({ root, request, write: () => {}, openDashboard })
  await reattached.poll()
  expect(openDashboard).toHaveBeenCalledTimes(2)
})

it('keeps following logs and prints one useful URL if the VS Code CLI is unavailable', async () => {
  const root = await mkdtemp(join(tmpdir(), 'interop-logs-'))
  roots.push(root)
  const write = vi.fn()
  const openDashboard = vi.fn(async () => {
    throw new Error('code unavailable')
  })
  const follower = createStartupLogFollower({
    root,
    request: async (path) =>
      path === 'health'
        ? { status: 'ok' }
        : { entries: [{ source: 'orchestration', message: 'Backend running' }], cursors: {} },
    openDashboard,
    write,
  })
  await follower.poll()
  await follower.poll()
  expect(openDashboard).toHaveBeenCalledOnce()
  const output = write.mock.calls.flat().join('')
  expect(output.match(/Cannot open VS Code browser/g)).toHaveLength(1)
  expect(output).toContain('http://localhost:8076/#/status')
  expect(output).toContain('Backend running')
})
