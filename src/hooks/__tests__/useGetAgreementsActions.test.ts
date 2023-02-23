import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import useGetAgreementsActions from '../useGetAgreementsActions'
import {
  createMockAgreementListingItem,
  createMockAgreementSummary,
} from '__mocks__/data/agreement.mocks'
import { AgreementListingItem, AgreementSummary } from '@/types/agreement.types'
import { createMemoryHistory } from 'history'

function renderUseGetAgreementsActionsHook(
  agreement?: AgreementSummary | AgreementListingItem,
  historyType?: string
) {
  const memoryHistory = createMemoryHistory()

  if (historyType && historyType === 'provider') {
    memoryHistory.push(`/it/erogazione/richieste${agreement ? '/' + agreement.id : ''}`)
  }

  if (historyType && historyType === 'consumer') {
    memoryHistory.push(`/it/fruizione/richieste${agreement ? '/' + agreement.id : ''}`)
  }

  if (!historyType) {
    memoryHistory.push(`/it/ente`)
  }

  return renderHookWithApplicationContext(
    () => useGetAgreementsActions(agreement),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    },
    memoryHistory
  )
}

describe('check if useGetAgreementsActions returns the correct actions based on the passed agreement - no agreement', () => {
  it('shoud not return any action if no agreement nor mode is given', () => {
    const { result } = renderUseGetAgreementsActionsHook()
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any action if mode is given but agreement not - mode provider', () => {
    const { result } = renderUseGetAgreementsActionsHook(undefined, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any action if mode is given but agreement not - mode consumer', () => {
    const { result } = renderUseGetAgreementsActionsHook(undefined, 'consumer')
    expect(result.current.actions).toHaveLength(0)
  })
})

describe('check if useGetAgreementsActions returns the correct actions based on the passed agreement - agreementType: AgreementSummary', () => {
  it('shoud not return any action if mode is null and agreement defined', () => {
    const { result } = renderUseGetAgreementsActionsHook(createMockAgreementSummary())
    expect(result.current.actions).toHaveLength(0)
  })

  /* provider */

  it('shoud return provider suspend action if mode is provider and agreement has state ACTIVE', () => {
    const agreement = createMockAgreementSummary({
      state: 'ACTIVE',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return provider activate action if mode is provider and agreement has state SUSPENDED and is suspendedByProducer', () => {
    const agreement = createMockAgreementSummary({
      state: 'SUSPENDED',
      suspendedByProducer: true,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('activate')
  })

  it('shoud return provider suspend action if mode is provider and agreement has state SUSPENDED and is not suspendedByProducer', () => {
    const agreement = createMockAgreementSummary({
      state: 'SUSPENDED',
      suspendedByProducer: false,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return provider activate and reject actions if mode is provider and agreement has state PENDING', () => {
    const agreement = createMockAgreementSummary({
      state: 'PENDING',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('shoud not return any provider action if mode is provider and agreement has state ARCHIVED', () => {
    const agreement = createMockAgreementSummary({
      state: 'ARCHIVED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state DRAFT', () => {
    const agreement = createMockAgreementSummary({
      state: 'DRAFT',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state REJECTED', () => {
    const agreement = createMockAgreementSummary({
      state: 'REJECTED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const agreement = createMockAgreementSummary({
      state: 'MISSING_CERTIFIED_ATTRIBUTES',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  /* consumer */

  it('shoud return consumer suspend action if mode is consumer and agreement has state ACTIVE', () => {
    const agreement = createMockAgreementSummary({
      state: 'ACTIVE',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return consumer activate action if mode is consumer and agreement has state SUSPENDED and is suspendedByConsumer', () => {
    const agreement = createMockAgreementSummary({
      state: 'SUSPENDED',
      suspendedByConsumer: true,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('activate')
  })

  it('shoud return consumer suspend action if mode is consumer and agreement has state SUSPENDED and is not suspendedByConsumer', () => {
    const agreement = createMockAgreementSummary({
      state: 'SUSPENDED',
      suspendedByConsumer: false,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud not return any consumer action if mode is consumer and agreement has state PENDING', () => {
    const agreement = createMockAgreementSummary({
      state: 'PENDING',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any consumer action if mode is consumer and agreement has state ARCHIVED', () => {
    const agreement = createMockAgreementSummary({
      state: 'ARCHIVED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud return consumer delete action if mode is consumer and agreement has state DRAFT', () => {
    const agreement = createMockAgreementSummary({
      state: 'DRAFT',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })

  it('shoud return consumer clone action if mode is consumer and agreement has state REJECTED', () => {
    const agreement = createMockAgreementSummary({
      state: 'REJECTED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('clone')
  })

  it('shoud return consumer delete action if mode is consumer and agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const agreement = createMockAgreementSummary({
      state: 'MISSING_CERTIFIED_ATTRIBUTES',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })
})

describe('check if useGetAgreementsActions returns the correct actions based on the passed agreement - agreementType: AgreementListItem', () => {
  it('shoud not return any action if mode is null and agreement defined', () => {
    const { result } = renderUseGetAgreementsActionsHook(createMockAgreementListingItem())
    expect(result.current.actions).toHaveLength(0)
  })

  /* provider */

  it('shoud return provider suspend action if mode is provider and agreement has state ACTIVE', () => {
    const agreement = createMockAgreementListingItem({
      state: 'ACTIVE',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return provider activate action if mode is provider and agreement has state SUSPENDED and is suspendedByProducer', () => {
    const agreement = createMockAgreementListingItem({
      state: 'SUSPENDED',
      suspendedByProducer: true,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('activate')
  })

  it('shoud return provider suspend action if mode is provider and agreement has state SUSPENDED and is not suspendedByProducer', () => {
    const agreement = createMockAgreementListingItem({
      state: 'SUSPENDED',
      suspendedByProducer: false,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return provider activate and reject actions if mode is provider and agreement has state PENDING', () => {
    const agreement = createMockAgreementListingItem({
      state: 'PENDING',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('reject')
  })

  it('shoud not return any provider action if mode is provider and agreement has state ARCHIVED', () => {
    const agreement = createMockAgreementListingItem({
      state: 'ARCHIVED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state DRAFT', () => {
    const agreement = createMockAgreementListingItem({
      state: 'DRAFT',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state REJECTED', () => {
    const agreement = createMockAgreementListingItem({
      state: 'REJECTED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const agreement = createMockAgreementListingItem({
      state: 'MISSING_CERTIFIED_ATTRIBUTES',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  /* consumer */

  it('shoud return consumer suspend action if mode is consumer and agreement has state ACTIVE', () => {
    const agreement = createMockAgreementListingItem({
      state: 'ACTIVE',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return consumer activate action if mode is consumer and agreement has state SUSPENDED and is suspendedByConsumer', () => {
    const agreement = createMockAgreementListingItem({
      state: 'SUSPENDED',
      suspendedByConsumer: true,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('activate')
  })

  it('shoud return consumer suspend action if mode is consumer and agreement has state SUSPENDED and is not suspendedByConsumer', () => {
    const agreement = createMockAgreementListingItem({
      state: 'SUSPENDED',
      suspendedByConsumer: false,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud not return any consumer action if mode is consumer and agreement has state PENDING', () => {
    const agreement = createMockAgreementListingItem({
      state: 'PENDING',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any consumer action if mode is consumer and agreement has state ARCHIVED', () => {
    const agreement = createMockAgreementListingItem({
      state: 'ARCHIVED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud return consumer delete action if mode is consumer and agreement has state DRAFT', () => {
    const agreement = createMockAgreementListingItem({
      state: 'DRAFT',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })

  it('shoud return consumer clone action if mode is consumer and agreement has state REJECTED', () => {
    const agreement = createMockAgreementListingItem({
      state: 'REJECTED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('clone')
  })

  it('shoud return consumer delete action if mode is consumer and agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const agreement = createMockAgreementListingItem({
      state: 'MISSING_CERTIFIED_ATTRIBUTES',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })
})
