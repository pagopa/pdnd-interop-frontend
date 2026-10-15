// @vitest-environment node
import { afterEach, expect, it } from 'vitest'
import { execFile } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execute = promisify(execFile)
const sourceRoot = fileURLToPath(new URL('../../..', import.meta.url))
const roots = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

async function fixture({ startupFailure = false, dashboardRunning = false } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'interop-frontend-compose-'))
  roots.push(directory)
  const frontend = join(directory, 'frontend')
  const backend = join(directory, 'backend')
  const bin = join(directory, 'bin')
  await mkdir(bin)
  await mkdir(frontend)
  await cp(join(sourceRoot, '.devcontainer'), join(frontend, '.devcontainer'), { recursive: true })
  await cp(
    join(sourceRoot, 'scripts/local-development'),
    join(frontend, 'scripts/local-development'),
    { recursive: true }
  )
  await mkdir(join(backend, '.git'), { recursive: true })
  await mkdir(join(backend, 'scripts/local-development'), { recursive: true })
  await writeFile(
    join(backend, 'scripts/local-development/dashboard.sh'),
    '#!/usr/bin/env bash\nmkdir -p "$INTEROP_BE_ROOT/.local-development/dashboard"\nprintf \'{"services":{"dashboard":{}}}\\n\' > "$INTEROP_BE_ROOT/.local-development/dashboard/compose.yml"\n'
  )
  const stateFile = join(directory, 'docker-state.json')
  const callsFile = join(directory, 'docker-calls.jsonl')
  await writeFile(
    stateFile,
    JSON.stringify({ running: false, dashboardRunning, vite: false, startup: 'pending' })
  )
  await writeFile(
    join(bin, 'docker'),
    `#!/usr/bin/env node
const fs = require('node:fs'); const args = process.argv.slice(2);
fs.appendFileSync(process.env.DOCKER_TEST_CALLS, JSON.stringify(args) + '\\n');
const state = JSON.parse(fs.readFileSync(process.env.DOCKER_TEST_STATE));
if (args[0] === 'inspect') {
  console.log(args.at(-1) === 'dashboard-1' ? String(state.dashboardRunning) : args[2].includes('Health') ? (state.startup === 'failed' ? 'starting' : state.vite ? 'healthy' : 'unhealthy') : String(state.running));
} else if (args.includes('up')) {
  if (args.at(-1) === 'dashboard') state.dashboardRunning = true;
  if (args.includes('frontend') && !state.running) {
    state.running = true; state.vite = !process.env.DOCKER_TEST_FAILURE;
    state.startup = process.env.DOCKER_TEST_FAILURE ? 'failed' : 'passed';
  }
} else if (args.includes('ps')) {
  if (args.at(-1) === 'dashboard') { if (state.dashboardRunning) console.log('dashboard-1'); }
  else if (state.running) console.log('frontend-1');
} else if (args.includes('exec')) {
  if (args.at(-1) === 'startup-state') console.log(state.startup);
  else if (args.at(-1) === 'stop') { state.vite = false; state.startup = 'stopped'; }
  else if (args.at(-1) === 'start') { state.vite = true; state.startup = 'passed'; }
}
fs.writeFileSync(process.env.DOCKER_TEST_STATE, JSON.stringify(state));
`,
    { mode: 0o755 }
  )
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    INTEROP_BE_ROOT: backend,
    DOCKER_TEST_STATE: stateFile,
    DOCKER_TEST_CALLS: callsFile,
    ...(startupFailure ? { DOCKER_TEST_FAILURE: 'true' } : {}),
  }
  delete env.INTEROP_FRONTEND_RUNTIME
  const run = (command) =>
    execute('bash', [join(frontend, 'scripts/local-development/fullstack.sh'), command], { env })
  return { frontend, backend, run, callsFile, stateFile }
}

it('restarts the frontend launcher when a host start follows stop on the same container', async () => {
  const { run, stateFile, callsFile } = await fixture()
  await run('start')
  await run('stop')
  await run('start')
  expect(JSON.parse(await readFile(stateFile, 'utf8')).vite).toBe(true)
  const calls = (await readFile(callsFile, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))
  expect(calls.some((args) => args.includes('exec') && args.at(-1) === 'start')).toBe(true)
})

it('reconciles a running standalone dashboard before frontend startup without rebuilding it', async () => {
  const { run, callsFile } = await fixture({ dashboardRunning: true })
  await run('start')
  await run('start')
  const calls = (await readFile(callsFile, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))
  const startupCalls = calls.filter((args) => args.includes('up'))
  expect(startupCalls.map((args) => args.slice(args.indexOf('up')))).toEqual([
    ['up', '-d', '--no-build', '--no-deps', 'dashboard'],
    ['up', '-d', '--build', '--no-deps', 'frontend'],
    ['up', '-d', '--no-build', '--no-deps', 'dashboard'],
    ['up', '-d', '--build', '--no-deps', 'frontend'],
  ])
})

