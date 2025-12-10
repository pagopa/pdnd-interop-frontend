import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { PurposeTemplateMutations } from '../purposeTemplate.mutations'
import { PurposeTemplateServices } from '../purposeTemplate.services'

// Mock the services
vi.mock('../purposeTemplate.services', () => ({
  PurposeTemplateServices: {
    createDraft: vi.fn(),
    updateDraft: vi.fn(),
    linkEserviceToPurposeTemplate: vi.fn(),
    unlinkEserviceFromPurposeTemplate: vi.fn(),
    publishDraft: vi.fn(),
    deleteDraft: vi.fn(),
    deleteAnnotation: vi.fn(),
    deleteDocumentFromAnnotation: vi.fn(),
    suspendPurposeTemplate: vi.fn(),
    reactivatePurposeTemplate: vi.fn(),
    archivePurposeTemplate: vi.fn(),
    addRiskAnalysisAnswer: vi.fn(),
    addDocumentToAnnotation: vi.fn(),
  },
}))

// Mock react-i18next
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
  const WrapperComponent = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  WrapperComponent.displayName = 'TestWrapper'
  return WrapperComponent
}

describe('PurposeTemplateMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateDraft', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useCreateDraft(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call createDraft service when mutation is executed', async () => {
      const mockPayload = {
        targetDescription: 'Test',
        targetTenantKind: 'PA' as const,
        purposeTitle: 'Test Purpose',
        purposeDescription: 'Test Description',
        purposeIsFreeOfCharge: true,
        purposeDailyCalls: 1000,
        handlesPersonalData: false,
      }

      const { result } = renderHook(() => PurposeTemplateMutations.useCreateDraft(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.createDraft).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useUpdateDraft', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useUpdateDraft(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call updateDraft service when mutation is executed', async () => {
      const mockPayload = {
        purposeTemplateId: 'test-id',
        targetDescription: 'Test',
        targetTenantKind: 'PA' as const,
        purposeTitle: 'Test Purpose',
        purposeDescription: 'Test Description',
        purposeIsFreeOfCharge: true,
        purposeDailyCalls: 1000,
        handlesPersonalData: false,
      }

      const { result } = renderHook(() => PurposeTemplateMutations.useUpdateDraft(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.updateDraft).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useLinkEserviceToPurposeTemplate', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(
        () => PurposeTemplateMutations.useLinkEserviceToPurposeTemplate(),
        {
          wrapper: createWrapper(),
        }
      )

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call linkEserviceToPurposeTemplate service when mutation is executed', async () => {
      const mockPayload = {
        purposeTemplateId: 'test-template-id',
        eserviceId: 'test-eservice-id',
      }

      const { result } = renderHook(
        () => PurposeTemplateMutations.useLinkEserviceToPurposeTemplate(),
        {
          wrapper: createWrapper(),
        }
      )

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.linkEserviceToPurposeTemplate).toHaveBeenCalledWith(
        mockPayload
      )
    })
  })

  describe('useUnlinkEserviceFromPurposeTemplate', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(
        () => PurposeTemplateMutations.useUnlinkEserviceFromPurposeTemplate(),
        {
          wrapper: createWrapper(),
        }
      )

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call unlinkEserviceFromPurposeTemplate service when mutation is executed', async () => {
      const mockPayload = {
        purposeTemplateId: 'test-template-id',
        eserviceId: 'test-eservice-id',
      }

      const { result } = renderHook(
        () => PurposeTemplateMutations.useUnlinkEserviceFromPurposeTemplate(),
        {
          wrapper: createWrapper(),
        }
      )

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.unlinkEserviceFromPurposeTemplate).toHaveBeenCalledWith(
        mockPayload
      )
    })
  })

  describe('usePublishDraft', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.usePublishDraft(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call publishDraft service when mutation is executed', async () => {
      const mockPayload = { id: 'test-id' }

      const { result } = renderHook(() => PurposeTemplateMutations.usePublishDraft(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.publishDraft).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useDeleteDraft', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useDeleteDraft(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call deleteDraft service when mutation is executed', async () => {
      const mockPayload = { id: 'test-id' }

      const { result } = renderHook(() => PurposeTemplateMutations.useDeleteDraft(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.deleteDraft).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useDeleteAnnotation', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useDeleteAnnotation(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call deleteAnnotation service when mutation is executed', async () => {
      const mockPayload = {
        purposeTemplateId: 'test-template-id',
        answerId: 'test-answer-id',
      }

      const { result } = renderHook(() => PurposeTemplateMutations.useDeleteAnnotation(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.deleteAnnotation).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useDeleteDocument', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useDeleteDocument(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call deleteDocumentFromAnnotation service when mutation is executed', async () => {
      const mockPayload = {
        purposeTemplateId: 'test-template-id',
        answerId: 'test-answer-id',
        documentId: 'test-document-id',
      }

      const { result } = renderHook(() => PurposeTemplateMutations.useDeleteDocument(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.deleteDocumentFromAnnotation).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useSuspendPurposeTemplate', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useSuspendPurposeTemplate(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call suspendPurposeTemplate service when mutation is executed', async () => {
      const mockPayload = { id: 'test-id' }

      const { result } = renderHook(() => PurposeTemplateMutations.useSuspendPurposeTemplate(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.suspendPurposeTemplate).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useReactivatePurposeTemplate', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useReactivatePurposeTemplate(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call reactivatePurposeTemplate service when mutation is executed', async () => {
      const mockPayload = { id: 'test-id' }

      const { result } = renderHook(() => PurposeTemplateMutations.useReactivatePurposeTemplate(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.reactivatePurposeTemplate).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useArchivePurposeTemplate', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useArchivePurposeTemplate(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call archivePurposeTemplate service when mutation is executed', async () => {
      const mockPayload = { id: 'test-id' }

      const { result } = renderHook(() => PurposeTemplateMutations.useArchivePurposeTemplate(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.archivePurposeTemplate).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useAddAnnotationToAnswer', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useAddAnnotationToAnswer(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call addRiskAnalysisAnswer service when mutation is executed', async () => {
      const mockPayload = {
        purposeTemplateId: 'test-template-id',
        answerRequest: {
          answerKey: 'test-key',
          answerData: {
            values: ['test-value'],
            editable: false,
            annotation: { text: 'test annotation', docs: [] },
            suggestedValues: [],
          },
        },
      }

      const { result } = renderHook(() => PurposeTemplateMutations.useAddAnnotationToAnswer(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.addRiskAnalysisAnswer).toHaveBeenCalledWith(mockPayload)
    })
  })

  describe('useAddDocumentsToAnnotation', () => {
    it('should return mutation with correct configuration', () => {
      const { result } = renderHook(() => PurposeTemplateMutations.useAddDocumentsToAnnotation(), {
        wrapper: createWrapper(),
      })

      expect(result.current.mutate).toBeDefined()
      expect(result.current.mutateAsync).toBeDefined()
      expect(result.current.isPending).toBe(false)
    })

    it('should call addDocumentToAnnotation service when mutation is executed', async () => {
      const mockPayload = {
        purposeTemplateId: 'test-template-id',
        answerId: 'test-answer-id',
        documentPayload: {
          prettyName: 'test-document.pdf',
          doc: new File(['test'], 'test-document.pdf'),
        },
      }

      const { result } = renderHook(() => PurposeTemplateMutations.useAddDocumentsToAnnotation(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync(mockPayload)

      expect(PurposeTemplateServices.addDocumentToAnnotation).toHaveBeenCalledWith(mockPayload)
    })
  })
})
