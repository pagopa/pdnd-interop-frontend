import { RHFSwitch, RHFSingleFileInput } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import UploadFileIcon from '@mui/icons-material/UploadFile'
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
  EServiceDoc,
} from '@/api/api.generatedTypes'
import { PurposeTemplateServices } from '@/api/purposeTemplate/purposeTemplate.services'
import { useParams } from '@/router'

// Document Upload Form Component
const DocumentUploadForm: React.FC<{
  documentFormMethods: ReturnType<typeof useForm<{ doc: File | null }>>
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  onSubmit: (data: { doc: File | null }) => Promise<void>
  t: (key: string) => string
}> = ({ documentFormMethods, selectedFile, onFileChange, onSubmit, t }) => (
  <FormProvider {...documentFormMethods}>
    <Box
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        documentFormMethods.handleSubmit(onSubmit)(e)
      }}
      sx={{ mt: 2, px: 2, py: 2 }}
      bgcolor="common.white"
    >
      <RHFSingleFileInput
        sx={{ my: 0 }}
        name="doc"
        rules={{ required: true }}
        onValueChange={onFileChange}
      />

      {selectedFile && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              documentFormMethods.handleSubmit(onSubmit)()
            }}
          >
            <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> {t('uploadBtn') as string}
          </Button>
        </Stack>
      )}
    </Box>
  </FormProvider>
)

export const RiskAnalysisAnswerComponent: React.FC<{
  questionId: string
  question: string
  questionType: string
}> = ({ questionId, questionType, question }) => {
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
  const suggestedValues: string[] = watch(`suggestedValues.${questionId}`) || []

  // Document management states
  const [showDocInput, setShowDocInput] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Form for document upload
  const documentFormMethods = useForm<{ doc: File | null }>({
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
            },
            suggestedValues: suggestedValues,
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
          // Clear the upload input field
          setValue(`__annotationUpload.${questionId}`, null, { shouldDirty: true })
          // Reset the document input state
          setShowDocInput(false)

          // Show success notification
          showToast(t('notifications.annotationDeletedSuccess'), 'success')
        } catch (error) {
          console.error('Error deleting annotation:', error)
          // Show error notification
          showToast(t('notifications.annotationDeleteError'), 'error')
        }
      },
    })
  }

  // Document management functions
  const handleAddDocumentClick = () => {
    // Check if we've reached the limit of 2 documents
    if (docs.length >= 2) {
      showToast(t('notifications.documentUploadError'), 'error')
      return
    }
    setShowDocInput(true)
    setSelectedFile(null)
  }

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
  }

  const handleDocumentSubmit = async ({ doc }: { doc: File | null }) => {
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

      // Reset document form and hide input
      documentFormMethods.reset()
      setShowDocInput(false)
      setSelectedFile(null)

      // Show success notification
      showToast(t('notifications.documentUploadedSuccess'), 'success')
    } catch (error) {
      console.error('Error uploading document:', error)
      // Show error notification
      showToast(t('notifications.documentUploadError'), 'error')
    }
  }

  const handleDocumentDownload = async (doc: EServiceDoc) => {
    try {
      const existingAnswerId = watch(`answerIds.${questionId}`)

      if (!existingAnswerId) {
        showToast(t('notifications.documentDownloadError'), 'error')
        return
      }

      const blob = await PurposeTemplateServices.downloadDocumentFromAnnotation({
        purposeTemplateId,
        answerId: existingAnswerId,
        documentId: doc.id,
      })

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = doc.prettyName || doc.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      showToast(t('notifications.documentDownloadedSuccess'), 'success')
    } catch (error) {
      console.error('Error downloading document:', error)
      showToast(t('notifications.documentDownloadError'), 'error')
    }
  }

  const handleDelete = async (doc: EServiceDoc) => {
    try {
      const existingAnswerId = watch(`answerIds.${questionId}`)

      if (existingAnswerId) {
        // Delete document from backend
        await PurposeTemplateServices.deleteDocumentFromAnnotation({
          purposeTemplateId,
          answerId: existingAnswerId,
          documentId: doc.id,
        })
      }

      // Update form by removing the document
      const currentDocs =
        (watch(
          `annotations.${questionId}.docs`
        ) as RiskAnalysisTemplateAnswerAnnotationDocument[]) ?? []
      setValue(
        `annotations.${questionId}.docs`,
        currentDocs.filter((d) => d.id !== doc.id),
        { shouldDirty: true }
      )

      // Show success notification
      showToast(t('notifications.documentDeletedSuccess'), 'success')
    } catch (error) {
      console.error('Error deleting document:', error)
      showToast(t('notifications.documentDeleteError'), 'error')
    }
  }

  return (
    <>
      {questionType !== 'text' && (
        <RHFSwitch
          id={questionId}
          label={t('switchLabel')}
          name={`assignToTemplateUsers.${questionId}`}
          disabled={false}
          sx={{ my: 2, ml: 2 }}
        />
      )}
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
              <DocumentUploadForm
                documentFormMethods={documentFormMethods}
                selectedFile={selectedFile}
                onFileChange={handleFileChange}
                onSubmit={handleDocumentSubmit}
                t={t as (key: string) => string}
              />
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
                    onDownload={handleDocumentDownload}
                    onDelete={handleDelete}
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
                <DocumentUploadForm
                  documentFormMethods={documentFormMethods}
                  selectedFile={selectedFile}
                  onFileChange={handleFileChange}
                  onSubmit={handleDocumentSubmit}
                  t={t as (key: string) => string}
                />
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
        question={question}
      />
    </>
  )
}
