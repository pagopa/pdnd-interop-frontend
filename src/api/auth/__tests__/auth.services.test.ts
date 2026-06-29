import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import axiosInstance from '@/config/axios'
import { TokenExchangeError } from '@/utils/errors.utils'

// Mock axiosInstance
vi.mock('@/config/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

// Mock parseJwt to avoid real JWT decoding
vi.mock('../auth.utils', () => ({
  parseJwt: vi.fn(() => ({
    jwt: { exp: Math.floor(Date.now() / 1000) + 3600 }, // expires in 1 hour
    currentRoles: [],
    isAdmin: false,
    isOperatorAPI: false,
    isOperatorSecurity: false,
    isSupport: false,
    isReviewer: false,
    isViewer: false,
    isOrganizationAllowedToProduce: false,
    isOrganizationAllowedToDelegations: false,
    userEmail: undefined,
  })),
}))

// Mock hasSessionExpired to always return false (session is valid)
vi.mock('@/utils/common.utils', () => ({
  hasSessionExpired: vi.fn(() => false),
}))

describe('AuthServices.getSessionToken', () => {
  let originalHash: string

  beforeEach(() => {
    vi.clearAllMocks()
    originalHash = window.location.hash
    window.localStorage.clear()
  })

  afterEach(() => {
    window.location.hash = originalHash
  })

  async function importGetSessionToken() {
    // Dynamic import to pick up the current window.location.hash
    const { AuthServices } = await import('../auth.services')
    return AuthServices.getSessionToken
  }

  describe('fragment parsing with id and lang parameters', () => {
    it('should extract only the id token when hash contains #id=<token>&lang=en|it', async () => {
      const selfcareToken = 'another-selfcare-token'
      const mockSessionToken = 'mock-session-token'

      window.location.hash = `#id=${selfcareToken}&lang=en`

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { session_token: mockSessionToken },
      })

      const getSessionToken = await importGetSessionToken()
      await getSessionToken()

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/session/tokens`,
        { identity_token: selfcareToken }
      )
    })

    it('should return the resolved session token when id and lang are present', async () => {
      const mockSessionToken = 'resolved-session-token'

      window.location.hash = '#id=some-token&lang=it'

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { session_token: mockSessionToken },
      })

      const getSessionToken = await importGetSessionToken()
      const result = await getSessionToken()

      expect(result).toBe(mockSessionToken)
      expect(window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)).toBe(mockSessionToken)
    })
  })

  describe('fragment parsing without lang parameter', () => {
    it('should only extract the id token when hash contains only #id=<token>', async () => {
      const expectedToken = 'token-without-lang'
      const mockSessionToken = 'mock-session-token'

      window.location.hash = `#id=${expectedToken}`

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { session_token: mockSessionToken },
      })

      const getSessionToken = await importGetSessionToken()
      await getSessionToken()

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/session/tokens`,
        { identity_token: expectedToken }
      )
    })
  })

  describe('there is not session token in fragment', () => {
    it('should fall back to localStorage token when hash has no id', async () => {
      const storedToken = 'stored-session-token'
      window.localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, storedToken)
      window.location.hash = ''

      const getSessionToken = await importGetSessionToken()
      const result = await getSessionToken()

      expect(axiosInstance.post).not.toHaveBeenCalled()
      expect(result).toBe(storedToken)
    })

    it('should return null when there is no token at all', async () => {
      window.location.hash = ''
      window.localStorage.clear()

      const getSessionToken = await importGetSessionToken()
      const result = await getSessionToken()

      expect(axiosInstance.post).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should fall back to localStorage when hash has only lang parameter', async () => {
      const storedToken = 'stored-session-token'
      window.localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, storedToken)
      window.location.hash = '#lang=it'

      const getSessionToken = await importGetSessionToken()
      const result = await getSessionToken()

      expect(axiosInstance.post).not.toHaveBeenCalled()
      expect(result).toBe(storedToken)
    })
  })

  describe('token exchange error handling', () => {
    it('should throw TokenExchangeError when swapTokens fails', async () => {
      window.location.hash = '#id=failing-token&lang=it'

      vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error('Network error'))

      const getSessionToken = await importGetSessionToken()

      await expect(getSessionToken()).rejects.toThrow(TokenExchangeError)
    })
  })
})
