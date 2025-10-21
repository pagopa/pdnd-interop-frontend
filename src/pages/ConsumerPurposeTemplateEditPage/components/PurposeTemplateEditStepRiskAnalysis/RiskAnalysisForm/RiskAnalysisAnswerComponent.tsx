import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Stack, Typography, Button } from '@mui/material'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AddAnnotationDrawer } from '@/components/shared/AddAnnotationDrawer'
import { useFormContext } from 'react-hook-form'
import type {
  RiskAnalysisTemplateAnswerAnnotation,
  RiskAnalysisTemplateAnswerRequest,
} from '@/api/api.generatedTypes'
import { PurposeTemplateServices } from '@/api/purposeTemplate/purposeTemplate.services'
import { useParams } from '@/router'

export const RiskAnalysisAnswerComponent: React.FC<{ questionId: string; question: string }> = ({
  questionId,
  question,
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const { setValue, watch } = useFormContext()
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
      } else {
        // Create new annotation using POST API
        const answerRequest: RiskAnalysisTemplateAnswerRequest = {
          answerKey: questionId,
          answerData: {
            values: questionValues,
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
      }
    } catch (error) {
      console.error('Error saving annotation:', error)
      // Fallback: save locally anyway
      setValue(`annotations.${questionId}`, annotation, { shouldDirty: true })
    }
  }

  const handleRemove = async () => {
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
          <Button variant="contained" sx={{ mt: 2 }} startIcon={<AddIcon fontSize="small" />}>
            {t('addDocumentBtn')}
          </Button>
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
