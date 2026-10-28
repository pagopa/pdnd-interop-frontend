import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, open, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { createConnection } from 'node:net'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout } from 'node:timers/promises'
import { readLogTail } from './frontend-agent.mjs'

const defaultRoot = fileURLToPath(new URL('../..', import.meta.url))
const pause = (ms, signal) => setTimeout(ms, undefined, { signal })

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return undefined
    throw error
  }
}

async function ownsProcessGroup(group, owner) {
  try {
    const members = await Promise.all(
      (await readdir('/proc'))
        .filter((pid) => /^\d+$/.test(pid))
        .map(async (pid) => {
          let fields
          try {
            const stat = await readFile(`/proc/${pid}/stat`, 'utf8')
            fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ')
          } catch {
            return undefined
          }
          if (fields[0] === 'Z' || Number(fields[2]) !== group) return undefined
          try {
            const environment = await readFile(`/proc/${pid}/environ`, 'utf8')
            if (environment.split('\0').includes(`INTEROP_FRONTEND_OWNER=${owner}`)) return true
          } catch (error) {
            if (error.code === 'ENOENT') return undefined
          }
          // A helper can exit between stat and environ; zombies can deny access
          // to their environment. Verify it is still live before rejecting it.
          try {
            const stat = await readFile(`/proc/${pid}/stat`, 'utf8')
            fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ')
            return fields[0] === 'Z' || Number(fields[2]) !== group ? undefined : false
          } catch (error) {
            return error.code === 'ENOENT' ? undefined : false
          }
        })
    )
    // The leader can exit before Vite. Every live member must still belong to
    // this runtime before signalling a group that might otherwise be reused.
    return members.includes(true) && !members.includes(false)
  } catch {
    return false
  }
}

