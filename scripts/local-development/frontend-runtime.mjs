import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, open, readFile, rm, writeFile } from 'node:fs/promises'
import { createConnection } from 'node:net'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const defaultRoot = fileURLToPath(new URL('../..', import.meta.url))
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return undefined
    throw error
  }
}

async function ownsProcess(pid, owner) {
  try {
    const environment = await readFile(`/proc/${pid}/environ`, 'utf8')
    const stat = await readFile(`/proc/${pid}/stat`, 'utf8')
    return (
      environment.split('\0').includes(`INTEROP_FRONTEND_OWNER=${owner}`) &&
      !stat.slice(stat.lastIndexOf(')') + 2).startsWith('Z')
    )
  } catch {
    return false
  }
}

function portAvailable(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ host: '127.0.0.1', port })
    socket.once('connect', () => {
      socket.destroy()
      resolve(false)
    })
    socket.once('error', () => {
      socket.destroy()
      resolve(true)
    })
  })
}

async function claimLifecycleLock(path) {
  const holder = spawn(
    'flock',
    [
      '--exclusive',
      '--nonblock',
      '--conflict-exit-code',
      '75',
      path,
      'sh',
      '-c',
      'printf "locked\\n"; cat >/dev/null',
    ],
    { stdio: ['pipe', 'pipe', 'pipe'] }
  )
  const closed = new Promise((resolve) => holder.once('close', resolve))
  let acquired = false
  let output = ''
  let errorOutput = ''
  holder.stderr.on('data', (data) => {
    errorOutput += data.toString()
  })
  await new Promise((resolve, reject) => {
    holder.once('error', reject)
    holder.stdout.on('data', (data) => {
      output += data.toString()
      if (output.includes('locked\n')) {
        acquired = true
        resolve()
      }
    })
    holder.once('close', (code) => {
      if (acquired) return
      reject(
        new Error(
          code === 75
            ? 'Another frontend lifecycle command is running'
            : errorOutput || 'Cannot acquire frontend lifecycle lock'
        )
      )
    })
  })
  return async () => {
    holder.stdin.end()
    await closed
  }
}

