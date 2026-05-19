import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ConfirmationDialogMeta } from '@tanstack/react-query'
import { AgreementMutations } from '../agreement.mutations'

vi.mock('../agreement.services', () => ({
  AgreementServices: {
    createDraft: vi.fn(),
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

const isConfirmationDialogMeta = (
  confirmationDialog: unknown
): confirmationDialog is ConfirmationDialogMeta => {
  return typeof confirmationDialog === 'object' && confirmationDialog !== null
}

const getConfirmationDialogDescription = (confirmationDialog: unknown) => {
  if (!isConfirmationDialogMeta(confirmationDialog) || Array.isArray(confirmationDialog)) {
    return undefined
  }

  return typeof confirmationDialog.description === 'function'
    ? confirmationDialog.description
    : undefined
}

describe('AgreementMutations', () => {
  describe('useCreateDraft', () => {
    it('should resolve the confirmation description with the e-service name and version', () => {
      const { WrapperComponent, queryClient } = createWrapper()
      const { result } = renderHook(() => AgreementMutations.useCreateDraft(), {
        wrapper: WrapperComponent,
      })

      result.current.mutate({
        eserviceId: 'eservice-id',
        descriptorId: 'descriptor-id',
        eserviceName: 'E-Service name',
        eserviceVersion: '1',
      })

      const confirmationDialog = queryClient.getMutationCache().getAll()[0]
        ?.meta?.confirmationDialog

      expect(confirmationDialog).toEqual(
        expect.objectContaining({
          title: 'confirmDialog.title',
          description: expect.any(Function),
        })
      )
      expect(
        getConfirmationDialogDescription(confirmationDialog)?.({
          eserviceName: 'E-Service name',
          eserviceVersion: '1',
        })
      ).toBe('confirmDialog.description')
    })

    it('should resolve the confirmation description when variables are not the expected shape', () => {
      const { WrapperComponent, queryClient } = createWrapper()
      const { result } = renderHook(() => AgreementMutations.useCreateDraft(), {
        wrapper: WrapperComponent,
      })

      result.current.mutate({
        eserviceId: 'eservice-id',
        descriptorId: 'descriptor-id',
        eserviceName: 'E-Service name',
        eserviceVersion: '1',
      })

      const confirmationDialog = queryClient.getMutationCache().getAll()[0]
        ?.meta?.confirmationDialog

      expect(getConfirmationDialogDescription(confirmationDialog)?.('unexpected')).toBe(
        'confirmDialog.description'
      )
    })
  })

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

      expect(queryClient.getMutationCache().getAll()[0]?.meta?.confirmationDialog).toBeUndefined()
    })

    it('should resolve the delegated confirmation description with the delegator name', () => {
      const { WrapperComponent, queryClient } = createWrapper()
      const { result } = renderHook(() => AgreementMutations.useSubmitDraft(true, false), {
        wrapper: WrapperComponent,
      })

      result.current.mutate({ agreementId: 'agreement-id', delegatorName: 'Delegator' })

      const confirmationDialog = queryClient.getMutationCache().getAll()[0]
        ?.meta?.confirmationDialog

      expect(
        Array.isArray(confirmationDialog) &&
          confirmationDialog[0]?.description?.({ delegatorName: 'Delegator' })
      ).toBe('confirmDialog.description.isDelegated')
    })
  })
})