function processGroupExists(group) {
  try {
    // Signal 0 only checks existence; it neither signals nor verifies ownership.
    process.kill(-group, 0)
    return true
  } catch (error) {
    return error.code !== 'ESRCH'
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
  owns = ownsProcessGroup,
  signal = process.kill.bind(process),
  available = portAvailable,
  probe = fetch,
  wait = pause,
} = {}) {
  const stateRoot = join(root, '.local-development/frontend')
  const processFile = join(stateRoot, 'process.json')
  const logFile = join(stateRoot, 'vite.log')
  const tokenFile =
    environment.INTEROP_FRONTEND_TOKEN_FILE ?? join(root, '.local-development/frontend-token')
  const port = Number(environment.INTEROP_FRONTEND_PORT ?? 5173)
  const commands = new Set()
  let closing = false
  let activeCommand
  let termination

  function assertActive() {
    if (closing) throw new Error('Frontend runtime is shutting down')
    activeCommand?.signal?.throwIfAborted()
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
      state.owner.length > 0 &&
      (await owns(state.pid, state.owner))
    )
    return { ...state, running }
  }

  async function stop() {
    const state = await status()
    const waitForStop = async () => {
      for (let attempt = 0; attempt < 50 && (await owns(state.pid, state.owner)); attempt += 1) {
        await wait(100)
      }
    }
    if (state.running && (await owns(state.pid, state.owner))) {
      kill(state.pid, 'SIGTERM')
      await waitForStop()
      if (await owns(state.pid, state.owner)) {
        kill(state.pid, 'SIGKILL')
        await waitForStop()
      }
      if (await owns(state.pid, state.owner)) throw new Error('Frontend process group did not stop')
    }
    await rm(processFile, { force: true })
  }

  async function startupError(message, logStart) {
    let file
    let excerpt
    try {
      const tokens = [environment.REACT_APP_MOCK_TOKEN]
      try {
        tokens.push((await readFile(tokenFile, 'utf8')).replaceAll('\n', ''))
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
      file = await open(logFile, 'r')
      const { size } = await file.stat()
      const start = Math.max(logStart, size - 65_536)
      const buffer = Buffer.alloc(Math.max(0, size - start))
      const { bytesRead } = await file.read(buffer, 0, buffer.length, start)
      excerpt = buffer.subarray(0, bytesRead).toString('utf8')
      // Omit a truncated first line, including any partial session token.
      if (start > logStart) {
        const boundary = excerpt.indexOf('\n')
        excerpt = boundary === -1 ? '' : excerpt.slice(boundary + 1)
      }
      for (const token of tokens
        .filter(Boolean)
        .sort((left, right) => right.length - left.length)) {
        excerpt = excerpt.replaceAll(token, '[redacted]')
      }
      excerpt =
        excerpt.slice(-8192).trimEnd() ||
        (bytesRead ? '(no complete log output from this start)' : '(no log output from this start)')
    } catch {
      excerpt = '(startup log excerpt unavailable)'
    } finally {
      await file?.close()
    }
    return new Error(`${message}; log: ${logFile}\n${excerpt}`)
  }

  async function start(mode) {
    assertActive()
    const commandSignal = activeCommand?.signal
    const state = await status()
    assertActive()
    if (state.running && state.mode === mode) return
    if (state.running) await stop()
    if (!(await available(port))) throw new Error(`Frontend port ${port} is already in use`)
    assertActive()
    await mkdir(stateRoot, { recursive: true })
    const output = await open(logFile, 'a', 0o600)
    const owner = randomUUID()
    let logStart
    let child
    let childExit
    const exitDetail = () =>
      childExit.signal ? `signal ${childExit.signal}` : `exit code ${childExit.code}`
    try {
      logStart = (await output.stat()).size
      assertActive()
      child = spawnProcess(
        'bash',
        [join(root, 'scripts/local-development/run-frontend.sh'), mode],
        {
          cwd: root,
          env: { ...environment, INTEROP_FRONTEND_OWNER: owner },
          detached: true,
          stdio: ['ignore', output.fd, output.fd],
        }
      )
      child.once('exit', (code, signal) => {
        childExit = { code, signal }
      })
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
        const owned = await owns(child.pid, owner)
        if (!owned && childExit && !processGroupExists(child.pid)) {
          throw await startupError(`Vite exited during startup (${exitDetail()})`, logStart)
        }
        // /proc can temporarily fail to verify a live child. Only probe a
        // verified group, and keep accepting owned descendants after leader exit.
        if (owned) {
          try {
            const response = await probe(`http://127.0.0.1:${port}/ui/it/`, {
              signal: commandSignal
                ? AbortSignal.any([commandSignal, AbortSignal.timeout(2000)])
                : AbortSignal.timeout(2000),
            })
            assertActive()
            if (response.ok) return
          } catch {
            assertActive()
            /* Vite may still be initializing. */
          }
        }
        await wait(500, commandSignal)
      }
      throw await startupError(
        `Vite readiness timed out${childExit ? ` (launcher ${exitDetail()})` : ''}`,
        logStart
      )
    } catch (error) {
      await stop()
      throw error
    }
  }

  async function exclusive(task, { signal: commandSignal, stopFrontendOnAbort = true } = {}) {
    assertActive()
    commandSignal?.throwIfAborted()
    await mkdir(stateRoot, { recursive: true })
    const release = await claimLifecycleLock(join(stateRoot, 'lifecycle.lock'))
    const command = { signal: commandSignal }
    const cancel = () => {
      command.cancellation ??= terminateCommands({ stopFrontend: stopFrontendOnAbort })
      // The command awaits cleanup before releasing its lock.
      void command.cancellation.catch(() => {})
    }
    try {
      assertActive()
      commandSignal?.throwIfAborted()
      activeCommand = command
      commandSignal?.addEventListener('abort', cancel, { once: true })
      await reportStartup({ state: 'running', phases: [] })
      try {
        assertActive()
        const result = await task()
        assertActive()
        const previous = await startup()
        const process = await status()
        assertActive()
        await reportStartup({
          ...previous,
          state: process.running ? 'passed' : 'stopped',
        })
        assertActive()
        return result
      } catch (error) {
        await command.cancellation
        await reportStartup({ ...(await startup()), state: 'failed', error: error.message })
        throw error
      }
    } finally {
      commandSignal?.removeEventListener('abort', cancel)
      try {
        await command.cancellation
      } finally {
        if (activeCommand === command) activeCommand = undefined
        await release()
      }
    }
  }

  async function reportStartup(state) {
    await mkdir(stateRoot, { recursive: true })
    const path = join(stateRoot, 'startup.json')
    await writeFile(`${path}.tmp`, JSON.stringify(state))
    await rename(`${path}.tmp`, path)
  }

  const startup = async () =>
    (await readJson(join(stateRoot, 'startup.json'))) ?? { state: 'pending' }

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

  function terminateCommands({ stopFrontend = true } = {}) {
    // Shutdown must still stop Vite while a check cancellation is in progress.
    if (termination) return stopFrontend ? Promise.all([termination, stop()]) : termination
    termination = (async () => {
      const active = [...commands]
      active.forEach((child) => {
        if (child.pid) kill(child.pid, 'SIGTERM')
      })
      if (stopFrontend) await stop()
      for (
        let attempt = 0;
        attempt < 50 && active.some((child) => commands.has(child));
        attempt += 1
      ) {
        await wait(100)
      }
      active.forEach((child) => {
        if (child.pid && commands.has(child)) kill(child.pid, 'SIGKILL')
      })
    })().finally(() => {
      termination = undefined
    })
    return termination
  }

  return {
    exclusive,
    status,
    start,
    stop,
    assertActive,
    shutdown: async () => {
      closing = true
      await terminateCommands()
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
      assertActive()
      if (typeof sessionToken !== 'string' || !/^[-\w]+\.[-\w]+\.[-\w]+$/.test(sessionToken))
        throw new Error('Dashboard returned an invalid session token')
      await mkdir(dirname(tokenFile), { recursive: true })
      await mkdir(stateRoot, { recursive: true })
      assertActive()
      await writeFile(tokenFile, `${sessionToken}\n`, { mode: 0o600 })
      await writeFile(join(stateRoot, 'identity.json'), JSON.stringify(identity), { mode: 0o600 })
    },
    logs: async (source = 'vite') => {
      if (!['startup', 'vite'].includes(source)) throw new Error('Unknown frontend log source')
      return readLogTail(join(stateRoot, `${source}.log`))
    },
    startup,
    reportStartup,
  }
}
