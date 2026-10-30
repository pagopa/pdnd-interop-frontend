// @vitest-environment node
import { afterEach, expect, it } from 'vitest'
import { execFile } from 'node:child_process'
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
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

async function fixture({
  startupFailure = false,
  checksFailure = false,
  dashboardRunning = false,
  directoryPrefix = 'interop-frontend-compose-',
} = {}) {
  const directory = await mkdtemp(join(tmpdir(), directoryPrefix))
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
  const backendCallsFile = join(directory, 'backend-calls.txt')
  const prepareInputFile = join(backend, 'prepare-input.json')
  const prepareFailureFile = join(backend, 'prepare-failure')
  await writeFile(prepareInputFile, JSON.stringify({ services: { dashboard: {} } }))
  await writeFile(
    join(backend, 'scripts/local-development/dashboard.sh'),
    `#!/usr/bin/env bash
set -euo pipefail
[[ "$1" == prepare ]]
printf '%s:%s\\n' "$1" "$INTEROP_BE_ROOT" >> "$DASHBOARD_TEST_CALLS"
if [[ -f "$INTEROP_BE_ROOT/prepare-failure" ]]; then
  echo 'Backend preparation failed' >&2
  exit 1
fi
mkdir -p "$INTEROP_BE_ROOT/.local-development/dashboard"
cp "$INTEROP_BE_ROOT/prepare-input.json" "$INTEROP_BE_ROOT/.local-development/dashboard/compose.yml.tmp"
mv "$INTEROP_BE_ROOT/.local-development/dashboard/compose.yml.tmp" "$INTEROP_BE_ROOT/.local-development/dashboard/compose.yml"
`
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
  console.log(args.at(-1) === 'dashboard-1' ? String(state.dashboardRunning) : args[2].includes('Health') ? (process.env.DOCKER_TEST_CHECKS_FAILURE && state.vite ? 'healthy' : state.startup === 'failed' ? 'starting' : state.vite ? 'healthy' : 'unhealthy') : String(state.running));
} else if (args.includes('up')) {
  if (args.at(-1) === 'dashboard') state.dashboardRunning = true;
  if (args.includes('frontend') && !state.running) {
    state.running = true; state.vite = !process.env.DOCKER_TEST_FAILURE;
    state.startup = process.env.DOCKER_TEST_FAILURE ? 'failed' : process.env.DOCKER_TEST_CHECKS_FAILURE ? 'running' : 'passed';
  }
} else if (args.includes('ps')) {
  if (args.at(-1) === 'dashboard') { if (state.dashboardRunning) console.log('dashboard-1'); }
  else if (state.running) console.log('frontend-1');
} else if (args.includes('exec')) {
  if (args.at(-1) === 'startup-state') {
    console.log(state.startup);
    if (process.env.DOCKER_TEST_CHECKS_FAILURE && state.startup === 'running') state.startup = 'failed';
  }
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
    INTEROP_FE_ROOT: frontend,
    INTEROP_BE_ROOT: backend,
    DOCKER_TEST_STATE: stateFile,
    DOCKER_TEST_CALLS: callsFile,
    DASHBOARD_TEST_CALLS: backendCallsFile,
    ...(startupFailure ? { DOCKER_TEST_FAILURE: 'true' } : {}),
    ...(checksFailure ? { DOCKER_TEST_CHECKS_FAILURE: 'true' } : {}),
  }
  delete env.INTEROP_FRONTEND_RUNTIME
  const run = (command) =>
    execute('bash', [join(frontend, 'scripts/local-development/fullstack.sh'), command], { env })
  return {
    frontend,
    backend,
    bin,
    run,
    env,
    callsFile,
    stateFile,
    backendCallsFile,
    prepareInputFile,
    prepareFailureFile,
  }
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
  const { frontend, backend, run, callsFile } = await fixture()
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
          INTEROP_BE_ROOT: backend,
          LOCAL_UID: process.platform === 'darwin' ? '1000' : String(process.getuid()),
          LOCAL_GID: process.platform === 'darwin' ? '1000' : String(process.getgid()),
        },
        volumes: [
          { type: 'bind', source: frontend, target: frontend },
          { type: 'bind', source: backend, target: backend },
          {
            type: 'bind',
            source: backend,
            target: join(frontend, '.local-development/interop-be-monorepo'),
          },
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
    expect(files).toEqual([
      join(backend, 'docker/docker-compose.yml'),
      join(backend, '.local-development/dashboard/compose.yml'),
      join(frontend, '.devcontainer/compose.yml'),
      join(frontend, '.local-development/frontend/compose.yml'),
    ])
  }
  const devcontainer = JSON.parse(
    await readFile(join(frontend, '.devcontainer/devcontainer.json'), 'utf8')
  )
  expect(devcontainer.dockerComposeFile).toEqual([
    '../../interop-be-monorepo/docker/docker-compose.yml',
    '../../interop-be-monorepo/.local-development/dashboard/compose.yml',
    'compose.yml',
    '../.local-development/frontend/compose.yml',
  ])
})

