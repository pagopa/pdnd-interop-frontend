import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { RiskAnalysisAnswerComponent } from '../RiskAnalysisAnswerComponent'
import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import * as router from '@/router'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import { PurposeTemplateDownloads } from '@/api/purposeTemplate/purposeTemplate.downloads'
import * as stores from '@/stores'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const questionKey = 'test-question-key'
const purposeTemplateId = 'test-template-id'
const initialAnnotation = { id: 'annotation-id', text: 'Original annotation', docs: [] }
const savedAnnotation = { id: 'annotation-id', text: 'Draft to retry', docs: [] }
const addAnnotation = vi.fn()
const updateAnnotation = vi.fn()

type FormValues = {
  answers: Record<string, string[]>
  annotations: Record<string, RiskAnalysisTemplateAnswerAnnotation | undefined>
  answerIds: Record<string, string | undefined>
  assignToTemplateUsers: Record<string, boolean>
  suggestedValues: Record<string, string[]>
}

describe('RiskAnalysisAnswerComponent with the real annotation drawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(router, 'useParams').mockReturnValue({ purposeTemplateId } as never)
    vi.spyOn(stores, 'useToastNotification').mockReturnValue({ showToast: vi.fn() } as never)
    vi.spyOn(stores, 'useDialog').mockReturnValue({ openDialog: vi.fn() } as never)
    vi.spyOn(PurposeTemplateMutations, 'useAddAnnotationToAnswer').mockReturnValue({
      mutateAsync: addAnnotation,
    } as never)
    vi.spyOn(PurposeTemplateMutations, 'useUpdateAnswerAnnotation').mockReturnValue({
      mutateAsync: updateAnnotation,
    } as never)
    vi.spyOn(PurposeTemplateMutations, 'useDeleteAnswerAnnotation').mockReturnValue({
      mutate: vi.fn(),
    } as never)
    vi.spyOn(PurposeTemplateMutations, 'useAddDocumentsToAnnotation').mockReturnValue({
      mutate: vi.fn(),
    } as never)
    vi.spyOn(PurposeTemplateMutations, 'useDeleteDocument').mockReturnValue({
      mutate: vi.fn(),
    } as never)
    vi.spyOn(
      PurposeTemplateMutations,
      'useUpdatePrettyNameAnnotationAssociatedDocument'
    ).mockReturnValue({ mutate: vi.fn() } as never)
    vi.spyOn(PurposeTemplateDownloads, 'useDownloadAnnotationDocument').mockReturnValue(vi.fn())
  })

  it.each(['create', 'update'] as const)(
    'keeps a failed %s draft and saves it on retry',
    async (mode) => {
      const user = userEvent.setup()
      let form!: UseFormReturn<FormValues>
      const mutation = mode === 'create' ? addAnnotation : updateAnnotation
      mutation.mockRejectedValueOnce(new Error('Save failed'))
      mutation.mockResolvedValueOnce(
        mode === 'create' ? { id: 'answer-id', annotation: savedAnnotation } : savedAnnotation
      )

      function FormWrapper() {
        form = useForm<FormValues>({
          defaultValues: {
            answers: { [questionKey]: ['value1'] },
            annotations: { [questionKey]: mode === 'update' ? initialAnnotation : undefined },
            answerIds: { [questionKey]: mode === 'update' ? 'answer-id' : undefined },
            assignToTemplateUsers: { [questionKey]: false },
            suggestedValues: { [questionKey]: [] },
          },
        })
        return (
          <FormProvider {...form}>
            <RiskAnalysisAnswerComponent
              questionKey={questionKey}
              question="Test question"
              questionType="radio"
            />
          </FormProvider>
        )
      }

      renderWithApplicationContext(<FormWrapper />, { withReactQueryContext: true })
      await user.click(
        screen.getByRole('button', {
          name: mode === 'create' ? 'addAnnotationBtn' : 'editAnnotationBtn',
        })
      )
      const textbox = screen.getByLabelText('label')
      await user.clear(textbox)
      await user.type(textbox, 'Draft to retry')
      await user.click(screen.getByRole('button', { name: 'addBtn' }))

      await waitFor(() => expect(mutation).toHaveBeenCalledTimes(1))
      expect(screen.getByLabelText('label')).toHaveValue('Draft to retry')
      expect(form.getValues(`annotations.${questionKey}`)).toEqual(
        mode === 'update' ? initialAnnotation : undefined
      )
      expect(form.getValues(`answerIds.${questionKey}`)).toBe(
        mode === 'update' ? 'answer-id' : undefined
      )

      await user.click(screen.getByRole('button', { name: 'addBtn' }))
      await waitFor(() => expect(mutation).toHaveBeenCalledTimes(2))
      await waitFor(() => expect(screen.queryByLabelText('label')).not.toBeInTheDocument())
      expect(form.getValues(`annotations.${questionKey}`)).toEqual(savedAnnotation)
      expect(form.getValues(`answerIds.${questionKey}`)).toBe('answer-id')
      expect(screen.getByText('Draft to retry', { selector: 'p' })).toBeInTheDocument()
    }
  )
})
