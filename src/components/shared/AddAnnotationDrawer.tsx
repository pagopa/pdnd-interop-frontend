import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/purposeTemplate/mockedResponses'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AddAnnotationFormValues = {
  annotation: RiskAnalysisTemplateAnswerAnnotation
}

type AddAnnotationDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: (annotation: RiskAnalysisTemplateAnswerAnnotation) => void
}

export const AddAnnotationDrawer: React.FC<AddAnnotationDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3.drawer' })
  const { t: tCommon } = useTranslation('common')

  const handleCloseDrawer = () => {
    onClose()
  }

  const formMethods = useForm<AddAnnotationFormValues>({
    defaultValues: {
      annotation: undefined,
    },
  })

  const _onSubmit = ({ annotation }: AddAnnotationFormValues) => {
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
          action: formMethods.handleSubmit(_onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <RHFTextField
          focusOnMount
          label={t('label')}
          size="medium"
          name="annotation"
          multiline
          rows={11}
          sx={{ mt: 0 }}
        />
      </Drawer>
    </FormProvider>
  )
}