it('preserves literal dollar signs in generated Compose paths', async () => {
  const { frontend, backend, env } = await fixture({
    directoryPrefix: 'interop-$FRONTEND-${BACKEND}-',
  })
  await execute('bash', [join(frontend, '.devcontainer/prepare.sh')], { env })
  const configFile = join(frontend, '.local-development/frontend/compose.yml')
  const config = JSON.parse(await readFile(configFile, 'utf8'))
  const service = config.services.frontend
  const escaped = (value) => value.replaceAll('$', () => '$$')

  expect(service.build.context).toBe(escaped(join(frontend, '.devcontainer')))
  expect(service.working_dir).toBe(escaped(frontend))
  expect(service.environment).toMatchObject({
    INTEROP_FE_ROOT: escaped(frontend),
    INTEROP_BE_ROOT: escaped(backend),
  })
  expect(service.volumes).toEqual([
    { type: 'bind', source: escaped(frontend), target: escaped(frontend) },
    { type: 'bind', source: escaped(backend), target: escaped(backend) },
    {
      type: 'bind',
      source: escaped(backend),
      target: escaped(join(frontend, '.local-development/interop-be-monorepo')),
    },
    {
      type: 'volume',
      source: 'frontend-modules',
      target: escaped(join(frontend, 'node_modules')),
      volume: { nocopy: true },
    },
  ])
})

it.each([
  { platform: 'Darwin', uid: '501', gid: '20', expectedUid: '1000', expectedGid: '1000' },
  { platform: 'Linux', uid: '1234', gid: '2345', expectedUid: '1234', expectedGid: '2345' },
])(
  'selects the container identity for $platform before startup',
  async ({ platform, uid, gid, expectedUid, expectedGid }) => {
    const { frontend, backend, bin } = await fixture()
    await writeFile(join(bin, 'uname'), `#!/bin/sh\nprintf '%s\\n' '${platform}'\n`, {
      mode: 0o755,
    })
    await writeFile(
      join(bin, 'id'),
      `#!/bin/sh\ncase "$1" in -u) printf '%s\\n' '${uid}';; -g) printf '%s\\n' '${gid}';; *) exit 1;; esac\n`,
      { mode: 0o755 }
    )

    await execute('bash', [join(frontend, '.devcontainer/prepare.sh')], {
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        INTEROP_FE_ROOT: frontend,
        INTEROP_BE_ROOT: backend,
      },
    })

    const config = JSON.parse(
      await readFile(join(frontend, '.local-development/frontend/compose.yml'), 'utf8')
    )
    expect(config.services.frontend.environment).toMatchObject({
      LOCAL_UID: expectedUid,
      LOCAL_GID: expectedGid,
    })
  }
)

