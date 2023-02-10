import { DecoratedPurpose, PurposeListingItem } from '@/types/purpose.types'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import useGetConsumerPurposesActions from '../useGetConsumerPurposesActions'
import {
  createMockDecoratedPurpose,
  createMockPurposeListingItem,
} from '__mocks__/data/purpose.mocks'

function renderUseGetConsumerPurposesActionsHook(purpose?: DecoratedPurpose | PurposeListingItem) {
  return renderHookWithApplicationContext(() => useGetConsumerPurposesActions(purpose), {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('check if useGetConsumerPurposesActions returns the correct actions based on the passed purpose', () => {
  it('shoud not return any action if no purpose is given', () => {
    const { result } = renderUseGetConsumerPurposesActionsHook()
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any action if an archived purpose is given', () => {
    const purposeMock = createMockDecoratedPurpose({ currentVersion: { state: 'ARCHIVED' } })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the activate and delete functions if the current version is in draft', () => {
    const purposeMock = createMockPurposeListingItem({ currentVersion: { state: 'DRAFT' } })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions).toHaveLength(2)

    const activateAction = result.current.actions.find((action) => action.label === 'activate')
    const deleteAction = result.current.actions.find((action) => action.label === 'delete')

    expect(activateAction).toBeTruthy()
    expect(deleteAction).toBeTruthy()
  })

  it('should return only the delete action if the purpose has only the waiting for approval version', () => {
    const purposeMock = createMockPurposeListingItem({
      currentVersion: undefined,
      waitingForApprovalVersion: {
        id: 'test-id',
        state: 'WAITING_FOR_APPROVAL',
        dailyCalls: 1,
      },
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions).toHaveLength(1)

    const deleteAction = result.current.actions.find((action) => action.label === 'delete')
    expect(deleteAction).toBeTruthy()
  })

  it('should return the delete daily calls update action if the purpose has more than one version and a waiting for approval version', () => {
    const purposeMock = createMockPurposeListingItem({
      waitingForApprovalVersion: {
        id: 'test-id',
        state: 'WAITING_FOR_APPROVAL',
        dailyCalls: 1,
      },
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const deleteDailyCallsUpdateAction = result.current.actions.find(
      (action) => action.label === 'deleteDailyCallsUpdate'
    )
    expect(deleteDailyCallsUpdateAction).toBeTruthy()
  })

  it('should return the updated daily calls update action if the purpose has more than one version and no waiting for approval version', () => {
    const purposeMock = createMockPurposeListingItem({ waitingForApprovalVersion: undefined })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const updateDailyCallsAction = result.current.actions.find(
      (action) => action.label === 'updateDailyCalls'
    )
    expect(updateDailyCallsAction).toBeTruthy()
  })

  it('should return the suspend action if the purpose is active', () => {
    const purposeMock = createMockPurposeListingItem({
      currentVersion: { state: 'ACTIVE' },
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const suspendAction = result.current.actions.find((action) => action.label === 'suspend')
    expect(suspendAction).toBeTruthy()
  })

  it('should return the suspend action if the purpose is suspended by the provider', () => {
    const purposeMock = createMockPurposeListingItem({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: false,
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const suspendAction = result.current.actions.find((action) => action.label === 'suspend')
    expect(suspendAction).toBeTruthy()
  })

  it('should return the activate action if the purpose is suspended by the consumer', () => {
    const purposeMock = createMockPurposeListingItem({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: true,
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const activateAction = result.current.actions.find((action) => action.label === 'activate')
    expect(activateAction).toBeTruthy()
  })
})
