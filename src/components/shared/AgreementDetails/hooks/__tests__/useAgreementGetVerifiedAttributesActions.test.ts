import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderHookWithApplicationContext,
} from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from '../../components/__tests__/test.commons'
import { useAgreementGetVerifiedAttributesActions } from '../useAgreementGetVerifiedAttributesActions'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { createVerifiedTenantAttribute } from '__mocks__/data/attribute.mocks'
import { vi } from 'vitest'
import { AttributeMutations } from '@/api/attribute'

describe('useAgreementGetVerifiedAttributesActions', () => {
  it('should return an empty array if the agreement is undefined', () => {
    mockAgreementDetailsContext({
      agreement: undefined,
      isAgreementEServiceMine: false,
      partyAttributes: undefined,
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('test')).toEqual([])
  })

  it('should return an empty array the user is a consumer', () => {
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
    mockUseCurrentRoute({ mode: 'consumer' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([])
  })

  it('should return an empty array if the user is not an admin', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: false,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [],
      },
    })
    mockUseJwt({ isAdmin: false })
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([])
  })

  it('should return an empty array if the user is the owner of the agreement e-service', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: true,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [],
      },
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([])
  })

  it('should return an empty array if agreement state is different from ACTIVE, SUSPENDED or PENDING', () => {
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
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
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
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('')).toEqual([
      { label: 'verified.actions.verify', action: expect.any(Function) },
    ])
  })

  it("should return only the 'update verification' action and the 'revoke' action if the attribute is owned", () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      isAgreementEServiceMine: false,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [createVerifiedTenantAttribute({ id: 'test-owned', verifiedBy: [{}] })],
      },
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(result.current('test-owned')).toEqual([
      { label: 'verified.actions.update', action: expect.any(Function) },
      { label: 'verified.actions.revoke', action: expect.any(Function), color: expect.any(String) },
    ])
  })

  it('should correctly call the verify/update action', () => {
    const action = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockReturnValue({
      mutate: action,
    } as unknown as ReturnType<typeof AttributeMutations.useVerifyPartyAttribute>)

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumer: { id: 'consumer' } }),
      isAgreementEServiceMine: false,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [],
      },
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    const verifyAction = result.current('test')[0].action
    verifyAction('test', 'Test')
    expect(action).toHaveBeenCalledWith({
      partyId: 'consumer',
      id: 'test',
      renewal: 'AUTOMATIC_RENEWAL',
    })
  })

  it('should correctly call the revoke action', () => {
    const action = vi.fn()
    vi.spyOn(AttributeMutations, 'useRevokeVerifiedPartyAttribute').mockReturnValue({
      mutate: action,
    } as unknown as ReturnType<typeof AttributeMutations.useRevokeVerifiedPartyAttribute>)

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumer: { id: 'consumer' } }),
      isAgreementEServiceMine: false,
      partyAttributes: {
        declared: [],
        certified: [],
        verified: [createVerifiedTenantAttribute({ id: 'test-owned', verifiedBy: [{}] })],
      },
    })
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })
    const { result } = renderHookWithApplicationContext(
      () => useAgreementGetVerifiedAttributesActions(),
      { withReactQueryContext: true, withRouterContext: true }
    )
    const revokeAction = result.current('test-owned')[1].action
    revokeAction('test-owned', 'Test')
    expect(action).toHaveBeenCalledWith({
      partyId: 'consumer',
      attributeId: 'test-owned',
    })
  })
})
