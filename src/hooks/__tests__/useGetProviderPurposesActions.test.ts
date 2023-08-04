import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import useGetProviderPurposesActions from '../useGetProviderPurposesActions'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import type { Purpose } from '@/api/api.generatedTypes'

mockUseJwt({ isAdmin: true })

function renderUseGetProviderPurposesActionsHook(purpose?: Purpose) {
  return renderHookWithApplicationContext(() => useGetProviderPurposesActions(purpose), {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('check if useGetProviderPurposesActions returns the correct actions based on the passed purpose', () => {
  it('shoud not return any action if no purpose is given', () => {
    const { result } = renderUseGetProviderPurposesActionsHook()
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any action if an archived purpose is given', () => {
    const purposeMock = createMockPurpose({ currentVersion: { state: 'ARCHIVED' } })
    const { result } = renderUseGetProviderPurposesActionsHook(purposeMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the suspend function if the current version is active', () => {
    const purposeMock = createMockPurpose({ currentVersion: { state: 'ACTIVE' } })
    const { result } = renderUseGetProviderPurposesActionsHook(purposeMock)

    const suspendAction = result.current.actions.find((action) => action.label === 'suspend')
    expect(suspendAction).toBeTruthy()
  })

  it('shoud have action to update completion date and active the waiting for approval version if the purpose has one', () => {
    const purposeMock = createMockPurpose({
      waitingForApprovalVersion: {
        id: 'test-id',
        dailyCalls: 2,
        state: 'WAITING_FOR_APPROVAL',
      },
    })
    const { result } = renderUseGetProviderPurposesActionsHook(purposeMock)
    const activateVersionAction = result.current.actions.find(
      (action) => action.label === 'confirmUpdate'
    )
    const updateCompletionDateAction = result.current.actions.find(
      (action) => action.label === 'updateCompletionDate'
    )
    expect(activateVersionAction).toBeTruthy()
    expect(updateCompletionDateAction).toBeTruthy()
  })

  it('shoud have the suspend action if the purpose is suspended but not suspended by the provider ', () => {
    const purposeMock = createMockPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByProducer: false,
    })

    const { result } = renderUseGetProviderPurposesActionsHook(purposeMock)
    const suspendAction = result.current.actions.find((action) => action.label === 'suspend')
    expect(suspendAction).toBeTruthy()
  })

  it('shoud have the activate action if the purpose is suspended by the provider ', () => {
    const purposeMock = createMockPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByProducer: true,
    })

    const { result } = renderUseGetProviderPurposesActionsHook(purposeMock)
    const activateAction = result.current.actions.find((action) => action.label === 'activate')
    expect(activateAction).toBeTruthy()
  })
})
