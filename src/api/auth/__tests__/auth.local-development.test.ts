import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const localDevelopmentMocks = vi.hoisted(() => ({
  identitySelectionEnabled: true,
  organizationId: '5470e567-de4c-416a-abd5-738dab94a5fd',
  expired: false,
}))

vi.mock('@/config/env', () => ({
  APP_MODE: 'development',
  BACKEND_FOR_FRONTEND_URL: '/0.0/backend-for-frontend',
  TEMP_USER_BLACKLIST_URL: 'https://example.test/blacklist.json',
}))

vi.mock('@/config/constants', () => ({
  MOCK_TOKEN: 'startup-token',
  STORAGE_KEY_SESSION_TOKEN: 'token',
}))

vi.mock('@/config/local-development', () => ({
  get isLocalIdentitySelectionEnabled() {
    return localDevelopmentMocks.identitySelectionEnabled
  },
}))

vi.mock('../auth.utils', () => ({
  parseJwt: vi.fn(() => ({
    jwt: {
      exp: Math.floor(Date.now() / 1000) + 3600,
      organizationId: localDevelopmentMocks.organizationId,
      selfcareId: 'stable-provider-id',
      uid: 'viewer-id',
      organization: { roles: [{ role: 'viewer' }] },
    },
  })),
}))

vi.mock('@/utils/common.utils', () => ({
  hasSessionExpired: vi.fn(() => localDevelopmentMocks.expired),
}))

describe('local development authentication', () => {
  const tenant = {
    key: 'provider',
    id: '5470e567-de4c-416a-abd5-738dab94a5fd',
    selfcareId: 'stable-provider-id',
    name: 'Provider Demo',
    users: [
      {
        id: 'viewer-id',
        name: 'Utente',
        surname: 'Viewer',
        email: 'viewer@local.test',
        roles: ['viewer'],
      },
    ],
  }
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    localDevelopmentMocks.identitySelectionEnabled = true
    localDevelopmentMocks.organizationId = tenant.id
    localDevelopmentMocks.expired = false
    window.localStorage.clear()
    window.location.hash = ''
    fetchMock.mockReset()
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ready: true, tenants: [tenant] })))
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => vi.unstubAllGlobals())

  it('keeps the identity selected in the browser instead of restoring the startup token', async () => {
    window.localStorage.setItem('token', 'selected-identity-token')

    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).resolves.toBe('selected-identity-token')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('restores the same tenant and user after an infrastructure reset', async () => {
    localDevelopmentMocks.organizationId = 'old-tenant-id'
    window.localStorage.setItem('token', 'old-session-token')
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ready: true, tenants: [tenant] }))
    )
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ sessionToken: 'renewed-viewer-token' }))
    )

    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).resolves.toBe('renewed-viewer-token')
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/__local-dashboard/api/identity',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ tenantKey: 'provider', userId: 'viewer-id' }),
      })
    )
    expect(window.localStorage.getItem('token')).toBe('renewed-viewer-token')
  })

  it.each([
    { ready: false, tenants: [] },
    { ready: false, tenants: [tenant] },
  ])('preserves the session while the seed is incomplete', async (identities) => {
    window.localStorage.setItem('token', 'old-session-token')
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(identities)))
    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).rejects.toThrow()
    expect(window.localStorage.getItem('token')).toBe('old-session-token')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('preserves the session on a temporary network failure', async () => {
    window.localStorage.setItem('token', 'old-session-token')
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).rejects.toThrow('Failed to fetch')
    expect(window.localStorage.getItem('token')).toBe('old-session-token')
  })

  it.each([{ tenants: [] }, { tenants: [{ ...tenant, users: [] }] }])(
    'clears the session if its identity was removed from the completed seed',
    async ({ tenants }) => {
      window.localStorage.setItem('token', 'old-session-token')
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ ready: true, tenants })))
      const { AuthServices } = await import('../auth.services')

      await expect(AuthServices.getSessionToken()).resolves.toBeNull()
      expect(window.localStorage.getItem('token')).toBeNull()
      expect(fetchMock).toHaveBeenCalledTimes(1)
    }
  )

  it('renews an expired session for the same local identity', async () => {
    localDevelopmentMocks.expired = true
    window.localStorage.setItem('token', 'expired-token')
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ready: true, tenants: [tenant] }))
    )
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ sessionToken: 'renewed-token' })))
    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).resolves.toBe('renewed-token')
  })

  it('preserves the old session when generating its replacement fails', async () => {
    localDevelopmentMocks.organizationId = 'old-tenant-id'
    window.localStorage.setItem('token', 'old-session-token')
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ready: true, tenants: [tenant] }))
    )
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 503 }))
    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).rejects.toThrow()
    expect(window.localStorage.getItem('token')).toBe('old-session-token')
  })

  it('restores the configured development token when local identity selection is disabled', async () => {
    localDevelopmentMocks.identitySelectionEnabled = false
    window.localStorage.setItem('token', 'selected-identity-token')

    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).resolves.toBe('startup-token')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
