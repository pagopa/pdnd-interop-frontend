import type { PrivacyNotice } from '@/api/api.generatedTypes'
import { OneTrustNoticesMutations } from '@/api/one-trust-notices'
import { renderHook } from '@testing-library/react'
import type { Mock } from 'vitest'
import { vi } from 'vitest'
import { useTOSAgreement } from '../useTOSAgreement'
import { createMockPrivacyNotice } from '../../../../__mocks__/data/one-trust-notice.mocks'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
}))

import { useQuery } from '@tanstack/react-query'

const mockUseGetUserConsent = (data: { PP: PrivacyNotice; TOS: PrivacyNotice }) => {
  ;(useQuery as Mock).mockImplementation(({ queryKey }) => {
    if (queryKey[1] === 'PP') {
      return { data: data.PP }
    }
    if (queryKey[1] === 'TOS') {
      return { data: data.TOS }
    }
  })
}

const mutateFn = vi.fn()
vi.spyOn(OneTrustNoticesMutations, 'useAcceptPrivacyNotice').mockReturnValue({
  mutateAsync: mutateFn,
} as unknown as ReturnType<typeof OneTrustNoticesMutations.useAcceptPrivacyNotice>)

describe('useTOSAgreement', () => {
  it("should return isTOSAccepted as false if user hasn't accepted TOS", () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: false, firstAccept: false }),
    })

    const { result } = renderHookWithApplicationContext(() => useTOSAgreement(), {
      withReactQueryContext: true,
    })

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it("should return isTOSAccepted as false if user hasn't accepted PP", () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: false, firstAccept: false }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it('should return isTOSAccepted as false if user has accepted PP but it is not updated to the latest version', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: false, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it('should return isTOSAccepted as false if user has accepted TOS but it is not updated to the latest version', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: false, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it('should return isTOSAccepted as true if user has accepted both updated PP and TOS', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    expect(result.current.isTOSAccepted).toBe(true)
  })

  it('should return isTOSAccepted as true if user is support', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: false, firstAccept: false }),
      TOS: createMockPrivacyNotice({ isUpdated: false, firstAccept: false }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    expect(result.current.isTOSAccepted).toBe(true)
  })

  it('should not call the accept notice service if the TOS is already accepted', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    result.current.handleAcceptTOS()

    expect(mutateFn).not.toHaveBeenCalled()
  })

  it('should not call the accept notice service if latestVersionId is not defined', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({
        isUpdated: false,
        firstAccept: true,
        latestVersionId: undefined,
      }),
      TOS: createMockPrivacyNotice({
        isUpdated: false,
        firstAccept: true,
        latestVersionId: undefined,
      }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    result.current.handleAcceptTOS()

    expect(mutateFn).not.toHaveBeenCalled()
  })

  it('should correctly call the accept notice service', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({
        isUpdated: false,
        firstAccept: true,
      }),
      TOS: createMockPrivacyNotice({
        isUpdated: false,
        firstAccept: true,
      }),
    })

    const { result } = renderHook(() => useTOSAgreement())

    result.current.handleAcceptTOS()

    expect(mutateFn).toBeCalledTimes(2)
  })
})
