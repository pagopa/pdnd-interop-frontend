import { open } from 'node:fs/promises'
import { createServer } from 'node:http'

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

export async function startFrontendObserver({
  runtime,
  port = Number(process.env.INTEROP_FRONTEND_OBSERVER_PORT ?? 8077),
  host = '0.0.0.0',
}) {
  const server = createServer(async (request, response) => {
    const send = (code, result) => {
      response.writeHead(code, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      })
      response.end(JSON.stringify(result))
    }
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET')
      send(405, { error: 'Method not allowed' })
      return
    }
    try {
      const url = new URL(request.url, 'http://frontend-observer')
      if (url.pathname === '/status' && !url.search) {
        const [startup, process] = await Promise.all([runtime.startup(), runtime.status()])
        send(200, {
          available: true,
          state: startup.state === 'passed' && !process.running ? 'stopped' : startup.state,
          running: process.running,
          ...(process.mode ? { mode: process.mode } : {}),
          phases: startup.phases ?? [],
          ...(startup.error ? { error: startup.error } : {}),
        })
      } else if (
        url.pathname === '/logs' &&
        [...url.searchParams].length === 1 &&
        ['startup', 'vite'].includes(url.searchParams.get('source'))
      ) {
        send(200, { content: await runtime.logs(url.searchParams.get('source')) })
      } else send(404, { error: 'Not found' })
    } catch {
      send(500, { error: 'Frontend observation failed' })
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, resolve)
  })
  return {
    port: server.address().port,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
        server.closeIdleConnections()
      }),
  }
}
