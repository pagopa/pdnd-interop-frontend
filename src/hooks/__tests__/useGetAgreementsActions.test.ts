import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import useGetAgreementsActions from '../useGetAgreementsActions'
import {
  createMockAgreementListingItem,
  createMockAgreementSummary,
} from '__mocks__/data/agreement.mocks'
import { AgreementListingItem, AgreementSummary } from '@/types/agreement.types'
import { createMemoryHistory } from 'history'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { routes } from '@/router/routes'
import { generatePath } from 'react-router-dom'

const mockResAgreementId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

const server = setupServer(
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/e8a8153e-9ab2-4aeb-a14c-96aebd4fa049/clone`,
    (_, res, ctx) => {
      return res(
        ctx.json({
          id: mockResAgreementId,
        })
      )
    }
  ),
  rest.delete(
    `${BACKEND_FOR_FRONTEND_URL}/agreements/e8a8153e-9ab2-4aeb-a14c-96aebd4fa049`,
    (_, res) => {
      return res()
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

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

describe('check if the onSuccess callbacks are called correclty after the clone and delete actions', () => {
  it('should navigate to SUBSCRIBE_AGREEMENT_EDIT route with the returned agreementId after the clone action', async () => {
    const agreement = createMockAgreementSummary({
      state: 'REJECTED',
    })
    const { result, history } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)

    const cloneAction = result.current.actions[0]
    expect(cloneAction.label).toBe('clone')

    act(() => {
      cloneAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe(
      generatePath('/it/' + routes.SUBSCRIBE_AGREEMENT_EDIT.PATH.it, {
        agreementId: mockResAgreementId,
      })
    )
  })

  it('should navigate to SUBSCRIBE_AGREEMENT_LIST route after the delete action with mode consumer and agreement state DRAFT', async () => {
    const agreement = createMockAgreementSummary({
      state: 'DRAFT',
    })
    const { result, history } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)

    const deleteAction = result.current.actions[0]
    expect(deleteAction.label).toBe('delete')

    act(() => {
      deleteAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe('/it/' + routes.SUBSCRIBE_AGREEMENT_LIST.PATH.it)
  })

  it('should navigate to SUBSCRIBE_AGREEMENT_LIST route after the delete action with mode consumer and agreement state MISSING_CERTIFIED_ATTRIBUTES', async () => {
    const agreement = createMockAgreementSummary({
      state: 'MISSING_CERTIFIED_ATTRIBUTES',
    })
    const { result, history } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)

    const deleteAction = result.current.actions[0]
    expect(deleteAction.label).toBe('delete')

    act(() => {
      deleteAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe('/it/' + routes.SUBSCRIBE_AGREEMENT_LIST.PATH.it)
  })
})
