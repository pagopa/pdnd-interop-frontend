// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execute = promisify(execFile)
const frontendRoot = fileURLToPath(new URL('../..', import.meta.url))

describe('local development networking', () => {
  let directory
  let environment

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'interop-local-networking-'))
    environment = { ...process.env, PATH: `${directory}:${process.env.PATH}` }
    delete environment.INTEROP_DEVCONTAINER
    delete environment.PLAYWRIGHT_BASE_URL
    delete environment.PLAYWRIGHT_HOST_GATEWAY
    delete environment.PLAYWRIGHT_PUBLIC_FRONTEND_URL
    environment.NETWORK_TEST_RESULT = join(directory, 'result.json')
    await writeFile(
      join(directory, 'pnpm'),
      `#!/usr/bin/env node
require('node:fs').writeFileSync(process.env.NETWORK_TEST_RESULT, JSON.stringify({
  arguments: process.argv.slice(2),
  gateway: process.env.PLAYWRIGHT_HOST_GATEWAY,
  publicFrontendUrl: process.env.PLAYWRIGHT_PUBLIC_FRONTEND_URL,
  baseURL: process.env.PLAYWRIGHT_BASE_URL,
}))
`,
      { mode: 0o755 }
    )
    await writeFile(
      join(directory, 'getent'),
      '#!/usr/bin/env bash\nprintf "192.0.2.10 STREAM host.docker.internal\\n"\n',
      { mode: 0o755 }
    )
  })

  afterEach(async () => rm(directory, { recursive: true, force: true }))

  async function runScript(name, args = []) {
    await execute('bash', [join(frontendRoot, 'scripts/local-development', name), ...args], {
      env: environment,
    })
    return JSON.parse(await readFile(environment.NETWORK_TEST_RESULT, 'utf8'))
  }

  it('keeps host tests on localhost even when the Docker hostname resolves', async () => {
    expect(await runScript('run-e2e.sh', ['--list'])).toEqual({
      arguments: ['exec', 'playwright', 'test', 'e2e', '--list'],
    })
  })

  it.each([undefined, 'http://localhost:3000', 'http://localhost:3000/'])(
    'routes devcontainer browser and HTTP checks through the published frontend (%s)',
    async (baseURL) => {
      environment.INTEROP_DEVCONTAINER = 'true'
      if (baseURL) environment.PLAYWRIGHT_BASE_URL = baseURL
      expect(await runScript('run-e2e.sh')).toMatchObject({
        gateway: '192.0.2.10',
        publicFrontendUrl: 'http://host.docker.internal:3000/ui/it/',
      })
    }
  )

  it('fails before testing the internal catalog when the container gateway is unavailable', async () => {
    environment.INTEROP_DEVCONTAINER = 'true'
    await writeFile(join(directory, 'getent'), '#!/usr/bin/env bash\nexit 2\n', { mode: 0o755 })
    await expect(runScript('run-e2e.sh')).rejects.toMatchObject({
      stderr: expect.stringContaining('host.docker.internal'),
    })
    await expect(readFile(environment.NETWORK_TEST_RESULT)).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })

  it('preserves explicit browser and HTTP gateway overrides', async () => {
    environment.INTEROP_DEVCONTAINER = 'true'
    environment.PLAYWRIGHT_HOST_GATEWAY = '192.0.2.20'
    environment.PLAYWRIGHT_PUBLIC_FRONTEND_URL = 'http://192.0.2.20:3000/ui/it/'
    await writeFile(join(directory, 'getent'), '#!/usr/bin/env bash\nexit 2\n', { mode: 0o755 })
    expect(await runScript('run-e2e.sh')).toMatchObject({
      gateway: '192.0.2.20',
      publicFrontendUrl: 'http://192.0.2.20:3000/ui/it/',
    })
  })

  it('uses an explicitly selected frontend without applying the public-port gateway', async () => {
    environment.INTEROP_DEVCONTAINER = 'true'
    environment.PLAYWRIGHT_BASE_URL = 'http://localhost:5173'
    expect(await runScript('run-e2e.sh')).toEqual({
      arguments: ['exec', 'playwright', 'test', 'e2e'],
      baseURL: 'http://localhost:5173',
    })
  })

  it('asks Vite to reject a busy frontend port', async () => {
    const result = await runScript('run-frontend.sh', ['bootstrap'])
    expect(result.arguments).toContain('--strictPort')
  })
})
