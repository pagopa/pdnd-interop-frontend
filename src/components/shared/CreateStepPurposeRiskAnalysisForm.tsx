import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import React from 'react'
import { FormProvider } from 'react-hook-form'
import { Alert, Box, Stack } from '@mui/material'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { RiskAnalysisFormComponents } from '@/components/shared/RiskAnalysisFormComponents'
import { useRiskAnalysisForm } from '@/hooks/useRiskAnalysisForm'

type CreateStepPurposeRiskAnalysisFormProps = {
  defaultName: string | undefined
  defaultAnswers: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  onSubmit: (name: string, answers: Record<string, string[]>) => void
  onCancel: VoidFunction
}

export const CreateStepPurposeRiskAnalysisForm: React.FC<
  CreateStepPurposeRiskAnalysisFormProps
> = ({ defaultName, defaultAnswers, riskAnalysis, onSubmit, onCancel }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'create.stepPurpose' })

  const riskAnalysisForm = useRiskAnalysisForm({
    riskAnalysisConfig: riskAnalysis,
    defaultAnswers: defaultAnswers,
    extraFields: { name: defaultName ?? '' },
  })

  const handleSubmit = riskAnalysisForm.handleSubmit(({ validAnswers, name }) => {
    onSubmit(name, validAnswers)
  })

  return (
    <FormProvider {...riskAnalysisForm}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer
          title={t('riskAnalysis.riskAnalysisNameSection.title')}
          description={t('riskAnalysis.riskAnalysisNameSection.description')}
        >
          <RHFTextField
            name="name"
            label={t('riskAnalysis.riskAnalysisNameSection.nameField.label')}
            infoLabel={t('riskAnalysis.riskAnalysisNameSection.nameField.infoLabel')}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            rules={{ required: true }}
          />
        </SectionContainer>
        <SectionContainer
          title={t('riskAnalysis.riskAnalysisSection.title')}
          description={t('riskAnalysis.riskAnalysisSection.description')}
        >
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {t('riskAnalysis.riskAnalysisSection.personalDataAlert')}
          </Alert>
        </SectionContainer>
        <Stack spacing={2}>
          <RiskAnalysisFormComponents questions={riskAnalysisForm.questions} />
        </Stack>
        <StepActions
          back={{
            label: t('backWithoutSaveBtn'),
            type: 'button',
            onClick: onCancel,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{
            label: t('forwardWithSaveBtn'),
            type: 'submit',
            startIcon: <SaveIcon />,
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const RiskAnalysisFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
