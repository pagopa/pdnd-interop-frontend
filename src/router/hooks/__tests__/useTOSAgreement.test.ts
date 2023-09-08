import type { PrivacyNotice } from '@/api/api.generatedTypes'
import { OneTrustNoticesMutations, OneTrustNoticesQueries } from '@/api/one-trust-notices'
import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useTOSAgreement } from '../useTOSAgreement'
import { createMockPrivacyNotice } from '../../../../__mocks__/data/one-trust-notice.mocks'
import { createMockJwtUser } from '@/../__mocks__/data/user.mocks'

const mockUseGetUserConsent = (data: { PP: PrivacyNotice; TOS: PrivacyNotice }) => {
  vi.spyOn(OneTrustNoticesQueries, 'useGetUserConsent').mockImplementation((type) => {
    switch (type) {
      case 'PP':
        return { data: data.PP } as unknown as ReturnType<
          typeof OneTrustNoticesQueries.useGetUserConsent
        >
      case 'TOS':
        return { data: data.TOS } as unknown as ReturnType<
          typeof OneTrustNoticesQueries.useGetUserConsent
        >
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

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it("should return isTOSAccepted as false if user hasn't accepted PP", () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: false, firstAccept: false }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it('should return isTOSAccepted as false if user has accepted PP but it is not updated to the latest version', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: false, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it('should return isTOSAccepted as false if user has accepted TOS but it is not updated to the latest version', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: false, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

    expect(result.current.isTOSAccepted).toBe(false)
  })

  it('should return isTOSAccepted as true if user has accepted both updated PP and TOS', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

    expect(result.current.isTOSAccepted).toBe(true)
  })

  it('should return isTOSAccepted as true if user is support', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: false, firstAccept: false }),
      TOS: createMockPrivacyNotice({ isUpdated: false, firstAccept: false }),
    })

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), true))

    expect(result.current.isTOSAccepted).toBe(true)
  })

  it('should not call the accept notice service if the TOS is already accepted', () => {
    mockUseGetUserConsent({
      PP: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
      TOS: createMockPrivacyNotice({ isUpdated: true, firstAccept: true }),
    })

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

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

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

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

    const { result } = renderHook(() => useTOSAgreement(createMockJwtUser(), false))

    result.current.handleAcceptTOS()

    expect(mutateFn).toBeCalledTimes(2)
  })
})
