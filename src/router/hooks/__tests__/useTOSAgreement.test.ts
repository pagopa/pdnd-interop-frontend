import { renderHook } from '@testing-library/react'
import { useTOSAgreement } from '../useTOSAgreement'
import * as useJwt from '@/hooks/useJwt'
import { vi } from 'vitest'
import { act } from 'react-dom/test-utils'

type ReturnTypeUseJwt = ReturnType<typeof useJwt.useJwt>
const jwtUidTest = 'test-jwt-uid'

beforeAll(() => {
  vi.spyOn(useJwt, 'useJwt').mockImplementation(
    () => ({ jwt: { uid: jwtUidTest } } as ReturnTypeUseJwt)
  )
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2020, 3, 1))
})

afterAll(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe('Test if useTOSAgreement works correctly', () => {
  it('should update the state correctly on handleAcceptTOS function call', async () => {
    const { result } = renderHook(() => useTOSAgreement('test-key'))

    expect(result.current.isTOSAccepted).toBe(false)
    expect(result.current.tosAcceptedId).toBe(null)

    act(result.current.handleAcceptTOS)

    expect(result.current.isTOSAccepted).toBe(true)
    expect(result.current.tosAcceptedId).toEqual(
      JSON.stringify({ id: jwtUidTest, timestamp: new Date().toISOString() })
    )
  })
})
