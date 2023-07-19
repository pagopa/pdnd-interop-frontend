import { vi } from 'vitest'
import * as useAuth from '@/stores/auth.store'
import { createMockJwtUser } from '__mocks__/data/user.mocks'
import { renderHook } from '@testing-library/react'
import { useJwt } from '../useJwt'

const useAuthSpy = vi.spyOn(useAuth, 'useAuth')

function createSessionTokenMock(...args: Parameters<typeof createMockJwtUser>) {
  return '.' + window.btoa(JSON.stringify(createMockJwtUser(...args)))
}

describe('useJwt testing', () => {
  it('should handle correctly when session token is null', () => {
    useAuthSpy.mockImplementation(() => ({
      sessionToken: null,
      setSessionToken: vi.fn(),
      clearSessionToken: vi.fn(),
      isLoadingSessionToken: false,
      setIsLoadingSessionToken: vi.fn(),
    }))

    const { result } = renderHook(() => useJwt())

    expect(result.current.jwt).toBeFalsy()
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isOperatorAPI).toBe(false)
    expect(result.current.isOperatorSecurity).toBe(false)
    expect(result.current.currentRoles).toEqual([])
  })

  it('should handle correctly when user is an admin', () => {
    const sessionTokenMock = createSessionTokenMock({
      organization: { roles: [{ role: 'admin' }] },
    })
    useAuthSpy.mockImplementation(() => ({
      sessionToken: sessionTokenMock,
      setSessionToken: vi.fn(),
      clearSessionToken: vi.fn(),
      isLoadingSessionToken: false,
      setIsLoadingSessionToken: vi.fn(),
    }))

    const { result } = renderHook(() => useJwt())

    expect(result.current.jwt).toBeTruthy()
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.isOperatorAPI).toBe(false)
    expect(result.current.isOperatorSecurity).toBe(false)
    expect(result.current.currentRoles).toEqual(['admin'])
  })

  it('should handle correctly when user is an api operator', () => {
    const sessionTokenMock = createSessionTokenMock({
      organization: { roles: [{ role: 'api' }] },
    })

    useAuthSpy.mockImplementation(() => ({
      sessionToken: sessionTokenMock,
      setSessionToken: vi.fn(),
      clearSessionToken: vi.fn(),
      isLoadingSessionToken: false,
      setIsLoadingSessionToken: vi.fn(),
    }))

    const { result } = renderHook(() => useJwt())

    expect(result.current.jwt).toBeTruthy()
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isOperatorAPI).toBe(true)
    expect(result.current.isOperatorSecurity).toBe(false)
    expect(result.current.currentRoles).toEqual(['api'])
  })

  it('should handle correctly when user is a security operator', () => {
    const sessionTokenMock = createSessionTokenMock({
      organization: { roles: [{ role: 'security' }] },
    })

    useAuthSpy.mockImplementation(() => ({
      sessionToken: sessionTokenMock,
      setSessionToken: vi.fn(),
      clearSessionToken: vi.fn(),
      isLoadingSessionToken: false,
      setIsLoadingSessionToken: vi.fn(),
    }))

    const { result } = renderHook(() => useJwt())

    expect(result.current.jwt).toBeTruthy()
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isOperatorAPI).toBe(false)
    expect(result.current.isOperatorSecurity).toBe(true)
    expect(result.current.currentRoles).toEqual(['security'])
  })

  it('should handle correctly when user is an api and a security operator', () => {
    const sessionTokenMock = createSessionTokenMock({
      organization: {
        roles: [{ role: 'api' }, { role: 'security' }],
      },
    })

    useAuthSpy.mockImplementation(() => ({
      sessionToken: sessionTokenMock,
      setSessionToken: vi.fn(),
      clearSessionToken: vi.fn(),
      isLoadingSessionToken: false,
      setIsLoadingSessionToken: vi.fn(),
    }))

    const { result } = renderHook(() => useJwt())

    expect(result.current.jwt).toBeTruthy()
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isOperatorAPI).toBe(true)
    expect(result.current.isOperatorSecurity).toBe(true)
    expect(result.current.currentRoles).toEqual(['api', 'security'])
  })

  it('should correctly handle expired session', () => {
    const sessionTokenMock = createSessionTokenMock({
      exp: new Date().getTime() / 1000 - 5000,
    })

    useAuthSpy.mockImplementation(() => ({
      sessionToken: sessionTokenMock,
      setSessionToken: vi.fn(),
      clearSessionToken: vi.fn(),
      isLoadingSessionToken: false,
      setIsLoadingSessionToken: vi.fn(),
    }))

    const { result } = renderHook(() => useJwt())
    expect(result.current.hasSessionExpired()).toBe(true)
  })

  it('should correctly handle not expired session', () => {
    const sessionTokenMock = createSessionTokenMock({
      exp: new Date().getTime() / 1000 + 5000,
    })

    useAuthSpy.mockImplementation(() => ({
      sessionToken: sessionTokenMock,
      setSessionToken: vi.fn(),
      clearSessionToken: vi.fn(),
      isLoadingSessionToken: false,
      setIsLoadingSessionToken: vi.fn(),
    }))

    const { result } = renderHook(() => useJwt())
    expect(result.current.hasSessionExpired()).toBe(false)
  })
})
