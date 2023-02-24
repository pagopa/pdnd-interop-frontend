import {
  createMockEServiceProvider,
  createMockEServiceReadType,
} from '__mocks__/data/eservice.mocks'
import { useGetProviderEServiceActions } from '../useGetProviderEServiceActions'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import type { EServiceProvider } from '@/types/eservice.types'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL, CATALOG_PROCESS_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'

const server = setupServer(
  rest.post(
    `${CATALOG_PROCESS_URL}/eservices/ad474d35-7939-4bee-bde9-4e469cca1030/descriptors/test-1/clone`,
    (_, res, ctx) => {
      return res(ctx.json(createMockEServiceReadType()))
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/ad474d35-7939-4bee-bde9-4e469cca1030/descriptors`,
    (_, res, ctx) => {
      return res(ctx.json({ id: 'test-id' }))
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

function renderUseGetProviderEServiceTableActionsHook(descriptorMock: EServiceProvider) {
  return renderHookWithApplicationContext(
    () =>
      useGetProviderEServiceActions(
        descriptorMock.id,
        descriptorMock.activeDescriptor?.state,
        descriptorMock.activeDescriptor?.id,
        descriptorMock.draftDescriptor?.id
      ),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('useGetProviderEServiceTableActions tests', () => {
  it('should return the correct actions if the e-service has no descriptors', () => {
    const descriptorMock = createMockEServiceProvider()
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })

  it('should return the correct actions if the e-service has an active descriptor in PUBLISHED state and has no version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('suspend')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('createNewDraft')
  })

  it('should return the correct actions if the e-service has an active descriptor in PUBLISHED state and has a version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(4)
    expect(result.current.actions[0].label).toBe('suspend')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('editDraft')
    expect(result.current.actions[3].label).toBe('deleteDraft')
  })

  it('should return no actions if the e-service has an active descriptor in ARCHIVED state', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if the e-service has an active descriptor in DEPRECATED state', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('should return the correct actions if the e-service has no active descriptor', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('publish')
    expect(result.current.actions[1].label).toBe('deleteDraft')
  })

  it('should return the correct actions if the e-service has an active descriptor in SUSPENDED state and has no version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('createNewDraft')
  })

  it('should return the correct actions if the e-service has an active descriptor in SUSPENDED state and has a version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(4)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('editDraft')
    expect(result.current.actions[3].label).toBe('deleteDraft')
  })

  it('should navigate to PROVIDE_ESERVICE_EDIT page on clone action success', async () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result, history } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)

    const cloneAction = result.current.actions[1]

    expect(cloneAction.label).toBe('clone')

    act(() => {
      cloneAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe(
      '/it/erogazione/e-service/6dbb7416-8315-4970-a6be-393a03d0a79d/fd09a069-81f8-4cb5-a302-64320e83a033/modifica'
    )
  })

  it('should navigate to PROVIDE_ESERVICE_EDIT page on create new draft action success', async () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result, history } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)

    const cloneAction = result.current.actions[2]

    expect(cloneAction.label).toBe('createNewDraft')

    act(() => {
      cloneAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe(
      '/it/erogazione/e-service/ad474d35-7939-4bee-bde9-4e469cca1030/test-id/modifica'
    )
  })
})