export function createFrontendRuntime({
  root = defaultRoot,
  environment = process.env,
  spawnProcess = spawn,
  owns = ownsProcess,
  signal = process.kill.bind(process),
  available = portAvailable,
  probe = fetch,
  wait = pause,
} = {}) {
  const stateRoot = join(root, '.local-development/frontend')
  const processFile = join(stateRoot, 'process.json')
  const tokenFile =
    environment.INTEROP_FRONTEND_TOKEN_FILE ?? join(root, '.local-development/frontend-token')
  const port = Number(environment.INTEROP_FRONTEND_PORT ?? 5173)
  const commands = new Set()
  let closing = false

  function assertActive() {
    if (closing) throw new Error('Frontend runtime is shutting down')
  }

  function kill(pid, name) {
    try {
      signal(-pid, name)
    } catch (error) {
      if (error.code !== 'ESRCH') throw error
    }
  }

  async function status() {
    const state = await readJson(processFile)
    const running = Boolean(
      state &&
      Number.isSafeInteger(state.pid) &&
      state.pid > 0 &&
      typeof state.owner === 'string' &&
      (await owns(state.pid, state.owner))
    )
    return { ...state, running }
  }

  async function stop() {
    const state = await status()
    if (state.running) {
      kill(state.pid, 'SIGTERM')
      for (let attempt = 0; attempt < 50 && (await owns(state.pid, state.owner)); attempt += 1) {
        await wait(100)
      }
      // A grandchild can survive even after the process-group leader exits.
      kill(state.pid, 'SIGKILL')
    }
    await rm(processFile, { force: true })
  }

  async function start(mode) {
    assertActive()
    const state = await status()
    if (state.running && state.mode === mode) return
    if (state.running) await stop()
    if (!(await available(port))) throw new Error(`Frontend port ${port} is already in use`)
    await mkdir(stateRoot, { recursive: true })
    const output = await open(join(stateRoot, 'vite.log'), 'a', 0o600)
    const owner = randomUUID()
    const child = spawnProcess(
      'bash',
      [join(root, 'scripts/local-development/run-frontend.sh'), mode],
      {
        cwd: root,
        env: { ...environment, INTEROP_FRONTEND_OWNER: owner },
        detached: true,
        stdio: ['ignore', output.fd, output.fd],
      }
    )
    try {
      await new Promise((resolve, reject) => {
        child.once('spawn', resolve)
        child.once('error', reject)
      })
    } finally {
      await output.close()
    }
    if (!child.pid) throw new Error('Frontend process has no PID')
    await writeFile(processFile, JSON.stringify({ pid: child.pid, owner, mode }), { mode: 0o600 })
    child.unref()
    try {
      for (let attempt = 0; attempt < 180; attempt += 1) {
        assertActive()
        if (!(await owns(child.pid, owner)))
          throw new Error('Vite exited during startup; inspect frontend/vite.log')
        try {
          const response = await probe(`http://127.0.0.1:${port}/ui/it/`, {
            signal: AbortSignal.timeout(2000),
          })
          if (response.ok) return
        } catch {
          /* Vite may still be initializing. */
        }
        await wait(500)
      }
      throw new Error('Vite readiness timed out; inspect frontend/vite.log')
    } catch (error) {
      await stop()
      throw error
    }
  }

  async function exclusive(task) {
    assertActive()
    await mkdir(stateRoot, { recursive: true })
    const release = await claimLifecycleLock(join(stateRoot, 'lifecycle.lock'))
    try {
      return await task()
    } finally {
      await release()
    }
  }

  function run(script, args = []) {
    assertActive()
    return new Promise((resolve, reject) => {
      const child = spawnProcess(
        'bash',
        [join(root, 'scripts/local-development', script), ...args],
        { cwd: root, env: environment, stdio: 'inherit', detached: true }
      )
      commands.add(child)
      child.once('error', reject)
      child.once('close', (code, signal) => {
        commands.delete(child)
        if (code === 0) resolve()
        else reject(new Error(`${script} failed (${signal ?? code})`))
      })
    })
  }

  return {
    exclusive,
    status,
    start,
    stop,
    assertActive,
    shutdown: async () => {
      closing = true
      const active = [...commands]
      active.forEach((child) => {
        if (child.pid) kill(child.pid, 'SIGTERM')
      })
      await stop()
      for (let attempt = 0; attempt < 50 && commands.size; attempt += 1) {
        await wait(100)
      }
      active.forEach((child) => {
        if (child.pid) kill(child.pid, 'SIGKILL')
      })
    },
    install: () => run('runtime.sh', ['install']),
    smoke: () => run('smoke.sh'),
    browserChecks: () => run('run-e2e.sh'),
    identity: async () =>
      (await readJson(join(stateRoot, 'identity.json'))) ?? {
        tenantKey: 'comune',
        userKey: 'admin',
      },
    storeToken: async (sessionToken, identity) => {
      if (typeof sessionToken !== 'string' || !/^[-\w]+\.[-\w]+\.[-\w]+$/.test(sessionToken))
        throw new Error('Dashboard returned an invalid session token')
      await mkdir(dirname(tokenFile), { recursive: true })
      await mkdir(stateRoot, { recursive: true })
      await writeFile(tokenFile, `${sessionToken}\n`, { mode: 0o600 })
      await writeFile(join(stateRoot, 'identity.json'), JSON.stringify(identity), { mode: 0o600 })
    },
    logs: async () => await readFile(join(stateRoot, 'vite.log'), 'utf8'),
    startup: async () => (await readJson(join(stateRoot, 'startup.json'))) ?? { state: 'pending' },
    reportStartup: async (state) => {
      await mkdir(stateRoot, { recursive: true })
      await writeFile(join(stateRoot, 'startup.json'), JSON.stringify(state))
    },
  }
}
