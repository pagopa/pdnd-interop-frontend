import { open } from 'node:fs/promises'
import { createServer } from 'node:http'
import { requestJson, runFrontendAction, waitForDashboard } from './dashboard-client.mjs'

const maximumBody = 65_536

function exactKeys(value, keys) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === keys.length &&
    keys.every((key) => Object.hasOwn(value, key))
  )
}

function validCommand(command) {
  if (
    exactKeys(command, ['type']) &&
    ['install', 'stop', 'smoke', 'browser'].includes(command.type)
  )
    return true
  if (command?.type !== 'start') return false
  if (command.mode === 'dev') return exactKeys(command, ['type', 'mode'])
  return (
    command.mode === 'local' &&
    exactKeys(command, ['type', 'mode', 'sessionToken', 'identity']) &&
    typeof command.sessionToken === 'string' &&
    /^[-\w]+\.[-\w]+\.[-\w]+$/.test(command.sessionToken) &&
    exactKeys(command.identity, ['tenantKey', 'userKey']) &&
    [command.identity.tenantKey, command.identity.userKey].every(
      (key) => typeof key === 'string' && key.trim().length > 0
    )
  )
}

function readCommand(request) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > maximumBody) {
        chunks.length = 0
        reject(Object.assign(new Error('Command body is too large'), { status: 413 }))
      } else chunks.push(chunk)
    })
    request.once('error', reject)
    request.once('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(Object.assign(new Error('Invalid command JSON'), { status: 400 }))
      }
    })
  })
}

async function executeCommand(runtime, command, signal) {
  await runtime.exclusive(
    async () => {
      try {
        signal.throwIfAborted()
        switch (command.type) {
          case 'install':
            return await runtime.install()
          case 'stop':
            return await runtime.stop()
          case 'smoke':
            return await runtime.smoke()
          case 'browser':
            return await runtime.browserChecks()
          case 'start':
            await runtime.stop()
            signal.throwIfAborted()
            if (command.mode === 'local')
              await runtime.storeToken(command.sessionToken, command.identity)
            signal.throwIfAborted()
            return await runtime.start(command.mode)
        }
      } catch (error) {
        // Runtime failures are persisted as well as returned to the dashboard.
        throw new Error(
          command.sessionToken
            ? error.message.replaceAll(command.sessionToken, '[redacted]')
            : error.message
        )
      }
    },
    { signal, stopFrontendOnAbort: !['smoke', 'browser'].includes(command.type) }
  )
}

export async function readLogTail(path) {
  let file
  try {
    file = await open(path, 'r')
    const { size } = await file.stat()
    const length = Math.min(size, 65_536)
    const buffer = Buffer.alloc(length)
    const { bytesRead } = await file.read(buffer, 0, length, size - length)
    return buffer.subarray(0, bytesRead).toString('utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return ''
    throw error
  } finally {
    await file?.close()
  }
}

export async function startFrontendAgent({
  runtime,
  port = Number(
    process.env.INTEROP_FRONTEND_AGENT_PORT ?? process.env.INTEROP_FRONTEND_OBSERVER_PORT ?? 8077
  ),
  host = '0.0.0.0',
}) {
  let closing = false
  const server = createServer(async (request, response) => {
    const send = (code, result) => {
      if (response.destroyed) return
      response.writeHead(code, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...(closing ? { Connection: 'close' } : {}),
      })
      response.end(JSON.stringify(result))
    }
    try {
      const url = new URL(request.url, 'http://frontend-agent')
      if (url.pathname === '/commands' && !url.search && request.method === 'POST') {
        if (
          request.headers.origin ||
          (request.headers['sec-fetch-site'] && request.headers['sec-fetch-site'] !== 'none')
        ) {
          send(403, { error: 'Browser mutations are not allowed' })
          return
        }
        if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] ?? '')) {
          send(415, { error: 'Commands require application/json' })
          return
        }
        const command = await readCommand(request)
        if (!validCommand(command)) {
          send(400, { error: 'Unknown or invalid frontend command' })
          return
        }
        const controller = new AbortController()
        const disconnected = () => {
          if (!response.writableFinished)
            controller.abort(new Error('Frontend command disconnected'))
        }
        response.once('close', disconnected)
        if (response.destroyed) disconnected()
        try {
          await executeCommand(runtime, command, controller.signal)
          send(200, {})
        } catch (error) {
          send(409, { error: error.message })
        } finally {
          response.removeListener('close', disconnected)
        }
        return
      }
      if (request.method !== 'GET') {
        response.setHeader('Allow', url.pathname === '/commands' ? 'GET, POST' : 'GET')
        send(405, { error: 'Method not allowed' })
        return
      }
      if (url.pathname === '/status' && !url.search) {
        const [startup, process, identity] = await Promise.all([
          runtime.startup(),
          runtime.status(),
          runtime.identity(),
        ])
        send(200, {
          available: true,
          state: startup.state === 'passed' && !process.running ? 'stopped' : startup.state,
          running: process.running,
          ...(process.mode ? { mode: process.mode } : {}),
          phases: startup.phases ?? [],
          identity: { tenantKey: identity.tenantKey, userKey: identity.userKey },
          ...(startup.error ? { error: startup.error } : {}),
        })
      } else if (
        url.pathname === '/logs' &&
        [...url.searchParams].length === 1 &&
        ['startup', 'vite'].includes(url.searchParams.get('source'))
      ) {
        send(200, { content: await runtime.logs(url.searchParams.get('source')) })
      } else send(404, { error: 'Not found' })
    } catch (error) {
      send(error.status ?? 500, {
        error: error.status ? error.message : 'Frontend observation failed',
      })
    }
  })
  server.requestTimeout = 20 * 60_000
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, resolve)
  })
  return {
    port: server.address().port,
    close: () =>
      new Promise((resolve, reject) => {
        closing = true
        server.close((error) => (error ? reject(error) : resolve()))
        server.closeIdleConnections()
      }),
  }
}

export async function serveFrontend({
  runtime,
  request = requestJson,
  pause,
  signals = process,
  keepAlive = () => setInterval(() => {}, 60_000),
  clearKeepAlive = clearInterval,
  reportError = (error) => console.error(error.message),
  listen = () => startFrontendAgent({ runtime }),
}) {
  const timer = keepAlive()
  const controller = new AbortController()
  let listening
  let stopping = false
  const shutdown = () => {
    if (stopping) return
    stopping = true
    controller.abort(new Error('Frontend runtime is shutting down'))
    void (async () => {
      try {
        await runtime.shutdown()
      } finally {
        try {
          const agent = await listening?.catch(() => undefined)
          await agent?.close()
        } finally {
          clearKeepAlive(timer)
        }
      }
    })().catch(reportError)
  }
  signals.once('SIGINT', shutdown)
  signals.once('SIGTERM', shutdown)
  try {
    listening = Promise.resolve().then(listen)
    await listening
    controller.signal.throwIfAborted()
    const options = { request, pause, signal: controller.signal }
    console.log('Waiting for the backend dashboard API')
    await waitForDashboard(options)
    console.log('Backend dashboard API is ready')
    await runFrontendAction({ type: 'start' }, options)
    console.log('Frontend ready: http://localhost:3000/ui/it/')
  } catch (error) {
    if (!stopping) {
      reportError(error)
      console.error(
        'The frontend container remains available. Fix the error and retry pnpm local:start.'
      )
    }
  }
}
