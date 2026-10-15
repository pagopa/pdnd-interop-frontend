// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createFrontendRuntime } from '../frontend-runtime.mjs'

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

async function processFixture({ ignoreTerm = false, childOwner } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'interop-frontend-process-'))
  roots.push(root)
  const listener = createServer()
  await new Promise((resolve) => listener.listen(0, '127.0.0.1', resolve))
  const { port } = listener.address()
  await new Promise((resolve) => listener.close(resolve))
  const childFile = join(root, 'child.json')
  const childSource = [
    "import { createServer } from 'node:http'",
    "import { writeFileSync } from 'node:fs'",
    ignoreTerm ? "process.on('SIGTERM', () => {})" : '',
    "createServer((_request, response) => response.end('ready')).listen(Number(process.env.INTEROP_FRONTEND_PORT), '127.0.0.1', () => {",
    '  writeFileSync(process.env.INTEROP_TEST_CHILD, JSON.stringify({ pid: process.pid }))',
    '})',
  ].join('\n')
  const leaderSource = [
    "import { spawn } from 'node:child_process'",
    "spawn(process.execPath, ['--input-type=module', '--eval', " +
      JSON.stringify(childSource) +
      '], {',
    '  env: { ...process.env, ...' +
      JSON.stringify(childOwner ? { INTEROP_FRONTEND_OWNER: childOwner } : {}) +
      ' },',
    "  stdio: 'ignore',",
    '}).unref()',
    'setInterval(() => {}, 1000)',
  ].join('\n')
  const leaders = []
  const spawnProcess = vi.fn((_command, _args, options) => {
    const leader = spawn(process.execPath, ['--input-type=module', '--eval', leaderSource], options)
    leaders.push(leader)
    return leader
  })
  const environment = {
    ...process.env,
    INTEROP_FRONTEND_PORT: String(port),
    INTEROP_TEST_CHILD: childFile,
  }
  const runtime = createFrontendRuntime({
    root,
    environment,
    spawnProcess,
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, Math.min(ms, 10))),
  })
  return {
    root,
    port,
    runtime,
    leaders,
    spawnProcess,
    environment,
    childFile,
    leaderSource,
    cleanup: async () => {
      for (const leader of leaders) {
        const exited = new Promise((resolve) => {
          if (leader.exitCode !== null || leader.signalCode !== null) resolve()
          else leader.once('exit', resolve)
        })
        try {
          process.kill(-leader.pid, 'SIGKILL')
        } catch (error) {
          if (error.code !== 'ESRCH') throw error
        }
        await exited
      }
    },
  }
}

it('stops the live owned child while its exited group leader remains a zombie', async () => {
  const { root, runtime, environment, childFile, leaderSource, port } = await processFixture()
  const leaderFile = join(root, 'leader.json')
  const supervisorSource = [
    "import { spawn } from 'node:child_process'",
    "import { writeFileSync } from 'node:fs'",
    "const leader = spawn(process.execPath, ['--input-type=module', '--eval', " +
      JSON.stringify(leaderSource) +
      '], {',
    "  env: process.env, detached: true, stdio: 'ignore',",
    '})',
    "leader.once('spawn', () => writeFileSync(process.env.INTEROP_TEST_LEADER, JSON.stringify({ pid: leader.pid })))",
    "process.on('SIGTERM', () => setTimeout(() => process.exit(0), 50))",
    'setInterval(() => {}, 1000)',
  ].join('\n')
  const supervisor = spawn(process.execPath, ['--input-type=module', '--eval', supervisorSource], {
    env: {
      ...environment,
      INTEROP_FRONTEND_OWNER: 'zombie-owner',
      INTEROP_TEST_LEADER: leaderFile,
    },
    stdio: 'ignore',
  })
  let leaderPid
  try {
    await vi.waitFor(() => readFile(leaderFile, 'utf8'))
    leaderPid = JSON.parse(await readFile(leaderFile, 'utf8')).pid
    await vi.waitFor(() => readFile(childFile, 'utf8'))
    process.kill(supervisor.pid, 'SIGSTOP')
    await vi.waitFor(async () => {
      const stat = await readFile(`/proc/${supervisor.pid}/stat`, 'utf8')
      expect(stat.slice(stat.lastIndexOf(')') + 2)).toMatch(/^T /)
    })
    process.kill(leaderPid, 'SIGTERM')
    await vi.waitFor(async () => {
      const stat = await readFile(`/proc/${leaderPid}/stat`, 'utf8')
      expect(stat.slice(stat.lastIndexOf(')') + 2)).toMatch(/^Z /)
    })
    const stateRoot = join(root, '.local-development/frontend')
    await mkdir(stateRoot, { recursive: true })
    await writeFile(
      join(stateRoot, 'process.json'),
      JSON.stringify({ pid: leaderPid, owner: 'zombie-owner', mode: 'dev' })
    )
    expect((await runtime.status()).running).toBe(true)
    await runtime.stop()
    const listener = createServer()
    await new Promise((resolve, reject) => {
      listener.once('error', reject)
      listener.listen(port, '127.0.0.1', resolve)
    })
    await new Promise((resolve) => listener.close(resolve))
    expect(await runtime.status()).toEqual({ running: false })
  } finally {
    if (leaderPid) {
      try {
        process.kill(-leaderPid, 'SIGKILL')
      } catch (error) {
        if (error.code !== 'ESRCH') throw error
      }
    }
    const exited = new Promise((resolve) => supervisor.once('exit', resolve))
    process.kill(supervisor.pid, 'SIGCONT')
    supervisor.kill('SIGTERM')
    await exited
  }
}, 10_000)

