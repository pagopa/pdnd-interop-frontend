import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import useGetConsumerPurposesActions from '../useGetConsumerPurposesActions'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { act, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { routes } from '@/router/routes'
import { generatePath } from 'react-router-dom'
import { vi } from 'vitest'
import * as hooks from '@/hooks/useJwt'
import type { Purpose } from '@/api/api.generatedTypes'

const useJwtReturnDataMock = {
  currentRoles: ['admin'],
  isAdmin: true,
  hasSessionExpired: () => false,
} as unknown as ReturnType<typeof hooks.useJwt>
vi.spyOn(hooks, 'useJwt').mockImplementation(() => useJwtReturnDataMock)

const server = setupServer(
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/e8a8153e-9ab2-4aeb-a14c-96aebd4fa049/clone`,
    (_, res, ctx) => {
      return res(
        ctx.json({
          purposeId: 'test-purpose-id',
          versionId: 'test-purpose-version-id',
        })
      )
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

function renderUseGetConsumerPurposesActionsHook(purpose?: Purpose) {
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

  it('shoud only return clone action if an archived purpose is given', () => {
    const purposeMock = createMockPurpose({ currentVersion: { state: 'ARCHIVED' } })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)

    const cloneAction = result.current.actions.find((action) => action.label === 'clone')

    expect(result.current.actions).toHaveLength(1)
    expect(cloneAction).toBeTruthy()
  })

  it('should return the activate and delete functions if the current version is in draft', () => {
    const purposeMock = createMockPurpose({ currentVersion: { state: 'DRAFT' } })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions).toHaveLength(2)

    const activateAction = result.current.actions.find((action) => action.label === 'activate')
    const deleteAction = result.current.actions.find((action) => action.label === 'delete')

    expect(activateAction).toBeTruthy()
    expect(deleteAction).toBeTruthy()
  })

  it('should return only the delete action if the purpose has only the waiting for approval version', () => {
    const purposeMock = createMockPurpose({
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
    const purposeMock = createMockPurpose({
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
    const cloneAction = result.current.actions.find((action) => action.label === 'clone')

    expect(deleteDailyCallsUpdateAction).toBeTruthy()
    expect(cloneAction).toBeTruthy()
  })

  it('should return the updated daily calls update action if the purpose has more than one version and no waiting for approval version', () => {
    const purposeMock = createMockPurpose({ waitingForApprovalVersion: undefined })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const updateDailyCallsAction = result.current.actions.find(
      (action) => action.label === 'updateDailyCalls'
    )
    const cloneAction = result.current.actions.find((action) => action.label === 'clone')

    expect(updateDailyCallsAction).toBeTruthy()
    expect(cloneAction).toBeTruthy()
  })

  it('should return the suspend action if the purpose is active', () => {
    const purposeMock = createMockPurpose({
      currentVersion: { state: 'ACTIVE' },
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const suspendAction = result.current.actions.find((action) => action.label === 'suspend')
    const cloneAction = result.current.actions.find((action) => action.label === 'clone')

    expect(suspendAction).toBeTruthy()
    expect(cloneAction).toBeTruthy()
  })

  it('should return the suspend action if the purpose is suspended by the provider', () => {
    const purposeMock = createMockPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: false,
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const suspendAction = result.current.actions.find((action) => action.label === 'suspend')
    const cloneAction = result.current.actions.find((action) => action.label === 'clone')

    expect(suspendAction).toBeTruthy()
    expect(cloneAction).toBeTruthy()
  })

  it('should return the activate action if the purpose is suspended by the consumer', () => {
    const purposeMock = createMockPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: true,
    })
    const { result } = renderUseGetConsumerPurposesActionsHook(purposeMock)
    expect(result.current.actions.length).toBeGreaterThanOrEqual(1)

    const activateAction = result.current.actions.find((action) => action.label === 'activate')
    const cloneAction = result.current.actions.find((action) => action.label === 'clone')

    expect(activateAction).toBeTruthy()
    expect(cloneAction).toBeTruthy()
  })

  it('should navigate to the purpose edit page on clone action success', async () => {
    const purposeMock = createMockPurpose({
      id: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: true,
    })
    const { result, history } = renderUseGetConsumerPurposesActionsHook(purposeMock)

    const cloneAction = result.current.actions.find((action) => action.label === 'clone')
    expect(cloneAction).toBeTruthy()

    act(() => {
      cloneAction?.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe(
      '/it/' + generatePath(routes.SUBSCRIBE_PURPOSE_EDIT.PATH.it, { purposeId: 'test-purpose-id' })
    )
  })
})