it('prepares an idempotent real workspace mountpoint for the backend', async () => {
  const { frontend, backend, run } = await fixture()
  await execute('git', ['init', '--quiet', backend])
  await writeFile(join(backend, 'workspace-file.txt'), 'original backend source')
  await run('start')
  const link = join(frontend, '.local-development/interop-be-monorepo')
  expect((await lstat(link)).isSymbolicLink()).toBe(false)
  expect((await lstat(link)).isDirectory()).toBe(true)
  expect(await realpath(link)).toBe(link)
  const config = JSON.parse(
    await readFile(join(frontend, '.local-development/frontend/compose.yml'), 'utf8')
  )
  expect(config.services.frontend.volumes).toContainEqual({
    type: 'bind',
    source: backend,
    target: link,
  })
  expect(await readFile(join(backend, 'workspace-file.txt'), 'utf8')).toBe(
    'original backend source'
  )
  const before = await lstat(link)
  await run('start')
  expect((await lstat(link)).ino).toBe(before.ino)
})

it.each([false, true])('migrates the old backend workspace symlink (stale: %s)', async (stale) => {
  const { frontend, backend, run } = await fixture()
  const link = join(frontend, '.local-development/interop-be-monorepo')
  await mkdir(join(frontend, '.local-development'))
  await writeFile(join(backend, 'keep.txt'), 'existing backend source')
  await symlink(stale ? join(backend, 'missing-checkout') : backend, link)
  await run('start')
  expect((await lstat(link)).isDirectory()).toBe(true)
  expect((await lstat(link)).isSymbolicLink()).toBe(false)
  expect(await readFile(join(backend, 'keep.txt'), 'utf8')).toBe('existing backend source')
})

it('creates the workspace mountpoint after initializing a missing backend checkout', async () => {
  const { frontend, backend, run } = await fixture()
  await rename(backend, `${backend}.seed`)
  await writeFile(
    join(frontend, '../bin/git'),
    '#!/usr/bin/env bash\nset -euo pipefail\n[[ "$1" == clone ]]\ncp -R "$(dirname "${BASH_SOURCE[0]}")/../backend.seed" "${@: -1}"\n',
    { mode: 0o755 }
  )
  await run('start')
  expect(
    (await lstat(join(frontend, '.local-development/interop-be-monorepo'))).isDirectory()
  ).toBe(true)
})

