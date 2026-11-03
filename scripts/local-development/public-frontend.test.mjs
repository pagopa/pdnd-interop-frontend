// @vitest-environment node
import { expect, it } from 'vitest'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

it('checks the configured public frontend with the Node HTTP client', async () => {
  const requests = []
  const server = createServer((request, response) => {
    requests.push(request.url)
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end('<title>PDND Interoperabilità | PagoPA</title>')
  })
  const directory = await mkdtemp(join(tmpdir(), 'interop-public-frontend-'))
  const environment = { ...process.env }
  delete environment.PLAYWRIGHT_HOST_GATEWAY
  delete environment.PLAYWRIGHT_PUBLIC_FRONTEND_URL

  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    environment.PLAYWRIGHT_BASE_URL = `http://127.0.0.1:${server.address().port}`
    const result = await new Promise((resolve, reject) => {
      // This smoke check only uses Playwright's request fixture; Chromium is not started.
      const child = spawn(
        'pnpm',
        [
          'exec',
          'playwright',
          'test',
          'e2e/local-full-stack.spec.ts',
          '--grep=publishes the frontend',
          '--timeout=5000',
          `--output=${directory}`,
        ],
        { env: environment }
      )
      let output = ''
      child.stdout.on('data', (data) => (output += data))
      child.stderr.on('data', (data) => (output += data))
      child.on('error', reject)
      child.on('close', (code) => resolve({ code, output }))
    })
    expect(result, result.output).toMatchObject({ code: 0 })
    expect(requests).toEqual(['/ui/it/'])
  } finally {
    await new Promise((resolve) => server.close(resolve))
    await rm(directory, { recursive: true, force: true })
  }
}, 15_000)
