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
import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'

export const RiskAnalysisAnswerComponent: React.FC<{ questionId: string }> = ({ questionId }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const { setValue, watch } = useFormContext()
  const annotation: RiskAnalysisTemplateAnswerAnnotation | undefined = watch(
    `annotations.${questionId}`
  )

  const handleClick = () => {
    openDrawer()
  }

  const handleAnnotationSubmit = (annotation: RiskAnalysisTemplateAnswerAnnotation) => {
    setValue(`annotations.${questionId}`, annotation, { shouldDirty: true })
  }

  const handleRemove = () => {
    setValue(`annotations.${questionId}`, undefined, { shouldDirty: true })
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
      />
    </>
  )
}
