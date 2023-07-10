import { mockUseCurrentRoute, renderHookWithApplicationContext } from '@/utils/testing.utils'
import useGetAgreementsActions from '../useGetAgreementsActions'
import { createMockAgreementListingItem, createMockAgreement } from '__mocks__/data/agreement.mocks'
import { createMemoryHistory } from 'history'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { vi } from 'vitest'
import * as hooks from '@/hooks/useJwt'

const useJwtReturnDataMock = {
  currentRoles: ['admin'],
  isAdmin: true,
  hasSessionExpired: () => false,
} as unknown as ReturnType<typeof hooks.useJwt>
vi.spyOn(hooks, 'useJwt').mockImplementation(() => useJwtReturnDataMock)
import type { Agreement, AgreementListEntry } from '@/api/api.generatedTypes'

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
  agreement?: Agreement | AgreementListEntry,
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
    const { result } = renderUseGetAgreementsActionsHook(createMockAgreement())
    expect(result.current.actions).toHaveLength(0)
  })

  /* provider */

  it('shoud return provider suspend action if mode is provider and agreement has state ACTIVE', () => {
    const agreement = createMockAgreement({
      state: 'ACTIVE',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return provider activate action if mode is provider and agreement has state SUSPENDED and is suspendedByProducer', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: true,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('activate')
  })

  it('shoud return provider suspend action if mode is provider and agreement has state SUSPENDED and is not suspendedByProducer', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: false,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return provider activate and reject actions if mode is provider and agreement has state PENDING', () => {
    const agreement = createMockAgreement({
      state: 'PENDING',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('reject')
    expect(result.current.actions[1].label).toBe('activate')
  })

  it('shoud not return any provider action if mode is provider and agreement has state ARCHIVED', () => {
    const agreement = createMockAgreement({
      state: 'ARCHIVED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state DRAFT', () => {
    const agreement = createMockAgreement({
      state: 'DRAFT',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state REJECTED', () => {
    const agreement = createMockAgreement({
      state: 'REJECTED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any provider action if mode is provider and agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const agreement = createMockAgreement({
      state: 'MISSING_CERTIFIED_ATTRIBUTES',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'provider')
    expect(result.current.actions).toHaveLength(0)
  })

  /* consumer */

  it('shoud return consumer suspend action if mode is consumer and agreement has state ACTIVE', () => {
    const agreement = createMockAgreement({
      state: 'ACTIVE',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud return consumer activate action if mode is consumer and agreement has state SUSPENDED and is suspendedByConsumer', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByConsumer: true,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('activate')
  })

  it('shoud return consumer suspend action if mode is consumer and agreement has state SUSPENDED and is not suspendedByConsumer', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByConsumer: false,
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('shoud not return any consumer action if mode is consumer and agreement has state PENDING', () => {
    const agreement = createMockAgreement({
      state: 'PENDING',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud not return any consumer action if mode is consumer and agreement has state ARCHIVED', () => {
    const agreement = createMockAgreement({
      state: 'ARCHIVED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud return consumer delete action if mode is consumer and agreement has state DRAFT', () => {
    const agreement = createMockAgreement({
      state: 'DRAFT',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })

  it('shoud return consumer clone action if mode is consumer and agreement has state REJECTED', () => {
    const agreement = createMockAgreement({
      state: 'REJECTED',
    })
    const { result } = renderUseGetAgreementsActionsHook(agreement, 'consumer')
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('clone')
  })

  it('shoud return consumer delete action if mode is consumer and agreement has state MISSING_CERTIFIED_ATTRIBUTES', () => {
    const agreement = createMockAgreement({
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
    expect(result.current.actions[0].label).toBe('reject')
    expect(result.current.actions[1].label).toBe('activate')
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
    const agreement = createMockAgreement({
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
      '/it/fruizione/richieste/3fa85f64-5717-4562-b3fc-2c963f66afa6/modifica'
    )
  })

  it('should navigate to SUBSCRIBE_AGREEMENT_LIST route after the delete action with mode consumer and agreement state DRAFT', async () => {
    const agreement = createMockAgreement({
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

    expect(history.location.pathname).toBe('/it/fruizione/richieste')
  })

  it('should navigate to SUBSCRIBE_AGREEMENT_LIST route after the delete action with mode consumer and agreement state MISSING_CERTIFIED_ATTRIBUTES', async () => {
    const agreement = createMockAgreement({
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

    expect(history.location.pathname).toBe('/it/fruizione/richieste')
  })

  it('should not navigate to SUBSCRIBE_AGREEMENT_LIST route after the delete action if actual routeKey is SUBSCRIBE_AGREEMENT_LIST', async () => {
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_LIST' })
    const agreement = createMockAgreement({
      state: 'DRAFT',
    })
    const { result, history } = renderUseGetAgreementsActionsHook(agreement)
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

    expect(history.location.pathname).toBe('/it/ente')
  })
})
