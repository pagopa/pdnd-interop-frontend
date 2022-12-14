import React from 'react'
import { renderHook } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Route, Router, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { createMockEServiceProvider } from '@/__mocks__/data/eservice.mocks'
import {
  DialogContextProvider,
  LoadingOverlayContextProvider,
  ToastNotificationContextProvider,
} from '@/contexts'
import useGetProviderEServiceTableActions from '../useGetProviderEServiceTableActions'

function renderUseGetProviderEServiceTableActionsHook(
  ...hookParams: Parameters<typeof useGetProviderEServiceTableActions>
) {
  const history = createMemoryHistory()

  return renderHook(() => useGetProviderEServiceTableActions(...(hookParams ?? [])), {
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
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('suspend')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('editDraft')
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
    expect(result.current.actions[1].label).toBe('delete')
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
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('editDraft')
  })
})
