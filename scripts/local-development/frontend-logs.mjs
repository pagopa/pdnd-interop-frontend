import { open, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { requestJson } from './dashboard-client.mjs'

const defaultRoot = fileURLToPath(new URL('../..', import.meta.url))

export async function requestHostDashboard(root = defaultRoot, request) {
  const state = join(root, '.local-development/frontend')
  const current = (await readFile(join(state, 'browser-request'), 'utf8')).trim()
  const session = request ?? current
  if (!/^browser-open\.[a-zA-Z0-9]{8}$/.test(session) || session !== current)
    throw new Error('Invalid browser request')
  await writeFile(join(state, session, 'ready'), '')
}

export function createStartupLogFollower({
  root = defaultRoot,
  request = requestJson,
  write = (content) => process.stdout.write(content),
  openDashboard,
} = {}) {
  let offset
  let inode
  let cursors = {}
  let waiting = false
  let opened = false

  async function frontend() {
    let file
    try {
      file = await open(join(root, '.local-development/frontend/startup.log'), 'r')
      const { size, ino } = await file.stat()
      if (inode !== ino || offset === undefined || size < offset) {
        offset = Math.max(0, size - 65_536)
        inode = ino
      }
      const length = Math.min(size - offset, 65_536)
      if (length === 0) return
      const buffer = Buffer.alloc(length)
      const { bytesRead } = await file.read(buffer, 0, length, offset)
      offset += bytesRead
      if (bytesRead) write(`[frontend] ${buffer.subarray(0, bytesRead).toString('utf8')}`)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    } finally {
      await file?.close()
    }
  }

  return {
    poll: async () => {
      await frontend()
      if (openDashboard && !opened) {
        try {
          if ((await request('health')).status === 'ok') {
            opened = true
            const url = 'http://localhost:8076/#/status'
            write(`[backend] Dashboard: ${url}\n`)
            try {
              await openDashboard(url)
            } catch {
              write(`[backend] Cannot request automatic browser opening; open ${url}\n`)
            }
          }
        } catch {
          // A container can attach while the dashboard is still building.
        }
      }
      try {
        const query = new URLSearchParams({
          source: 'orchestration',
          limit: '200',
          cursors: JSON.stringify(cursors),
        })
        const logs = await request(`logs?${query}`)
        if (waiting) write('[backend] Dashboard logs connected\n')
        waiting = false
        // The query follows one source. Keep only its cursor and no log history.
        cursors = logs.cursors.orchestration ? { orchestration: logs.cursors.orchestration } : {}
        for (const { source, message } of logs.entries) write(`[${source}] ${message}\n`)
      } catch {
        if (!waiting) write('[backend] Waiting for backend dashboard logs…\n')
        waiting = true
      }
    },
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const request = readFile(join(defaultRoot, '.local-development/frontend/browser-request'), 'utf8')
    .then((value) => value.trim())
    .catch(() => undefined)
  const follower = createStartupLogFollower({
    openDashboard: async () => {
      const session = await request
      if (!session) throw new Error('Host browser opener unavailable')
      await requestHostDashboard(defaultRoot, session)
    },
  })
  for (;;) {
    await follower.poll()
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
