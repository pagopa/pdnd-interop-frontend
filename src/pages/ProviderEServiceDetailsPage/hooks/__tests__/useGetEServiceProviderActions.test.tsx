import React from 'react'
import { fireEvent, renderHook, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import useGetEServiceProviderActions from '../useGetEServiceProviderActions'
import { Route, Router, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { createMockEServiceDescriptorProvider } from '@/__mocks__/data/eservice.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { CATALOG_PROCESS_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import {
  DialogContextProvider,
  LoadingOverlayContextProvider,
  ToastNotificationContextProvider,
} from '@/contexts'

const server = setupServer(
  rest.post(
    `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/clone`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          title: 'Lord of the Rings',
          author: 'J. R. R. Tolkien',
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

function renderUseGetEServiceProviderActionsHook(
  ...hookParams: Parameters<typeof useGetEServiceProviderActions>
) {
  const history = createMemoryHistory()

  return renderHook(() => useGetEServiceProviderActions(...(hookParams ?? [])), {
    wrapper: ({ children }) => (
      <DialogContextProvider>
        <QueryClientProvider client={queryClient}>
          <LoadingOverlayContextProvider>
            <ToastNotificationContextProvider>
              <Router location={history.location} navigator={history}>
                <Routes>
                  <Route path="/" element={children} />
                </Routes>
              </Router>
            </ToastNotificationContextProvider>
          </LoadingOverlayContextProvider>
        </QueryClientProvider>
      </DialogContextProvider>
    ),
  })
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

  {
    /** TODO - waiting for pin-2437 to be merged  */
  }
  // it('should redirect to the provider e-service edit page on clone action success', async () => {
  //   const descriptorMock = createMockEServiceDescriptorProvider({ state: 'SUSPENDED' })
  //   const { result } = renderUseGetEServiceProviderActionsHook(descriptorMock)
  //   expect(result.current.actions[1].label).toBe('clone')
  //   act(() => {
  //     result.current.actions[1].action()
  //   })

  //   screen.debug()
  // })
})
