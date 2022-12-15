import { act, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import useGetEServiceProviderActions from '../useGetEServiceProviderActions'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceReadType,
} from '@/__mocks__/data/eservice.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { CATALOG_PROCESS_URL } from '@/config/env'
import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'

const server = setupServer(
  rest.post(
    `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/clone`,
    (_, res, ctx) => {
      return res(ctx.json(createMockEServiceReadType()))
    }
  ),
  rest.post(`${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors`, (req, res, ctx) => {
    return res(ctx.json(createMockEServiceReadType()))
  })
)

beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})

function renderUseGetEServiceProviderActionsHook(
  ...hookParams: Parameters<typeof useGetEServiceProviderActions>
) {
  return renderHookWithApplicationContext(
    () => useGetEServiceProviderActions(...(hookParams ?? [])),
    { withReactQueryContext: true, withRouterContext: true }
  )
}

describe('useGetEServiceProviderActions tests', () => {
  it('should return no actions if no descriptor is given', () => {
    const { result } = renderUseGetEServiceProviderActionsHook()
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if a descriptor with state "PUBLISHED" is given', () => {
    const descriptorMock = createMockEServiceDescriptorProvider({ state: 'PUBLISHED' })
    const { result } = renderUseGetEServiceProviderActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('suspend')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('createNewDraft')
  })

  it('should return the correct actions if a descriptor with state "ARCHIVED" is given', () => {
    const descriptorMock = createMockEServiceDescriptorProvider({ state: 'ARCHIVED' })
    const { result } = renderUseGetEServiceProviderActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if a descriptor with state "DEPRECATED" is given', () => {
    const descriptorMock = createMockEServiceDescriptorProvider({ state: 'DEPRECATED' })
    const { result } = renderUseGetEServiceProviderActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('should return the correct actions if a descriptor with state "DRAFT" is given', () => {
    const descriptorMock = createMockEServiceDescriptorProvider({ state: 'DRAFT' })
    const { result } = renderUseGetEServiceProviderActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('publish')
    expect(result.current.actions[1].label).toBe('delete')
  })

  it('should return the correct actions if a descriptor with state "SUSPENDED" is given', () => {
    const descriptorMock = createMockEServiceDescriptorProvider({ state: 'SUSPENDED' })
    const { result } = renderUseGetEServiceProviderActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('createNewDraft')
  })

  it('should redirect to the provider e-service edit page on clone action success', async () => {
    const descriptorMock = createMockEServiceDescriptorProvider({ state: 'SUSPENDED' })
    const { result, history } = renderUseGetEServiceProviderActionsHook(descriptorMock)
    expect(result.current.actions[1].label).toBe('clone')
    act(() => {
      result.current.actions[1].action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await act(() => {
      waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))
    })

    expect(history.location.pathname).toBe(
      '/it/erogazione/e-service/6dbb7416-8315-4970-a6be-393a03d0a79d/fd09a069-81f8-4cb5-a302-64320e83a033/modifica'
    )
  })

  it('should redirect to the provider e-service edit page, on the step 2, on createNewDraft action success', async () => {
    const descriptorMock = createMockEServiceDescriptorProvider({ state: 'PUBLISHED' })
    const { result, history } = renderUseGetEServiceProviderActionsHook(descriptorMock)
    expect(result.current.actions[2].label).toBe('createNewDraft')
    act(() => {
      result.current.actions[2].action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await act(() => {
      waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))
    })

    expect(history.location.pathname).toBe(
      '/it/erogazione/e-service/4edda5fd-2fed-485c-9ab4-bc7d78a67624/6dbb7416-8315-4970-a6be-393a03d0a79d/modifica'
    )
    expect(history.location.state).toStrictEqual({ stepIndexDestination: 1 })
  })
})
