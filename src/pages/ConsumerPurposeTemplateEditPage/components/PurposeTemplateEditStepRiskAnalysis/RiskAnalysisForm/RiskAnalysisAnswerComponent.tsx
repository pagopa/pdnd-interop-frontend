import { RHFSwitch, RHFSingleFileInput } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Stack, Typography, Button } from '@mui/material'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AddAnnotationDrawer } from '@/components/shared/AddAnnotationDrawer'
import { useFormContext, useForm, FormProvider } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useToastNotification, useDialog } from '@/stores'
import type {
  RiskAnalysisTemplateAnswerAnnotation,
  RiskAnalysisTemplateAnswerRequest,
  RiskAnalysisTemplateAnswerAnnotationDocument,
} from '@/api/api.generatedTypes'
import { PurposeTemplateServices } from '@/api/purposeTemplate/purposeTemplate.services'
import { useParams } from '@/router'

type DocumentUploadFormValues = {
  doc: File | null
}

const defaultValues: DocumentUploadFormValues = {
  doc: null,
}

export const RiskAnalysisAnswerComponent: React.FC<{
  questionId: string
}> = ({ questionId }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const { setValue, watch } = useFormContext()
  const { showToast } = useToastNotification()
  const { openDialog } = useDialog()
  const annotation: RiskAnalysisTemplateAnswerAnnotation | undefined = watch(
    `annotations.${questionId}`
  )
  const assignToTemplateUsers: boolean = watch(`assignToTemplateUsers.${questionId}`) || false
  const questionValue = watch(`answers.${questionId}`)
  const questionValues: string[] = Array.isArray(questionValue)
    ? questionValue
    : questionValue
    ? [questionValue]
    : []

  // Document management states
  const [showDocInput, setShowDocInput] = useState(false)

  // Separate form for document upload
  const documentUploadForm = useForm<DocumentUploadFormValues>({
    defaultValues,
    shouldUnregister: true,
  })

  // Get documents from annotation
  const docs: RiskAnalysisTemplateAnswerAnnotationDocument[] = annotation?.docs || []

  // Clear answer field when editable flag is set to true
  useEffect(() => {
    if (assignToTemplateUsers) {
      // Clear the answer field when the question becomes editable
      setValue(`answers.${questionId}`, '', { shouldDirty: true })
    }
  }, [assignToTemplateUsers, questionId, setValue])

  const handleClick = () => {
    openDrawer()
  }

  const handleAnnotationSubmit = async (annotation: RiskAnalysisTemplateAnswerAnnotation) => {
    try {
      // Check if we already have an answerId (from previous creation)
      const existingAnswerId = watch(`answerIds.${questionId}`)

      if (existingAnswerId) {
        // Update existing annotation using PUT API
        const updatedAnnotation = await PurposeTemplateServices.updateRiskAnalysisAnswerAnnotation({
          purposeTemplateId,
          answerId: existingAnswerId,
          annotationText: { text: annotation.text },
        })
        setValue(`annotations.${questionId}`, updatedAnnotation, { shouldDirty: true })

        // Show success notification
        showToast(t('notifications.annotationAddedSuccess'), 'success')
      } else {
        // Create new annotation using POST API
        const answerRequest: RiskAnalysisTemplateAnswerRequest = {
          answerKey: questionId,
          answerData: {
            values: assignToTemplateUsers ? [] : questionValues,
            editable: assignToTemplateUsers,
            annotation: {
              text: annotation.text,
              docs: [], // Always empty array for this API
            },
            suggestedValues: [],
          },
        }

        const savedAnswer = await PurposeTemplateServices.addRiskAnalysisAnswer({
          purposeTemplateId,
          answerRequest,
        })

        // Save the answerId for future updates
        setValue(`answerIds.${questionId}`, savedAnswer.id, { shouldDirty: true })

        // Update the form with the saved annotation
        if (savedAnswer.annotation) {
          setValue(`annotations.${questionId}`, savedAnswer.annotation, { shouldDirty: true })
        }

        // Show success notification
        showToast(t('notifications.annotationAddedSuccess'), 'success')
      }
    } catch (error) {
      console.error('Error saving annotation:', error)
      // Show error notification
      showToast(t('notifications.annotationAddError'), 'error')
      // Fallback: save locally anyway
      setValue(`annotations.${questionId}`, annotation, { shouldDirty: true })
    }
  }

  const handleRemove = () => {
    openDialog({
      type: 'deleteAnnotation',
      onProceed: async () => {
        try {
          // Check if we have an answerId (annotation exists in database)
          const existingAnswerId = watch(`answerIds.${questionId}`)

          if (existingAnswerId) {
            // Delete annotation from database
            await PurposeTemplateServices.deleteRiskAnalysisAnswerAnnotation({
              purposeTemplateId,
              answerId: existingAnswerId,
            })
          }

          // Clear form fields
          setValue(`annotations.${questionId}`, undefined, { shouldDirty: true })
          setValue(`answerIds.${questionId}`, undefined, { shouldDirty: true })
        } catch (error) {
          console.error('Error deleting annotation:', error)
          // Fallback: clear form fields anyway
          setValue(`annotations.${questionId}`, undefined, { shouldDirty: true })
          setValue(`answerIds.${questionId}`, undefined, { shouldDirty: true })
        }
      },
    })
  }

  // Document management functions
  const handleAddDocumentClick = () => {
    // Check if we've reached the limit of 2 documents
    if (docs.length >= 2) {
      // TODO: Show error message to user
      console.warn('Maximum of 2 documents allowed')
      return
    }
    setShowDocInput(true)
  }

  const handleDocumentUpload = async ({ doc }: DocumentUploadFormValues) => {
    if (!doc) return

    try {
      const existingAnswerId = watch(`answerIds.${questionId}`)

      const documentPayload = {
        prettyName: doc.name,
        doc,
      }

      const uploadedDoc = await PurposeTemplateServices.addDocumentToAnnotation({
        purposeTemplateId,
        answerId: existingAnswerId,
        documentPayload,
      })

      // Update form with the uploaded document
      const currentDocs =
        (watch(
          `annotations.${questionId}.docs`
        ) as RiskAnalysisTemplateAnswerAnnotationDocument[]) ?? []
      setValue(`annotations.${questionId}.docs`, [...currentDocs, uploadedDoc], {
        shouldDirty: true,
      })

      setShowDocInput(false)
    } catch (error) {
      console.error('Error uploading document:', error)
      setShowDocInput(false)
    }
  }

  const handleDownload = (doc: RiskAnalysisTemplateAnswerAnnotationDocument) => {
    // TODO: Implement download from backend
    console.log('Download document:', doc)
  }

  const handleDelete = (doc: RiskAnalysisTemplateAnswerAnnotationDocument) => {
    const currentDocs =
      (watch(`annotations.${questionId}.docs`) as RiskAnalysisTemplateAnswerAnnotationDocument[]) ??
      []
    setValue(
      `annotations.${questionId}.docs`,
      currentDocs.filter((d) => d.id !== doc.id),
      { shouldDirty: true }
    )
    // TODO: Implement delete from backend
  }

  // Wrapper functions for DocumentContainer compatibility
  const handleDownloadForContainer = (doc: unknown) => {
    handleDownload(doc as RiskAnalysisTemplateAnswerAnnotationDocument)
  }

  const handleDeleteForContainer = (doc: unknown) => {
    handleDelete(doc as RiskAnalysisTemplateAnswerAnnotationDocument)
  }

  return (
    <>
      <RHFSwitch
        id={questionId}
        label={t('switchLabel')}
        name={`assignToTemplateUsers.${questionId}`}
        disabled={false}
        sx={{ my: 2, ml: 2 }}
      />
      {!annotation?.text && (
        <ButtonNaked
          color="primary"
          type="button"
          sx={{ fontWeight: 700 }}
          startIcon={<AddIcon fontSize="small" />}
          onClick={handleClick}
        >
          {t('addAnnotationBtn')}
        </ButtonNaked>
      )}

      {annotation?.text && (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: '#FAFAFA',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t('annotationSectionTitle')}
            </Typography>
            <Stack direction="row" spacing={2}>
              <ButtonNaked
                color="primary"
                startIcon={<EditIcon fontSize="small" />}
                onClick={handleClick}
              >
                {t('editAnnotationBtn')}
              </ButtonNaked>
              <ButtonNaked
                color="error"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={handleRemove}
              >
                {t('deleteAnnotationBtn')}
              </ButtonNaked>
            </Stack>
          </Stack>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {annotation.text}
          </Typography>

          {docs.length === 0 &&
            (!showDocInput ? (
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                startIcon={<AddIcon fontSize="small" />}
                onClick={handleAddDocumentClick}
              >
                {t('addDocumentBtn')}
              </Button>
            ) : (
              <FormProvider {...documentUploadForm}>
                <Box
                  component="form"
                  noValidate
                  onSubmit={documentUploadForm.handleSubmit(handleDocumentUpload)}
                  sx={{ mt: 2 }}
                >
                  <RHFSingleFileInput name="doc" rules={{ required: true }} sx={{ my: 2 }} />
                  {documentUploadForm.watch('doc') && (
                    <Stack direction="row" justifyContent="flex-end">
                      <Button type="submit" variant="contained">
                        {t('uploadBtn')}
                      </Button>
                    </Stack>
                  )}
                </Box>
              </FormProvider>
            ))}

          {docs.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Stack spacing={2}>
                {docs.map((doc: RiskAnalysisTemplateAnswerAnnotationDocument) => (
                  <DocumentContainer
                    key={doc.id}
                    doc={{
                      id: doc.id,
                      name: doc.name,
                      prettyName: doc.prettyName,
                      contentType: doc.contentType,
                      checksum: '',
                    }}
                    onDownload={handleDownloadForContainer}
                    onDelete={handleDeleteForContainer}
                    // todo: add onUpdateDescription
                  />
                ))}
              </Stack>

              {!showDocInput && docs.length < 2 ? (
                <Button
                  type="button"
                  variant="text"
                  color="primary"
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={handleAddDocumentClick}
                >
                  {t('addDocumentBtn')}
                </Button>
              ) : showDocInput ? (
                <FormProvider {...documentUploadForm}>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={documentUploadForm.handleSubmit(handleDocumentUpload)}
                    sx={{ mt: 2 }}
                  >
                    <RHFSingleFileInput name="doc" rules={{ required: true }} sx={{ my: 2 }} />
                    {documentUploadForm.watch('doc') && (
                      <Stack direction="row" justifyContent="flex-end">
                        <Button type="submit" variant="contained">
                          {t('uploadBtn')}
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </FormProvider>
              ) : null}
            </Box>
          )}
        </Box>
      )}

      <AddAnnotationDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        onSubmit={handleAnnotationSubmit}
        initialAnnotation={annotation}
      />
    </>
  )
}