it('generates only machine-specific frontend configuration', async () => {
  const { frontend, run, callsFile } = await fixture()
  await run('start')
  const config = JSON.parse(
    await readFile(join(frontend, '.local-development/frontend/compose.yml'), 'utf8')
  )
  expect(config).toEqual({
    services: {
      frontend: {
        build: { context: join(frontend, '.devcontainer') },
        working_dir: frontend,
        environment: {
          INTEROP_FE_ROOT: frontend,
          LOCAL_UID: String(process.getuid()),
          LOCAL_GID: String(process.getgid()),
        },
        volumes: [
          { type: 'bind', source: frontend, target: frontend },
          {
            type: 'volume',
            source: 'frontend-modules',
            target: join(frontend, 'node_modules'),
            volume: { nocopy: true },
          },
        ],
      },
    },
  })
  await run('stop')
  const calls = (await readFile(callsFile, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))
  for (const args of calls.filter((args) => args[0] === 'compose')) {
    const files = args.flatMap((arg, index) => (arg === '-f' ? [args[index + 1]] : []))
    expect(files.slice(-2)).toEqual([
      join(frontend, '.devcontainer/compose.yml'),
      join(frontend, '.local-development/frontend/compose.yml'),
    ])
  }
  const devcontainer = JSON.parse(
    await readFile(join(frontend, '.devcontainer/devcontainer.json'), 'utf8')
  )
  expect(devcontainer.dockerComposeFile.slice(-2)).toEqual([
    'compose.yml',
    '../.local-development/frontend/compose.yml',
  ])
})

it('validates the devcontainer model and build targets without explicitly enabling profiles', async ({
  skip,
}) => {
  try {
    await execute('docker', ['compose', 'version'])
  } catch {
    skip()
    return
  }
  const { frontend, backend, run } = await fixture()
  await run('start')
  const backendCompose = join(backend, 'compose.yml')
  await writeFile(
    backendCompose,
    JSON.stringify({
      services: {
        infrastructure: { image: 'busybox:1.37' },
        dashboard: {
          profiles: ['dashboard'],
          build: { context: backend },
          healthcheck: { test: ['CMD', 'true'] },
        },
      },
    })
  )
  const compose = [
    'compose',
    '-f',
    backendCompose,
    '-f',
    join(frontend, '.devcontainer/compose.yml'),
    '-f',
    join(frontend, '.local-development/frontend/compose.yml'),
  ]
  const env = { ...process.env, COMPOSE_PROFILES: '', COMPOSE_DISABLE_ENV_FILE: 'true' }
  await execute('docker', [...compose, 'config', '--quiet'], { env })
  const { stdout: configJson } = await execute(
    'docker',
    [...compose, '--profile', 'dashboard', 'config', '--format', 'json'],
    { env }
  )
  const config = JSON.parse(configJson)
  const service = config.services.frontend
  expect(service.profiles).toEqual(['dashboard'])
  expect(config.services.dashboard.profiles).toEqual(['dashboard'])
  expect(config.services.dashboard.environment).toMatchObject({
    DASHBOARD_FRONTEND_URL: 'http://frontend:8077',
    DASHBOARD_AUTOSTART: 'false',
  })
  expect(service.environment).toMatchObject({
    INTEROP_DASHBOARD_URL: 'http://dashboard:8076',
    INTEROP_LOCAL_BACKEND_TARGET: 'http://dashboard:3600',
    INTEROP_SELFCARE_URL: 'http://host.docker.internal:8006',
    INTEROP_DEVCONTAINER: 'true',
    INTEROP_FRONTEND_RUNTIME: 'true',
    INTEROP_FRONTEND_PORT: '5173',
  })
  expect(service.environment).not.toHaveProperty('INTEROP_BE_ROOT')
  expect(service.build.context).toBe(join(frontend, '.devcontainer'))
  expect(service.volumes.filter(({ type }) => type === 'bind')).toEqual([
    { type: 'bind', source: frontend, target: frontend },
  ])
  expect(service.volumes.filter(({ type }) => type === 'volume')).toHaveLength(3)
  expect(JSON.stringify(service)).not.toContain('/var/run/docker.sock')
  expect(service.ports).toMatchObject([{ published: '3000', target: 5173 }])
  expect(service.init).toBe(true)
  expect(service.depends_on.dashboard.condition).toBe('service_started')
  expect(service.healthcheck).toEqual({
    test: ['CMD', 'node', 'scripts/local-development/dashboard-client.mjs', 'startup-status'],
    interval: '5s',
    timeout: '5s',
    retries: 3,
    start_period: '30m0s',
  })
  const { stdout } = await execute(
    'docker',
    [...compose, 'build', '--no-cache', '--print', 'dashboard', 'frontend'],
    { env }
  )
  expect(JSON.parse(stdout).group.default.targets.sort()).toEqual(['dashboard', 'frontend'])
})

it('reports failed startup immediately while leaving its editor container running', async () => {
  const { run, stateFile, callsFile } = await fixture({ startupFailure: true })
  await expect(run('start')).rejects.toThrow()
  expect(JSON.parse(await readFile(stateFile, 'utf8')).running).toBe(true)
  const calls = (await readFile(callsFile, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))
  expect(calls.filter((args) => args[0] === 'inspect')).toHaveLength(0)
  expect(calls.some((args) => args.includes('logs'))).toBe(true)
})

it('preserves an existing standalone backend overlay and its startup settings', async () => {
  const { backend, run } = await fixture()
  const directory = join(backend, '.local-development/dashboard')
  await mkdir(directory, { recursive: true })
  const path = join(directory, 'compose.yml')
  const original = JSON.stringify({
    services: {
      dashboard: {
        environment: { DASHBOARD_AUTOSTART: 'false', DASHBOARD_AUTOSTART_PRESET: 'tenant-seeding' },
      },
    },
  })
  await writeFile(path, original)
  await run('start')
  expect(await readFile(path, 'utf8')).toBe(original)
})
