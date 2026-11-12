import { renderHookWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { useGetDelegationActions } from '../useGetDelegationActions'
import { createMockDelegation } from '../../../__mocks__/data/delegation.mocks'

const openDialogMock = vi.fn()

vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')

  return {
    ...actual,
    useDialog: () => ({
      openDialog: openDialogMock,
      closeDialog: vi.fn(),
    }),
  }
})

describe('useGetDelegationActions', () => {
  beforeEach(() => {
    openDialogMock.mockClear()
    mockUseJwt({ isAdmin: true })
  })

  it('returns the revoke action for an active producer delegation and passes delegateName to the dialog', () => {
    const delegation = createMockDelegation({
      id: 'delegation-id',
      kind: 'DELEGATED_PRODUCER',
      state: 'ACTIVE',
      delegator: {
        id: 'organizationId',
        name: 'My organization',
      },
      delegate: {
        id: 'delegate-id',
        name: 'Delegated company',
      },
      eservice: {
        id: 'eservice-id',
        name: 'Eservice name',
      },
    })

    const { result } = renderHookWithApplicationContext(() => useGetDelegationActions(delegation), {
      withReactQueryContext: true,
    })

    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('revoke')

    result.current.actions[0].action()

    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'revokeDelegation',
      delegationId: 'delegation-id',
      eserviceName: 'Eservice name',
      delegateName: 'Delegated company',
      delegationKind: 'DELEGATED_PRODUCER',
    })
  })

  it('uses a fallback delegate name when the delegation has no delegate name', () => {
    const delegation = createMockDelegation({
      id: 'delegation-id',
      kind: 'DELEGATED_PRODUCER',
      state: 'ACTIVE',
      delegator: {
        id: 'organizationId',
        name: 'My organization',
      },
      delegate: {
        id: 'delegate-id',
        name: undefined,
      },
      eservice: {
        id: 'eservice-id',
        name: 'Eservice name',
      },
    })

    const { result } = renderHookWithApplicationContext(() => useGetDelegationActions(delegation), {
      withReactQueryContext: true,
    })

    result.current.actions[0].action()

    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'revokeDelegation',
      delegationId: 'delegation-id',
      eserviceName: 'Eservice name',
      delegateName: '-',
      delegationKind: 'DELEGATED_PRODUCER',
    })
  })
})
