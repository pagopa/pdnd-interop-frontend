import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AddAnnotationFormValues = {
  annotation: RiskAnalysisTemplateAnswerAnnotation
}

type AddAnnotationDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: (annotation: RiskAnalysisTemplateAnswerAnnotation) => void
  initialAnnotation?: RiskAnalysisTemplateAnswerAnnotation
  question: string
}

const defaultInitialAnnotationValues: RiskAnalysisTemplateAnswerAnnotation = {
  id: '',
  text: '',
  docs: [],
}

export const AddAnnotationDrawer: React.FC<AddAnnotationDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialAnnotation,
  question,
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3.drawer' })
  const { t: tCommon } = useTranslation('common')

  const handleCloseDrawer = () => {
    onClose()
  }

  const formMethods = useForm<AddAnnotationFormValues>({
    defaultValues: {
      annotation: initialAnnotation ?? defaultInitialAnnotationValues,
    },
  })

  useEffect(() => {
    if (isOpen) {
      formMethods.reset({ annotation: initialAnnotation ?? defaultInitialAnnotationValues })
    }
  }, [isOpen, initialAnnotation, formMethods])

  const onSubmitAnnotationText = ({ annotation }: AddAnnotationFormValues) => {
    onClose()
    onSubmit(annotation)
  }

  const handleTransitionExited = () => {
    formMethods.reset()
  }

  const subtitle = (
    <Stack spacing={3} sx={{ mt: 2, mb: 0 }}>
      <Typography>{t('description')}</Typography>
      <Typography sx={{ fontWeight: 600 }}>{t('question')}</Typography>
    </Stack>
  )

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        title={t('title')}
        subtitle={subtitle}
        buttonAction={{
          label: tCommon('addBtn'),
          action: formMethods.handleSubmit(onSubmitAnnotationText),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <RHFTextField
          focusOnMount
          label={t('label')}
          size="medium"
          name="annotation.text"
          multiline
          rows={11}
          sx={{ mt: 0 }}
          inputProps={{ maxLength: 250 }}
        />
      </Drawer>
    </FormProvider>
  )
}
