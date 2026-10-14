// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createFrontendRuntime } from './frontend-runtime.mjs'

const roots = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'interop-frontend-runtime-'))
  roots.push(root)
  let alive = false
  let owner
  const spawnProcess = vi.fn((_command, _args, options) => {
    const child = Object.assign(new EventEmitter(), { pid: 4242, unref: vi.fn() })
    owner = options.env.INTEROP_FRONTEND_OWNER
    alive = true
    queueMicrotask(() => child.emit('spawn'))
    return child
  })
  const signal = vi.fn(() => {
    alive = false
  })
  const runtime = createFrontendRuntime({
    root,
    environment: {},
    spawnProcess,
    signal,
    owns: async (pid, candidate) => pid === 4242 && candidate === owner && alive,
    available: async () => true,
    probe: async () => ({ ok: true }),
    wait: async () => {},
  })
  return { root, runtime, signal, spawnProcess }
}

it('reuses its own Vite process and stops its process group without touching foreign PIDs', async () => {
  const { root, runtime, signal, spawnProcess } = await fixture()
  const stateRoot = join(root, '.local-development/frontend')
  await mkdir(stateRoot, { recursive: true })
  await writeFile(
    join(stateRoot, 'process.json'),
    JSON.stringify({ pid: 9999, owner: 'foreign', mode: 'local' })
  )
  await runtime.stop()
  expect(signal).not.toHaveBeenCalled()
  await runtime.start('local')
  await runtime.start('local')
  expect(spawnProcess).toHaveBeenCalledOnce()
  expect(await runtime.status()).toMatchObject({ pid: 4242, running: true, mode: 'local' })
  await runtime.stop()
  expect(signal.mock.calls).toEqual([
    [-4242, 'SIGTERM'],
    [-4242, 'SIGKILL'],
  ])
  expect(await runtime.status()).toEqual({ running: false })
})

it('keeps the selected token and identity in frontend files with private permissions', async () => {
  const { root, runtime } = await fixture()
  await runtime.storeToken('header.payload.signature', { tenantKey: 'comune', userKey: 'reviewer' })
  const path = join(root, '.local-development/frontend-token')
  expect(await readFile(path, 'utf8')).toBe('header.payload.signature\n')
  expect((await stat(path)).mode & 0o777).toBe(0o600)
  expect(await runtime.identity()).toEqual({ tenantKey: 'comune', userKey: 'reviewer' })
})

it('records accepted lifecycle outcomes before releasing its lock', async () => {
  const { runtime } = await fixture()
  await runtime.exclusive(() => runtime.start('dev'))
  expect(await runtime.startup()).toEqual({ state: 'passed' })
  await runtime.exclusive(() => runtime.stop())
  expect(await runtime.startup()).toEqual({ state: 'stopped' })
  await expect(
    runtime.exclusive(async () => {
      throw new Error('Accepted command failed')
    })
  ).rejects.toThrow('Accepted command failed')
  expect(await runtime.startup()).toEqual({ state: 'failed', error: 'Accepted command failed' })
})

it('rejects overlapping lifecycle commands, recovers a stale claim and releases its lock on failure', async () => {
  const { root, runtime } = await fixture()
  let finish
  let entered
  const ready = new Promise((resolve) => {
    entered = resolve
  })
  const first = runtime.exclusive(() => {
    entered()
    return new Promise((resolve) => {
      finish = resolve
    })
  })
  await ready
  await expect(runtime.exclusive(async () => {})).rejects.toThrow(
    'Another frontend lifecycle command'
  )
  finish()
  await first
  const stateRoot = join(root, '.local-development/frontend')
  await writeFile(join(stateRoot, 'lifecycle.lock'), JSON.stringify({ pid: 9999 }))
  await expect(
    runtime.exclusive(async () => {
      throw new Error('Setup failed')
    })
  ).rejects.toThrow('Setup failed')
  expect((await readdir(stateRoot)).filter((name) => name.startsWith('lifecycle'))).toEqual([
    'lifecycle.lock',
  ])
  await writeFile(
    join(stateRoot, 'lifecycle.lock'),
    JSON.stringify({ pid: process.pid, startTime: 'previous-container-process' })
  )
  await expect(runtime.exclusive(async () => 'recovered')).resolves.toBe('recovered')
})

it('allows only one concurrent command when a stale lock file exists', async () => {
  const { root, runtime } = await fixture()
  const stateRoot = join(root, '.local-development/frontend')
  await mkdir(stateRoot, { recursive: true })
  await writeFile(join(stateRoot, 'lifecycle.lock'), JSON.stringify({ pid: 9999 }))
  let finish
  const pending = new Promise((resolve) => {
    finish = resolve
  })
  const entered = []
  const task = async (name) => {
    entered.push(name)
    await pending
  }
  const outcomes = []
  const commands = ['first', 'second'].map((name) =>
    runtime
      .exclusive(() => task(name))
      .then(
        () => outcomes.push('passed'),
        (error) => outcomes.push(error.message)
      )
  )
  for (let attempt = 0; attempt < 50 && !outcomes.length && entered.length < 2; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 5))
  }
  finish()
  await Promise.all(commands)
  expect(entered).toHaveLength(1)
  expect(outcomes).toContain('Another frontend lifecycle command is running')
})
