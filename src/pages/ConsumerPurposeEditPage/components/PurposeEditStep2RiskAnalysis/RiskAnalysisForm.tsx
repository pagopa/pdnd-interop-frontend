import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useRiskAnalysisForm from '../../hooks/useRiskAnalysisForm'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type { Purpose, RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { PurposeMutations } from '@/api/purpose'

type RiskAnalysisFormProps = ActiveStepProps & {
  purpose: Purpose
  riskAnalysis: RiskAnalysisFormConfig
}

export const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({
  back,
  forward,
  purpose,
  riskAnalysis,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { mutate: updatePurpose } = PurposeMutations.useUpdateDraft()

  const { getValidAnswers, formMethods, formComponents, isSubmitBtnDisabled } = useRiskAnalysisForm(
    riskAnalysis,
    purpose
  )

  const handleSubmit = formMethods.handleSubmit((answers) => {
    const validAnswers = getValidAnswers(answers)
    updatePurpose(
      {
        purposeId: purpose.id,
        title: purpose.title,
        description: purpose.description,
        riskAnalysisForm: { version: riskAnalysis.version, answers: validAnswers },
      },
      { onSuccess: forward }
    )
  })

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer>
          <Typography component="h2" variant="h5">
            {t('step2.title')}
          </Typography>
          <Typography color="text.secondary">{t('step2.description')}</Typography>
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {t('step2.personalInfoAlert')}
          </Alert>
          <Stack spacing={5}>{formComponents}</Stack>
        </SectionContainer>
        <StepActions
          back={{ label: t('backWithoutSaveBtn'), type: 'button', onClick: back }}
          forward={{
            label: t('forwardWithSaveBtn'),
            disabled: isSubmitBtnDisabled,
            type: 'submit',
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const RiskAnalysisFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
