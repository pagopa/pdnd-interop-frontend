import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import riskAnalysis from '@/static/risk-analysis/pa/v2.0.json'
import { Box, Stack, Typography } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useRiskAnalysisForm from '../../hooks/useRiskAnalysisForm'
import { RiskAnalysis } from '../../types/risk-analysis.types'
import { StepActions } from '@/components/shared/StepActions'
import { ActiveStepProps } from '@/hooks/useActiveStep'
import { DecoratedPurpose } from '@/types/purpose.types'

type RiskAnalysisFormProps = ActiveStepProps & {
  purpose: DecoratedPurpose
}

export const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({ back, forward, purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })

  const { handleSubmit, formMethods, formComponents, isSubmitBtnDisabled } = useRiskAnalysisForm(
    riskAnalysis as RiskAnalysis,
    purpose,
    forward
  )

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer>
          <Typography component="h2" variant="h5">
            {t('step2.title')}
          </Typography>
          <Typography color="text.secondary">{t('step2.description')}</Typography>
          <Stack sx={{ mt: 5 }} spacing={5}>
            {formComponents}
          </Stack>
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
