import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderHookWithApplicationContext,
} from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from '../../components/__tests__/test.commons'
import { useAgreementGetDeclaredAttributesActions } from '../useAgreementGetDeclaredAttributesActions'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { vi } from 'vitest'
import { AttributeMutations } from '@/api/attribute'

describe('useAgreementGetDeclaredAttributesActions', () => {
  it('should return an empty array if the agreement is undefined', () => {
    mockAgreementDetailsContext({
      agreement: undefined,
      isAgreementEServiceMine: false,
      partyAttributes: undefined,
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetDeclaredAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('test')).toEqual([])
  })

  it('should return an empty array the routeKey is different from SUBSCRIBE_AGREEMENT_EDIT', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: false,
      partyAttributes: undefined,
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ routeKey: 'DEFAULT' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetDeclaredAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([])
  })

  it('should return an empty array if the user is not an admin', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: false,
      partyAttributes: undefined,
    })
    mockUseJwt({ isAdmin: false })
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetDeclaredAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([])
  })

  it('should return an empty array if the user is the owner of the agreement e-service', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: true,
      partyAttributes: undefined,
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetDeclaredAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([])
  })

  it('should return an empty array if agreement state is different from ACTIVE, SUSPENDED or DRAFT', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ state: 'MISSING_CERTIFIED_ATTRIBUTES' }),
      isAgreementEServiceMine: false,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [],
      },
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetDeclaredAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([])
  })

  it("should return only the 'verify' action if the attribute is not owned", () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: false,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [],
      },
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetDeclaredAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(result.current('test')).toEqual([
      { label: 'declared.actions.declare', action: expect.any(Function) },
    ])
  })

  it('should correctly call the declare action', () => {
    const action = vi.fn()
    vi.spyOn(AttributeMutations, 'useDeclarePartyAttribute').mockReturnValue({
      mutate: action,
    } as unknown as ReturnType<typeof AttributeMutations.useDeclarePartyAttribute>)

    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: false,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [],
      },
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetDeclaredAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    const declareAction = result.current('test')[0].action
    declareAction('test')
    expect(action).toHaveBeenCalledWith({
      id: 'test',
    })
  })
})
