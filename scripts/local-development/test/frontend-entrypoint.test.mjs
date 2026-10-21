// @vitest-environment node
import { afterEach, expect, it } from 'vitest'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execute = promisify(execFile)
const entrypoint = fileURLToPath(new URL('../../../.devcontainer/entrypoint.sh', import.meta.url))
const roots = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

async function fixture({
  uid = '1500',
  gid = '1600',
  owned = false,
  previousOwner = '0:0',
  missingVolume = '',
} = {}) {
  const root = await mkdtemp(join(tmpdir(), 'interop-frontend-bootstrap-'))
  roots.push(root)
  const bin = join(root, 'bin')
  await mkdir(bin)
  const volumes = [join(root, 'node_modules'), '/home/node/.local/share/pnpm', '/home/node/.cache']
  const stateFile = join(root, 'state.json')
  await writeFile(
    stateFile,
    JSON.stringify({
      uid: '1000',
      gid: '1000',
      owners: Object.fromEntries(
        volumes.map((volume) => [volume, owned ? `${uid}:${gid}` : previousOwner])
      ),
      safeDirectories: [],
      calls: [],
    })
  )
  // Execute both entrypoint phases, replacing OS mutations and the launcher with
  // isolated command fixtures. This never changes host users or container volumes.
  const command = `#!${process.execPath}
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { spawnSync } from 'node:child_process';
const name = basename(process.argv[1]);
const args = process.argv.slice(2);
const state = JSON.parse(readFileSync(process.env.BOOTSTRAP_STATE, 'utf8'));
state.calls.push({ name, args, user: state.user });
let output = '';
let code = 0;
if (name === 'id') output = args[0] === '-g' ? state.gid : state.uid;
else if (name === 'groupmod') state.gid = args[2];
else if (name === 'usermod') state.uid = args[2];
else if (name === 'mountpoint') code = args[1] === process.env.BOOTSTRAP_MISSING_VOLUME ? 1 : 0;
else if (name === 'stat') output = state.owners[args[2]];
else if (name === 'chown') state.owners[args[2]] = args[1];
else if (name === 'gosu') state.user = args[0];
else if (name === 'git') {
  if (args.includes('--get-all')) {
    output = state.safeDirectories.join('\\n');
    code = state.safeDirectories.length ? 0 : 1;
  } else if (args.includes('--add')) state.safeDirectories.push(args.at(-1));
  else code = 1;
}
else if (name === 'node') {
  state.launcher = { user: state.user, cwd: process.cwd(), args };
  output = 'Frontend launcher started';
}
writeFileSync(process.env.BOOTSTRAP_STATE, JSON.stringify(state));
if (output) console.log(output);
if (name === 'gosu') {
  const result = spawnSync('bash', [process.env.BOOTSTRAP_ENTRYPOINT, ...args.slice(2)], {
    env: process.env, stdio: 'inherit'
  });
  process.exitCode = result.status ?? 1;
} else process.exitCode = code;
`
  for (const name of [
    'id',
    'groupmod',
    'usermod',
    'mountpoint',
    'stat',
    'chown',
    'gosu',
    'git',
    'node',
  ]) {
    await writeFile(join(bin, name), command, { mode: 0o755 })
  }
  const run = () =>
    execute('bash', [entrypoint], {
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        INTEROP_FE_ROOT: root,
        LOCAL_UID: uid,
        LOCAL_GID: gid,
        BOOTSTRAP_STATE: stateFile,
        BOOTSTRAP_ENTRYPOINT: entrypoint,
        BOOTSTRAP_MISSING_VOLUME: missingVolume,
      },
      timeout: 10000,
    })
  return { root, volumes, run, state: async () => JSON.parse(await readFile(stateFile, 'utf8')) }
}

it('prepares root-owned dependency volumes for a non-default UID/GID before starting the user launcher', async () => {
  const { root, volumes, run, state } = await fixture()
  await run()
  const result = await state()
  expect(result.uid).toBe('1500')
  expect(result.gid).toBe('1600')
  expect(result.owners).toEqual(Object.fromEntries(volumes.map((volume) => [volume, '1500:1600'])))
  expect(result.calls.filter(({ name }) => name === 'chown').map(({ args }) => args)).toEqual(
    volumes.map((volume) => ['-R', '1500:1600', volume])
  )
  expect(result.calls.find(({ name }) => name === 'gosu')?.args).toEqual([
    'node',
    '/usr/local/bin/frontend-entrypoint',
    '--user',
  ])
  expect(result.launcher).toEqual({
    user: 'node',
    cwd: root,
    args: ['scripts/local-development/dashboard-client.mjs', 'serve'],
  })
  expect(await readFile(join(root, '.local-development/frontend/startup.log'), 'utf8')).toContain(
    'Frontend launcher started'
  )
})

it('preserves existing user and volume ownership on repeated startup', async () => {
  const { run, state } = await fixture({ uid: '1000', gid: '1000', owned: true })
  await run()
  const result = await state()
  expect(
    result.calls.filter(({ name }) => ['groupmod', 'usermod', 'chown'].includes(name))
  ).toEqual([])
  expect(result.launcher.user).toBe('node')
})

it('repairs volumes from a macOS UID without changing the container user', async () => {
  const { volumes, run, state } = await fixture({
    uid: '1000',
    gid: '1000',
    previousOwner: '501:20',
  })
  await run()
  const result = await state()
  expect(result.calls.some(({ name }) => name === 'groupmod' || name === 'usermod')).toBe(false)
  expect(result.owners).toEqual(Object.fromEntries(volumes.map((volume) => [volume, '1000:1000'])))
  expect(result.launcher.user).toBe('node')
})

it('trusts only the mounted Git checkouts as node and keeps the configuration idempotent', async () => {
  const { root, run, state } = await fixture({ uid: '1000', gid: '1000', owned: true })
  const backend = join(root, 'backend checkout')
  await mkdir(join(root, '.git'))
  await mkdir(join(backend, '.git'), { recursive: true })
  await mkdir(join(root, '.local-development'))
  await symlink(backend, join(root, '.local-development/interop-be-monorepo'))

  await run()
  await run()

  const result = await state()
  expect(result.safeDirectories).toEqual([root, backend])
  const additions = result.calls.filter(
    ({ name, args }) => name === 'git' && args.includes('--add')
  )
  expect(additions).toHaveLength(2)
  expect(additions.every(({ user }) => user === 'node')).toBe(true)
  expect(result.launcher.user).toBe('node')
})

it('refuses to start the launcher when a dependency volume is missing', async () => {
  const { run, state } = await fixture({ missingVolume: '/home/node/.cache' })
  await expect(run()).rejects.toThrow('Missing frontend dependency volume: /home/node/.cache')
  const result = await state()
  expect(result.calls.some(({ name }) => name === 'gosu' || name === 'node')).toBe(false)
  expect(result.launcher).toBeUndefined()
})
