import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AgreementMutations } from '../agreement.mutations'

vi.mock('../agreement.services', () => ({
  AgreementServices: {
    submitDraft: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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

describe('AgreementMutations', () => {
  describe('useSubmitDraft', () => {
    it('should show the delegation confirmation before the async exchange confirmation', () => {
      const { WrapperComponent, queryClient } = createWrapper()
      const { result } = renderHook(() => AgreementMutations.useSubmitDraft(true, true), {
        wrapper: WrapperComponent,
      })

      result.current.mutate({ agreementId: 'agreement-id', delegatorName: undefined })

      expect(queryClient.getMutationCache().getAll()[0]?.meta?.confirmationDialog).toEqual([
        expect.objectContaining({
          title: 'confirmDialog.title',
          description: expect.any(Function),
        }),
        expect.objectContaining({
          title: 'confirmDialog.asyncExchange.title',
          description: 'confirmDialog.asyncExchange.description',
          checkbox: 'confirmDialog.asyncExchange.checkbox',
        }),
      ])
    })

    it('should show only the async exchange confirmation when there is no delegation', () => {
      const { WrapperComponent, queryClient } = createWrapper()
      const { result } = renderHook(() => AgreementMutations.useSubmitDraft(false, true), {
        wrapper: WrapperComponent,
      })

      result.current.mutate({ agreementId: 'agreement-id', delegatorName: undefined })

      expect(queryClient.getMutationCache().getAll()[0]?.meta?.confirmationDialog).toEqual([
        expect.objectContaining({
          title: 'confirmDialog.asyncExchange.title',
          description: 'confirmDialog.asyncExchange.description',
          checkbox: 'confirmDialog.asyncExchange.checkbox',
        }),
      ])
    })

    it('should show only the delegation confirmation for sync delegated e-services', () => {
      const { WrapperComponent, queryClient } = createWrapper()
      const { result } = renderHook(() => AgreementMutations.useSubmitDraft(true, false), {
        wrapper: WrapperComponent,
      })

      result.current.mutate({ agreementId: 'agreement-id', delegatorName: 'Delegator' })

      expect(queryClient.getMutationCache().getAll()[0]?.meta?.confirmationDialog).toEqual([
        expect.objectContaining({
          title: 'confirmDialog.title',
          description: expect.any(Function),
        }),
      ])
    })

    it('should not show a confirmation for sync non-delegated e-services', () => {
      const { WrapperComponent, queryClient } = createWrapper()
      const { result } = renderHook(() => AgreementMutations.useSubmitDraft(false, false), {
        wrapper: WrapperComponent,
      })

      result.current.mutate({ agreementId: 'agreement-id', delegatorName: undefined })

      expect(queryClient.getMutationCache().getAll()[0]?.meta?.confirmationDialog).toEqual([])
    })
  })
})
