import { beforeEach, describe, expect, it, vi } from 'vitest'

const localDevelopmentMocks = vi.hoisted(() => ({
  identitySelectionEnabled: true,
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
    jwt: { exp: Math.floor(Date.now() / 1000) + 3600 },
  })),
}))

vi.mock('@/utils/common.utils', () => ({
  hasSessionExpired: vi.fn(() => false),
}))

describe('local development authentication', () => {
  beforeEach(() => {
    localDevelopmentMocks.identitySelectionEnabled = true
    window.localStorage.clear()
    window.location.hash = ''
  })

  it('keeps the identity selected in the browser instead of restoring the startup token', async () => {
    window.localStorage.setItem('token', 'selected-identity-token')

    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).resolves.toBe('selected-identity-token')
  })

  it('restores the configured development token when local identity selection is disabled', async () => {
    localDevelopmentMocks.identitySelectionEnabled = false
    window.localStorage.setItem('token', 'selected-identity-token')

    const { AuthServices } = await import('../auth.services')

    await expect(AuthServices.getSessionToken()).resolves.toBe('startup-token')
  })
})