it('preserves a real directory occupying the backend workspace link path', async () => {
  const { frontend, run, callsFile } = await fixture()
  const link = join(frontend, '.local-development/interop-be-monorepo')
  await mkdir(link, { recursive: true })
  await writeFile(join(link, 'keep.txt'), 'local user file')
  await expect(run('start')).rejects.toThrow('is not an empty workspace mountpoint')
  expect(await readFile(join(link, 'keep.txt'), 'utf8')).toBe('local user file')
  await expect(readFile(callsFile)).rejects.toMatchObject({ code: 'ENOENT' })
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
  expect(service.environment.INTEROP_BE_ROOT).toBe(backend)
  expect(service.build.context).toBe(join(frontend, '.devcontainer'))
  expect(service.volumes.filter(({ type }) => type === 'bind')).toEqual([
    { type: 'bind', source: frontend, target: frontend },
    { type: 'bind', source: backend, target: backend },
    {
      type: 'bind',
      source: backend,
      target: join(frontend, '.local-development/interop-be-monorepo'),
    },
  ])
  expect(service.volumes.filter(({ type }) => type === 'volume')).toHaveLength(3)
  expect(JSON.stringify(service)).not.toContain('/var/run/docker.sock')
  expect(service.ports).toMatchObject([{ published: '3000', target: 5173 }])
  expect(service.init).toBe(true)
  expect(service.depends_on.dashboard.condition).toBe('service_started')
  expect(service.healthcheck).toEqual({
    test: ['CMD', 'node', 'scripts/local-development/dashboard-client.mjs', 'runtime-health'],
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

it('waits for checks even when Vite is healthy and preserves it when those checks fail', async () => {
  const { run, stateFile, callsFile } = await fixture({ checksFailure: true })
  await expect(run('start')).rejects.toMatchObject({ code: 1 })
  expect(JSON.parse(await readFile(stateFile, 'utf8'))).toMatchObject({
    running: true,
    dashboardRunning: true,
    vite: true,
    startup: 'failed',
  })
  const calls = (await readFile(callsFile, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))
  expect(calls.filter((args) => args.at(-1) === 'startup-state')).toHaveLength(2)
  expect(calls.some((args) => args.includes('logs'))).toBe(true)
  expect(
    calls.some((args) => ['stop', 'down', 'kill'].some((command) => args.includes(command)))
  ).toBe(false)
})

it('regenerates the backend override at every start after package or environment changes', async () => {
  const { backend, run, prepareInputFile, backendCallsFile } = await fixture()
  await run('start')
  const path = join(backend, '.local-development/dashboard/compose.yml')
  expect(JSON.parse(await readFile(path, 'utf8'))).toEqual({ services: { dashboard: {} } })
  const updated = {
    services: {
      dashboard: {
        ports: ['13001:3001'],
        environment: { DASHBOARD_AUTOSTART_PRESET: 'tenant-seeding' },
      },
    },
  }
  await writeFile(prepareInputFile, JSON.stringify(updated))
  await run('start')
  expect(JSON.parse(await readFile(path, 'utf8'))).toEqual(updated)
  expect((await readFile(backendCallsFile, 'utf8')).trim().split('\n')).toEqual([
    `prepare:${backend}`,
    `prepare:${backend}`,
  ])
})

it('passes the resolved sibling backend root to preparation when INTEROP_BE_ROOT is unset', async () => {
  const { frontend, backend, env, backendCallsFile } = await fixture()
  const siblingBackend = join(frontend, '../interop-be-monorepo')
  await rename(backend, siblingBackend)
  delete env.INTEROP_BE_ROOT
  await execute('bash', [join(frontend, '.devcontainer/initialize.sh')], { env })
  expect((await readFile(backendCallsFile, 'utf8')).trim()).toBe(`prepare:${siblingBackend}`)
  const config = JSON.parse(
    await readFile(join(frontend, '.local-development/frontend/compose.yml'), 'utf8')
  )
  expect(config.services.frontend.environment.INTEROP_BE_ROOT).toBe(siblingBackend)
  expect(
    (await lstat(join(frontend, '.local-development/interop-be-monorepo'))).isDirectory()
  ).toBe(true)
})

it('aborts startup if backend preparation fails and preserves the last valid override', async () => {
  const { backend, run, callsFile, backendCallsFile, prepareFailureFile } = await fixture()
  await run('start')
  const path = join(backend, '.local-development/dashboard/compose.yml')
  const previousOverride = await readFile(path, 'utf8')
  const previousCalls = await readFile(callsFile, 'utf8')
  await writeFile(prepareFailureFile, 'fail')
  await expect(run('start')).rejects.toThrow('Backend preparation failed')
  expect(await readFile(path, 'utf8')).toBe(previousOverride)
  expect(await readFile(callsFile, 'utf8')).toBe(previousCalls)
  expect((await readFile(backendCallsFile, 'utf8')).trim().split('\n')).toEqual([
    `prepare:${backend}`,
    `prepare:${backend}`,
  ])
})

it('regenerates a legacy backend override from current backend configuration', async () => {
  const { backend, run } = await fixture()
  const directory = join(backend, '.local-development/dashboard')
  await mkdir(directory, { recursive: true })
  const path = join(directory, 'compose.yml')
  const original = JSON.stringify({
    services: {
      dashboard: {
        environment: { INTEROP_FE_ROOT: '/legacy/frontend', DASHBOARD_AUTOSTART: 'false' },
      },
    },
  })
  await writeFile(path, original)
  await run('start')
  expect(JSON.parse(await readFile(path, 'utf8'))).toEqual({ services: { dashboard: {} } })
})
