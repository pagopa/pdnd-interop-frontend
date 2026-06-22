import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { FormProvider, useForm, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'
import { RiskAnalysisAnswerComponent } from '../RiskAnalysisAnswerComponent'
import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import * as router from '@/router'
import * as PurposeTemplateServices from '@/api/purposeTemplate/purposeTemplate.services'
import * as PurposeTemplateMutations from '@/api/purposeTemplate/purposeTemplate.mutations'
import * as PurposeTemplateDownloads from '@/api/purposeTemplate/purposeTemplate.downloads'
import * as useDrawerStateHook from '@/hooks/useDrawerState'
import * as stores from '@/stores'

const purposeTemplateId = 'test-template-id'
const questionKey = 'test-question-key'

vi.spyOn(router, 'useParams').mockReturnValue({ purposeTemplateId })

const mockWatch = vi.fn()
const mockSetValue = vi.fn()
const mockShowToast = vi.fn()
const mockOpenDialog = vi.fn()
const mockOpenDrawer = vi.fn()
const mockCloseDrawer = vi.fn()

const mockUpdateDocumentPrettyName = vi.fn()
const mockDownloadAnnotationDocument = vi.fn()

vi.spyOn(stores, 'useToastNotification').mockReturnValue({
  showToast: mockShowToast,
} as never)

vi.spyOn(stores, 'useDialog').mockReturnValue({
  openDialog: mockOpenDialog,
} as never)

vi.spyOn(useDrawerStateHook, 'useDrawerState').mockReturnValue({
  isOpen: false,
  openDrawer: mockOpenDrawer,
  closeDrawer: mockCloseDrawer,
} as never)

vi.spyOn(
  PurposeTemplateMutations.PurposeTemplateMutations,
  'useUpdatePrettyNameAnnotationAssociatedDocument'
).mockReturnValue({
  mutate: mockUpdateDocumentPrettyName,
} as never)

vi.spyOn(
  PurposeTemplateDownloads.PurposeTemplateDownloads,
  'useDownloadAnnotationDocument'
).mockReturnValue(mockDownloadAnnotationDocument)

vi.spyOn(
  PurposeTemplateServices.PurposeTemplateServices,
  'addRiskAnalysisAnswer'
).mockResolvedValue({
  id: 'answer-id',
  annotation: {
    id: 'annotation-id',
    text: 'Test annotation',
    docs: [],
  },
} as never)

vi.spyOn(
  PurposeTemplateServices.PurposeTemplateServices,
  'updateRiskAnalysisAnswerAnnotation'
).mockResolvedValue({
  id: 'annotation-id',
  text: 'Updated annotation',
  docs: [],
} as never)

vi.spyOn(
  PurposeTemplateServices.PurposeTemplateServices,
  'deleteRiskAnalysisAnswerAnnotation'
).mockResolvedValue(undefined)

vi.spyOn(
  PurposeTemplateServices.PurposeTemplateServices,
  'addDocumentToAnnotation'
).mockResolvedValue({
  id: 'doc-id',
  name: 'test-doc.pdf',
  prettyName: 'test-doc.pdf',
  contentType: 'application/pdf',
  path: '/path/to/test-doc.pdf',
  createdAt: '2023-01-01T00:00:00Z',
  checksum: 'checksum-test',
} as never)

vi.spyOn(
  PurposeTemplateServices.PurposeTemplateServices,
  'deleteDocumentFromAnnotation'
).mockResolvedValue(undefined)

vi.mock('@/components/shared/AddAnnotationDrawer', () => ({
  AddAnnotationDrawer: ({
    isOpen,
    onClose,
    onSubmit,
    initialAnnotation,
    question,
  }: {
    isOpen: boolean
    onClose: () => void
    onSubmit: (annotation: RiskAnalysisTemplateAnswerAnnotation) => void
    initialAnnotation?: RiskAnalysisTemplateAnswerAnnotation
    question: string
  }) => (
    <div data-testid="add-annotation-drawer" style={{ display: isOpen ? 'block' : 'none' }}>
      <button onClick={() => onSubmit({ id: 'test-id', text: 'Test annotation', docs: [] })}>
        Submit Annotation
      </button>
      <button onClick={onClose}>Close Drawer</button>
      {initialAnnotation && <div data-testid="initial-annotation">{initialAnnotation.text}</div>}
      <div>{question}</div>
    </div>
  ),
}))

vi.mock('@/components/layout/containers/DocumentContainer', () => ({
  DocumentContainer: ({
    doc,
    onDownload,
    onDelete,
    onUpdateDescription,
  }: {
    doc: { id: string; name: string; prettyName: string; contentType: string; checksum: string }
    onDownload: (doc: {
      id: string
      name: string
      prettyName: string
      contentType: string
      checksum: string
    }) => void
    onDelete: (doc: {
      id: string
      name: string
      prettyName: string
      contentType: string
      checksum: string
    }) => void
    onUpdateDescription: (name: string) => void
  }) => (
    <div data-testid={`document-${doc.id}`}>
      <span>{doc.prettyName}</span>
      <button onClick={() => onDownload({ ...doc })}>Download</button>
      <button onClick={() => onDelete({ ...doc })}>Delete</button>
      <button onClick={() => onUpdateDescription('Updated Name')}>Update Name</button>
    </div>
  ),
}))

type FormValues = {
  answers: Record<string, string | string[]>
  annotations: Record<string, RiskAnalysisTemplateAnswerAnnotation | undefined>
  answerIds: Record<string, string | undefined>
  assignToTemplateUsers: Record<string, boolean>
  suggestedValues: Record<string, string[]>
}

const FormWrapper: React.FC<{
  children: React.ReactNode
  defaultValues?: Partial<FormValues>
}> = ({ children, defaultValues = {} }) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      answers: {},
      annotations: {},
      answerIds: {},
      assignToTemplateUsers: {},
      suggestedValues: {},
      ...defaultValues,
    },
  })

  formMethods.watch = mockWatch as UseFormWatch<FormValues>
  formMethods.setValue = mockSetValue as UseFormSetValue<FormValues>

  return <FormProvider {...formMethods}>{children}</FormProvider>
}

describe('RiskAnalysisAnswerComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWatch.mockImplementation((path: string) => {
      if (path === `annotations.${questionKey}`) return undefined
      if (path === `assignToTemplateUsers.${questionKey}`) return false
      if (path === `answers.${questionKey}`) return undefined
      if (path === `suggestedValues.${questionKey}`) return []
      if (path === `answerIds.${questionKey}`) return undefined
      return undefined
    })
  })

  describe('Rendering', () => {
    it('should render switch for non-text question types', () => {
      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      expect(screen.getByText('switchLabel')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /switchLabel/i })).toBeInTheDocument()
    })

    it('should not render switch for text question type', () => {
      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="text"
          />
        </FormWrapper>
      )

      expect(screen.queryByText('switchLabel')).not.toBeInTheDocument()
      expect(screen.queryByRole('checkbox', { name: /switchLabel/i })).not.toBeInTheDocument()
    })

    it('should render add annotation button when no annotation exists', () => {
      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      expect(screen.getByText('addAnnotationBtn')).toBeInTheDocument()
    })

    it('should disable add annotation button when conditions are not met', () => {
      mockWatch.mockImplementation((path: string) => {
        if (path === `answers.${questionKey}`) return undefined
        if (path === `suggestedValues.${questionKey}`) return []
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const button = screen.getByText('addAnnotationBtn')
      expect(button.closest('button')).toBeDisabled()
    })

    it('should enable add annotation button when assignToTemplateUsers is true', () => {
      mockWatch.mockImplementation((path: string) => {
        if (path === `assignToTemplateUsers.${questionKey}`) return true
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const button = screen.getByText('addAnnotationBtn')
      expect(button.closest('button')).not.toBeDisabled()
    })

    it('should enable add annotation button when questionValues exist', () => {
      mockWatch.mockImplementation((path: string) => {
        if (path === `answers.${questionKey}`) return ['value1']
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const button = screen.getByText('addAnnotationBtn')
      expect(button.closest('button')).not.toBeDisabled()
    })

    it('should enable add annotation button when suggestedValues exist for text type', () => {
      mockWatch.mockImplementation((path: string) => {
        if (path === `suggestedValues.${questionKey}`) return ['suggested1']
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="text"
          />
        </FormWrapper>
      )

      const button = screen.getByText('addAnnotationBtn')
      expect(button.closest('button')).not.toBeDisabled()
    })
  })

  describe('Annotation Display', () => {
    const mockAnnotation: RiskAnalysisTemplateAnswerAnnotation = {
      id: 'annotation-id',
      text: 'Test annotation text',
      docs: [],
    }

    it('should display annotation when it exists', () => {
      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotation
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      expect(screen.getByText('annotationSectionTitle')).toBeInTheDocument()
      const annotationText = screen.getByText('Test annotation text', { selector: 'p' })
      expect(annotationText).toBeInTheDocument()
      expect(screen.getByText('editAnnotationBtn')).toBeInTheDocument()
      expect(screen.getByText('deleteAnnotationBtn')).toBeInTheDocument()
    })

    it('should not display add annotation button when annotation exists', () => {
      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotation
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      expect(screen.queryByText('addAnnotationBtn')).not.toBeInTheDocument()
    })
  })

  describe('Annotation Management', () => {
    it('should open drawer when add annotation button is clicked', async () => {
      const user = userEvent.setup()
      mockWatch.mockImplementation((path: string) => {
        if (path === `answers.${questionKey}`) return ['value1']
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const addButton = screen.getByText('addAnnotationBtn')
      await user.click(addButton)

      expect(mockOpenDrawer).toHaveBeenCalled()
    })

    it('should create new annotation when submitting without existing answerId', async () => {
      const user = userEvent.setup()
      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return undefined
        if (path === `answerIds.${questionKey}`) return undefined
        if (path === `answers.${questionKey}`) return ['value1']
        if (path === `suggestedValues.${questionKey}`) return []
        if (path === `assignToTemplateUsers.${questionKey}`) return false
        return undefined
      })

      vi.spyOn(useDrawerStateHook, 'useDrawerState').mockReturnValue({
        isOpen: true,
        openDrawer: mockOpenDrawer,
        closeDrawer: mockCloseDrawer,
      } as never)

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const submitButton = screen.getByText('Submit Annotation')
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          PurposeTemplateServices.PurposeTemplateServices.addRiskAnalysisAnswer
        ).toHaveBeenCalledWith({
          purposeTemplateId,
          answerRequest: {
            answerKey: questionKey,
            answerData: {
              values: ['value1'],
              editable: false,
              annotation: {
                text: 'Test annotation',
              },
              suggestedValues: [],
            },
          },
        })
      })

      expect(mockSetValue).toHaveBeenCalledWith(`answerIds.${questionKey}`, 'answer-id', {
        shouldDirty: true,
      })
      expect(mockSetValue).toHaveBeenCalledWith(
        `annotations.${questionKey}`,
        expect.objectContaining({ text: 'Test annotation' }),
        { shouldDirty: true }
      )
      expect(mockShowToast).toHaveBeenCalledWith('notifications.annotationAddedSuccess', 'success')
    })

    it('should update existing annotation when answerId exists', async () => {
      const user = userEvent.setup()
      const existingAnnotation: RiskAnalysisTemplateAnswerAnnotation = {
        id: 'annotation-id',
        text: 'Existing annotation',
        docs: [],
      }

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return existingAnnotation
        if (path === `answerIds.${questionKey}`) return 'existing-answer-id'
        return undefined
      })

      vi.spyOn(useDrawerStateHook, 'useDrawerState').mockReturnValue({
        isOpen: true,
        openDrawer: mockOpenDrawer,
        closeDrawer: mockCloseDrawer,
      } as never)

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const submitButton = screen.getByText('Submit Annotation')
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          PurposeTemplateServices.PurposeTemplateServices.updateRiskAnalysisAnswerAnnotation
        ).toHaveBeenCalledWith({
          purposeTemplateId,
          answerId: 'existing-answer-id',
          annotationText: { text: 'Test annotation' },
        })
      })

      expect(mockSetValue).toHaveBeenCalledWith(
        `annotations.${questionKey}`,
        expect.objectContaining({ text: 'Updated annotation' }),
        { shouldDirty: true }
      )
      expect(mockShowToast).toHaveBeenCalledWith('notifications.annotationAddedSuccess', 'success')
    })

    it('should handle annotation creation error', async () => {
      const user = userEvent.setup()
      const error = new Error('API Error')
      vi.spyOn(
        PurposeTemplateServices.PurposeTemplateServices,
        'addRiskAnalysisAnswer'
      ).mockRejectedValueOnce(error)

      mockWatch.mockImplementation((path: string) => {
        if (path === `answerIds.${questionKey}`) return undefined
        if (path === `answers.${questionKey}`) return ['value1']
        if (path === `suggestedValues.${questionKey}`) return []
        if (path === `assignToTemplateUsers.${questionKey}`) return false
        return undefined
      })

      vi.spyOn(useDrawerStateHook, 'useDrawerState').mockReturnValue({
        isOpen: true,
        openDrawer: mockOpenDrawer,
        closeDrawer: mockCloseDrawer,
      } as never)

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const submitButton = screen.getByText('Submit Annotation')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('notifications.annotationAddError', 'error')
        expect(mockSetValue).toHaveBeenCalledWith(
          `annotations.${questionKey}`,
          expect.objectContaining({ text: 'Test annotation' }),
          { shouldDirty: true }
        )
      })
    })

    it('should delete annotation when delete button is clicked', async () => {
      const user = userEvent.setup()
      const mockAnnotation: RiskAnalysisTemplateAnswerAnnotation = {
        id: 'annotation-id',
        text: 'Test annotation',
        docs: [],
      }

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotation
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      mockOpenDialog.mockImplementation(({ onProceed }: { onProceed: () => void }) => {
        onProceed()
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const deleteButton = screen.getByText('deleteAnnotationBtn')
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockOpenDialog).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'deleteAnnotation',
            onProceed: expect.any(Function),
          })
        )
        expect(
          PurposeTemplateServices.PurposeTemplateServices.deleteRiskAnalysisAnswerAnnotation
        ).toHaveBeenCalledWith({
          purposeTemplateId,
          answerId: 'answer-id',
        })
        expect(mockSetValue).toHaveBeenCalledWith(`annotations.${questionKey}`, undefined, {
          shouldDirty: true,
        })
        expect(mockSetValue).toHaveBeenCalledWith(`answerIds.${questionKey}`, undefined, {
          shouldDirty: true,
        })
        expect(mockShowToast).toHaveBeenCalledWith(
          'notifications.annotationDeletedSuccess',
          'success'
        )
      })
    })

    it('should handle annotation deletion error', async () => {
      const user = userEvent.setup()
      const error = new Error('Delete Error')
      vi.spyOn(
        PurposeTemplateServices.PurposeTemplateServices,
        'deleteRiskAnalysisAnswerAnnotation'
      ).mockRejectedValueOnce(error)

      const mockAnnotation: RiskAnalysisTemplateAnswerAnnotation = {
        id: 'annotation-id',
        text: 'Test annotation',
        docs: [],
      }

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotation
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      mockOpenDialog.mockImplementation(({ onProceed }: { onProceed: () => void }) => {
        onProceed()
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const deleteButton = screen.getByText('deleteAnnotationBtn')
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('notifications.annotationDeleteError', 'error')
      })
    })
  })

  describe('Document Management', () => {
    const mockAnnotationWithDocs: RiskAnalysisTemplateAnswerAnnotation = {
      id: 'annotation-id',
      text: 'Test annotation',
      docs: [
        {
          id: 'doc-1',
          name: 'doc1.pdf',
          prettyName: 'Document 1',
          contentType: 'application/pdf',
          path: '/path/to/doc1.pdf',
          createdAt: '2023-01-01T00:00:00Z',
          checksum: 'checksum-1',
        },
      ],
    }

    it('should show add document button when annotation exists and no documents', () => {
      const mockAnnotation: RiskAnalysisTemplateAnswerAnnotation = {
        id: 'annotation-id',
        text: 'Test annotation',
        docs: [],
      }

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotation
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      expect(screen.getByText('addDocumentBtn')).toBeInTheDocument()
    })

    it('should display documents when they exist', () => {
      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotationWithDocs
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      expect(screen.getByTestId('document-doc-1')).toBeInTheDocument()
      expect(screen.getByText('Document 1')).toBeInTheDocument()
    })

    it('should prevent adding more than 2 documents', async () => {
      const annotationWithMaxDocs: RiskAnalysisTemplateAnswerAnnotation = {
        id: 'annotation-id',
        text: 'Test annotation',
        docs: [
          {
            id: 'doc-1',
            name: 'doc1.pdf',
            prettyName: 'Doc 1',
            contentType: 'application/pdf',
            path: '/path/to/doc1.pdf',
            createdAt: '2023-01-01T00:00:00Z',
            checksum: 'checksum-1',
          },
          {
            id: 'doc-2',
            name: 'doc2.pdf',
            prettyName: 'Doc 2',
            contentType: 'application/pdf',
            path: '/path/to/doc2.pdf',
            createdAt: '2023-01-01T00:00:00Z',
            checksum: 'checksum-2',
          },
        ],
      }

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotationWithMaxDocs
        if (path === `annotations.${questionKey}.docs`) return annotationWithMaxDocs.docs
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      expect(screen.queryByText('addDocumentBtn')).not.toBeInTheDocument()
    })

    it('should upload document successfully', async () => {
      const user = userEvent.setup()
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotationWithDocs
        if (path === `annotations.${questionKey}.docs`) return mockAnnotationWithDocs.docs
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const addDocButton = screen.getByText('addDocumentBtn')
      await user.click(addDocButton)

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        await user.upload(fileInput, mockFile)

        await waitFor(() => {
          const uploadButton = screen.getByText('uploadBtn')
          expect(uploadButton).toBeInTheDocument()
        })

        const uploadButton = screen.getByText('uploadBtn')
        await user.click(uploadButton)

        await waitFor(() => {
          expect(
            PurposeTemplateServices.PurposeTemplateServices.addDocumentToAnnotation
          ).toHaveBeenCalledWith({
            purposeTemplateId,
            answerId: 'answer-id',
            documentPayload: {
              prettyName: 'test.pdf',
              doc: mockFile,
            },
          })
        })

        expect(mockShowToast).toHaveBeenCalledWith(
          'notifications.documentUploadedSuccess',
          'success'
        )
      }
    })

    it('should delete document successfully', async () => {
      const user = userEvent.setup()

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotationWithDocs
        if (path === `annotations.${questionKey}.docs`) return mockAnnotationWithDocs.docs
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const deleteButton = screen.getByText('Delete')
      await user.click(deleteButton)

      await waitFor(() => {
        expect(
          PurposeTemplateServices.PurposeTemplateServices.deleteDocumentFromAnnotation
        ).toHaveBeenCalledWith({
          purposeTemplateId,
          answerId: 'answer-id',
          documentId: 'doc-1',
        })
        expect(mockSetValue).toHaveBeenCalledWith(`annotations.${questionKey}.docs`, [], {
          shouldDirty: true,
        })
        expect(mockShowToast).toHaveBeenCalledWith(
          'notifications.documentDeletedSuccess',
          'success'
        )
      })
    })

    it('should download document', async () => {
      const user = userEvent.setup()

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotationWithDocs
        if (path === `annotations.${questionKey}.docs`) return mockAnnotationWithDocs.docs
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const downloadButton = screen.getByText('Download')
      await user.click(downloadButton)

      expect(mockDownloadAnnotationDocument).toHaveBeenCalledWith(
        {
          purposeTemplateId,
          answerId: 'answer-id',
          documentId: 'doc-1',
        },
        expect.stringContaining('')
      )
    })

    it('should update document pretty name', async () => {
      const user = userEvent.setup()

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return mockAnnotationWithDocs
        if (path === `annotations.${questionKey}.docs`) return mockAnnotationWithDocs.docs
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const updateButton = screen.getByText('Update Name')
      await user.click(updateButton)

      expect(mockUpdateDocumentPrettyName).toHaveBeenCalledWith(
        {
          purposeTemplateId,
          answerId: 'answer-id',
          documentId: 'doc-1',
          prettyName: 'Updated Name',
        },
        expect.objectContaining({
          onSuccess: expect.any(Function) as (data: unknown) => void,
        })
      )
    })
  })

  describe('assignToTemplateUsers Switch', () => {
    it('should clear answer field when assignToTemplateUsers is set to true', async () => {
      const user = userEvent.setup()
      let assignToTemplateUsers = false

      mockWatch.mockImplementation((path: string) => {
        if (path === `assignToTemplateUsers.${questionKey}`) return assignToTemplateUsers
        if (path === `answers.${questionKey}`) return 'some-answer'
        return undefined
      })

      const { rerender } = render(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      const switchElement = screen.getByRole('checkbox', { name: /switchLabel/i })
      await user.click(switchElement)

      assignToTemplateUsers = true
      mockWatch.mockImplementation((path: string) => {
        if (path === `assignToTemplateUsers.${questionKey}`) return true
        if (path === `answers.${questionKey}`) return 'some-answer'
        return undefined
      })

      rerender(
        <FormWrapper>
          <RiskAnalysisAnswerComponent
            questionKey={questionKey}
            question="Test Question"
            questionType="radio"
          />
        </FormWrapper>
      )

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith(`answers.${questionKey}`, '', {
          shouldDirty: true,
        })
      })
    })
  })
})
