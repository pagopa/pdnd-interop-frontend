import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EServiceMutations } from '../eservice.mutations'

vi.mock('../eservice.services', () => ({
  EServiceServices: {
    requestArchiveDescriptor: vi.fn(),
    cancelDelegatedArchivingRequest: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (_namespace: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => `${options?.keyPrefix}.${key}`,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const WrapperComponent = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  WrapperComponent.displayName = 'TestWrapper'

  return { WrapperComponent, queryClient }
}

describe('EServiceMutations delegated archiving toasts', () => {
  it('useRequestArchiveDescriptor uses dedicated request-archiving toast labels', () => {
    const { WrapperComponent, queryClient } = createWrapper()
    const { result } = renderHook(() => EServiceMutations.useRequestArchiveDescriptor(), {
      wrapper: WrapperComponent,
    })

    result.current.mutate({
      eserviceId: 'eservice-id',
      descriptorId: 'descriptor-id',
      gracePeriodDays: 60,
    })

    const mutationMeta = queryClient.getMutationCache().getAll()[0]?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.requestArchiveDescriptor.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe('eservice.requestArchiveDescriptor.outcome.error')
  })

  it('useCancelDelegatedArchivingRequest uses dedicated cancel-request toast labels', () => {
    const { WrapperComponent, queryClient } = createWrapper()
    const { result } = renderHook(() => EServiceMutations.useCancelDelegatedArchivingRequest(), {
      wrapper: WrapperComponent,
    })

    result.current.mutate({ eserviceId: 'eservice-id' })

    const mutationMeta = queryClient.getMutationCache().getAll()[0]?.meta

    expect(mutationMeta?.successToastLabel).toBe(
      'eservice.cancelDelegatedArchivingRequest.outcome.success'
    )
    expect(mutationMeta?.errorToastLabel).toBe(
      'eservice.cancelDelegatedArchivingRequest.outcome.error'
    )
  })
})
