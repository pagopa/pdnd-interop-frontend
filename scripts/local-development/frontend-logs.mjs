import { open } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { requestJson } from './dashboard-client.mjs'

export function createStartupLogFollower({
  root = fileURLToPath(new URL('../..', import.meta.url)),
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
            try {
              await openDashboard(url)
            } catch {
              write(`[backend] Cannot open VS Code browser automatically; open ${url}\n`)
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
  const follower = createStartupLogFollower({
    openDashboard: async (url) => {
      if (!process.env.VSCODE_IPC_HOOK_CLI) throw new Error('VS Code remote CLI unavailable')
      await promisify(execFile)('code', ['--openExternal', url], { timeout: 10_000 })
    },
  })
  for (;;) {
    await follower.poll()
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