it.each([false, true])(
  'stops and restarts the owned Vite child after its group leader exits (ignores TERM=%s)',
  async (ignoreTerm) => {
    const { runtime, leaders, spawnProcess, port, childFile, cleanup } = await processFixture({
      ignoreTerm,
    })
    try {
      await runtime.start('dev')
      const child = JSON.parse(await readFile(childFile, 'utf8'))
      const leaderExited = new Promise((resolve) => leaders[0].once('exit', resolve))
      process.kill(leaders[0].pid, 'SIGTERM')
      await leaderExited
      expect((await fetch(`http://127.0.0.1:${port}/ui/it/`)).ok).toBe(true)
      expect((await runtime.status()).running).toBe(true)
      await runtime.stop()
      expect(await runtime.status()).toEqual({ running: false })
      await runtime.start('dev')
      expect(spawnProcess).toHaveBeenCalledTimes(2)
      expect((await runtime.status()).running).toBe(true)
      expect(JSON.parse(await readFile(childFile, 'utf8')).pid).not.toBe(child.pid)
    } finally {
      await cleanup()
    }
  },
  10_000
)

it.each(['obsolete-owner', 'mixed-owner'])(
  'does not signal a foreign or mixed process group for %s',
  async (owner) => {
    const setup = await processFixture({
      childOwner: owner === 'mixed-owner' ? 'foreign-child' : undefined,
    })
    const { root, leaders, spawnProcess, environment, childFile, cleanup } = setup
    const signal = vi.fn()
    try {
      spawnProcess('stand-in', [], {
        env: { ...environment, INTEROP_FRONTEND_OWNER: 'mixed-owner' },
        detached: true,
        stdio: 'ignore',
      })
      await vi.waitFor(() => readFile(childFile, 'utf8'))
      const stateRoot = join(root, '.local-development/frontend')
      await mkdir(stateRoot, { recursive: true })
      await writeFile(
        join(stateRoot, 'process.json'),
        JSON.stringify({ pid: leaders[0].pid, owner, mode: 'dev' })
      )
      const runtime = createFrontendRuntime({ root, signal, wait: async () => {} })
      await runtime.stop()
      expect(signal).not.toHaveBeenCalled()
      expect((await fetch(`http://127.0.0.1:${setup.port}/ui/it/`)).ok).toBe(true)
    } finally {
      await cleanup()
    }
  }
)

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
  expect(signal.mock.calls).toEqual([[-4242, 'SIGTERM']])
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
  expect(await runtime.startup()).toEqual({ state: 'passed', phases: [] })
  await runtime.exclusive(() => runtime.stop())
  expect(await runtime.startup()).toEqual({ state: 'stopped', phases: [] })
  await expect(
    runtime.exclusive(async () => {
      throw new Error('Accepted command failed')
    })
  ).rejects.toThrow('Accepted command failed')
  expect(await runtime.startup()).toEqual({
    state: 'failed',
    error: 'Accepted command failed',
    phases: [],
  })
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

it('does not let a completed command signal cancel a later command', async () => {
  const { runtime, signal } = await fixture()
  const previous = new AbortController()
  await runtime.exclusive(() => runtime.start('dev'), { signal: previous.signal })
  let finish
  let entered
  const ready = new Promise((resolve) => {
    entered = resolve
  })
  const next = runtime.exclusive(async () => {
    entered()
    await new Promise((resolve) => {
      finish = resolve
    })
  })
  try {
    await ready
    previous.abort(new Error('Old connection closed'))
    expect(signal).not.toHaveBeenCalled()
    expect((await runtime.status()).running).toBe(true)
    expect((await runtime.startup()).state).toBe('running')
  } finally {
    finish?.()
    await next
  }
  expect((await runtime.startup()).state).toBe('passed')
})
