import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import useGetPurposeStateAlertProps from '../useGetPurposeStateAlertProps'

mockUseJwt()

function renderUseGetPurposeStateAlertPropsHook(
  ...hookArgs: Parameters<typeof useGetPurposeStateAlertProps>
) {
  return renderHookWithApplicationContext(() => useGetPurposeStateAlertProps(...hookArgs), {})
}

describe('useGetPurposeStateAlertProps', () => {
  it('returns the "no clients" alert with the link to the clients tab for a non-viewer user', () => {
    const purpose = createMockPurpose({ currentVersion: { state: 'ACTIVE' }, clients: [] })

    const { result } = renderUseGetPurposeStateAlertPropsHook(purpose, true)

    expect(result.current?.link).toEqual({
      to: 'SUBSCRIBE_PURPOSE_DETAILS',
      params: { purposeId: purpose.id },
      options: { urlParams: { tab: 'clients' } },
    })
  })

  it('does not return the "no clients" alert for a viewer (Consultatore) user', () => {
    mockUseJwt({ isViewer: true })
    const purpose = createMockPurpose({ currentVersion: { state: 'ACTIVE' }, clients: [] })

    const { result } = renderUseGetPurposeStateAlertPropsHook(purpose, true)

    expect(result.current).toBeUndefined()
  })

  it('still returns role-agnostic alerts (e.g. suspended) for a viewer user', () => {
    mockUseJwt({ isViewer: true })
    const purpose = createMockPurpose({ currentVersion: { state: 'SUSPENDED' } })

    const { result } = renderUseGetPurposeStateAlertPropsHook(purpose, true)

    expect(result.current?.severity).toBe('error')
    expect(result.current?.link).toBeUndefined()
  })
})
