import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const config = JSON.parse(
  await readFile(new URL('../../.devcontainer/devcontainer.json', import.meta.url), 'utf8')
)

test('publishes only the frontend through the devcontainer', () => {
  assert.deepEqual(config.appPort, ['3000:5173'])
  assert.deepEqual(config.forwardPorts, [5173])
  assert.equal(config.portsAttributes['5173'].onAutoForward, 'openBrowser')
  assert.equal(config.otherPortsAttributes.onAutoForward, 'ignore')
})

test('does not open a new VS Code window when the frontend is ready', async () => {
  const startupScripts = await Promise.all([
    readFile(new URL('./run-startup.sh', import.meta.url), 'utf8'),
    readFile(new URL('./dashboard.sh', import.meta.url), 'utf8'),
  ])

  for (const script of startupScripts) {
    assert.doesNotMatch(script, /code --open-url/)
  }
})

test('does not share personal Codex state with the devcontainer', () => {
  assert.equal(
    config.mounts.some((mount) => mount.includes('.codex')),
    false
  )
  assert.equal(config.customizations.vscode.extensions.includes('openai.chatgpt'), false)
})

test('uses the canonical frontend route with its trailing slash', async () => {
  const files = await Promise.all([
    readFile(new URL('./dashboard.sh', import.meta.url), 'utf8'),
    readFile(new URL('./fullstack.sh', import.meta.url), 'utf8'),
    readFile(new URL('./run-e2e.sh', import.meta.url), 'utf8'),
    readFile(new URL('./run-startup.sh', import.meta.url), 'utf8'),
    readFile(new URL('../../e2e/local-full-stack.spec.ts', import.meta.url), 'utf8'),
    readFile(new URL('../../docs/local-full-stack.md', import.meta.url), 'utf8'),
  ])

  for (const file of files) {
    assert.doesNotMatch(file, /:3000\/ui\/it(?!\/)/)
  }
})

test('runs browser checks on a Linux host without host.docker.internal', async () => {
  const fakeBin = await mkdtemp(join(tmpdir(), 'interop-e2e-test-'))
  const getent = join(fakeBin, 'getent')
  const pnpm = join(fakeBin, 'pnpm')

  try {
    await writeFile(getent, '#!/bin/sh\nexit 2\n')
    await writeFile(pnpm, '#!/bin/sh\nexit 0\n')
    await Promise.all([chmod(getent, 0o755), chmod(pnpm, 0o755)])

    const result = spawnSync(fileURLToPath(new URL('./run-e2e.sh', import.meta.url)), [], {
      env: { ...process.env, PATH: `${fakeBin}:${process.env.PATH}` },
      encoding: 'utf8',
    })

    assert.equal(result.status, 0, result.stderr)
  } finally {
    await rm(fakeBin, { recursive: true, force: true })
  }
})

test('records an explicit stopped state when the local stack stops', async () => {
  const fullstack = await readFile(new URL('./fullstack.sh', import.meta.url), 'utf8')
  assert.match(fullstack, /printf ['"]stopped\\n['"] > "\$STATUS_FILE"/)
})

test('starts Vite in dashboard mode before Docker and enables only local middleware', async () => {
  const [fullstack, frontendRunner, viteConfig] = await Promise.all([
    readFile(new URL('./fullstack.sh', import.meta.url), 'utf8'),
    readFile(new URL('./run-frontend.sh', import.meta.url), 'utf8'),
    readFile(new URL('../../vite.config.ts', import.meta.url), 'utf8'),
  ])

  assert.ok(fullstack.indexOf('restart_frontend bootstrap') < fullstack.indexOf('docker info'))
  assert.match(frontendRunner, /REACT_APP_LOCAL_DASHBOARD/)
  assert.match(frontendRunner, /INTEROP_LOCAL_DEVELOPMENT/)
  assert.match(frontendRunner, /bootstrap/)
  assert.match(viteConfig, /localDashboardPlugin/)
  assert.match(viteConfig, /INTEROP_LOCAL_DEVELOPMENT === 'true'/)
})

test("presents clickable host URLs instead of Vite's internal health-check URL", async () => {
  const [fullstack, startup] = await Promise.all([
    readFile(new URL('./fullstack.sh', import.meta.url), 'utf8'),
    readFile(new URL('./run-startup.sh', import.meta.url), 'utf8'),
  ])

  assert.doesNotMatch(fullstack, /Waiting for frontend at http:\/\/localhost:5173/)
  assert.match(fullstack, /http:\/\/localhost:3000\$ready_path/)
  assert.match(startup, /Dashboard ready: .*http:\/\/localhost:3000\/ui\/local-dashboard\//)
})
