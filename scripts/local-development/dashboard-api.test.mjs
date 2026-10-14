// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createDashboardApi } from './dashboard-api.mjs'

describe('local identity readiness', () => {
  let root
  let api
  const generateIdentityToken = vi.fn(async () => 'new-token')

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'interop-local-identities-'))
    await mkdir(join(root, '.local-development'))
    await mkdir(join(root, 'docker/local-development'), { recursive: true })
    await writeFile(
      join(root, 'docker/local-development/dataset.json'),
      JSON.stringify({
        tenants: [{ key: 'provider', selfcareId: 'stable-provider', name: 'Provider Demo' }],
        users: [
          {
            id: 'viewer-id',
            memberships: [{ tenantSelfcareId: 'stable-provider', roles: ['viewer'] }],
          },
        ],
      })
    )
    await writeFile(
      join(root, '.local-development/state.json'),
      JSON.stringify({ tenants: { provider: { id: 'new-tenant-id' } } })
    )
    generateIdentityToken.mockClear()
    api = createDashboardApi({ frontendRoot: root, backendRoot: root, generateIdentityToken })
  })

  afterEach(async () => rm(root, { recursive: true, force: true }))

  it('waits for successful seed completion before exposing identities', async () => {
    expect(await api.getIdentities()).toEqual({ ready: false, tenants: [] })
    await expect(
      api.createIdentityToken({ tenantKey: 'provider', userId: 'viewer-id' })
    ).rejects.toThrow()
    expect(generateIdentityToken).not.toHaveBeenCalled()
  })

  it('exposes stable tenant identifiers after seed completion', async () => {
    await writeFile(join(root, '.local-development/identity.status'), 'ready\n')
    expect(await api.getIdentities()).toMatchObject({
      ready: true,
      tenants: [{ key: 'provider', id: 'new-tenant-id', selfcareId: 'stable-provider' }],
    })
    expect(await api.createIdentityToken({ tenantKey: 'provider', userId: 'viewer-id' })).toEqual({
      sessionToken: 'new-token',
    })
  })

  it('does not report removed identities while state is missing or partially written', async () => {
    await writeFile(join(root, '.local-development/identity.status'), 'ready\n')
    await writeFile(join(root, '.local-development/state.json'), '{')
    await expect(api.getIdentities()).rejects.toThrow()
    await writeFile(join(root, '.local-development/state.json'), JSON.stringify({ tenants: {} }))
    expect(await api.getIdentities()).toEqual({ ready: false, tenants: [] })
    await rm(join(root, '.local-development/state.json'))
    await expect(api.getIdentities()).rejects.toThrow()
  })
})
