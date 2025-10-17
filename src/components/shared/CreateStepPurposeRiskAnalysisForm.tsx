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
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'

type CreateStepPurposeRiskAnalysisFormProps = {
  defaultName?: string | undefined
  defaultAnswers?: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  personalDataFlag?: boolean | undefined
  onSubmit: (name: string, answers: Record<string, string[]>) => void
  onCancel: VoidFunction
}

export const CreateStepPurposeRiskAnalysisForm: React.FC<
  CreateStepPurposeRiskAnalysisFormProps
> = ({ defaultName, defaultAnswers, riskAnalysis, onSubmit, onCancel, personalDataFlag }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'create.stepPurpose' })

  const riskAnalysisForm = useRiskAnalysisForm({
    riskAnalysisConfig: riskAnalysis,
    defaultAnswers: defaultAnswers,
    extraFields: { name: defaultName ?? '' },
  })

  const [incompatibleAnswerValue, setIncompatibleAnswerValue] = React.useState<boolean>(false)

  const checkIncompatibleAnswerValue = (validAnswers: Record<string, string[]>) => {
    const userAnswer = validAnswers['usesPersonalData']?.[0]
    const isYes = userAnswer === 'YES'
    const isNo = userAnswer === 'NO'

    const incompatible =
      (isYes && personalDataFlag !== true) || (isNo && personalDataFlag !== false)

    setIncompatibleAnswerValue(incompatible)
    return incompatible
  }

  const handleSubmit = riskAnalysisForm.handleSubmit(({ validAnswers, name }) => {
    if (checkIncompatibleAnswerValue(validAnswers)) {
      riskAnalysisForm.setError('answers.usesPersonalData', {
        type: 'manual',
        message: t(
          'riskAnalysis.riskAnalysisSection.personalDataValuesAlert.labelForEserviceCreateStep2'
        ),
      })
      return
    }

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
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA === 'true' && (
            <InformationContainer
              label={t('riskAnalysis.riskAnalysisSection.personalDataFlag.label')}
              content={t(`riskAnalysis.riskAnalysisSection.personalDataFlag.${personalDataFlag}`)}
            />
          )}
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {t('riskAnalysis.riskAnalysisSection.personalDataAlert')}
          </Alert>
        </SectionContainer>
        <Stack spacing={2}>
          <RiskAnalysisFormComponents questions={riskAnalysisForm.questions} />
        </Stack>
        {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && incompatibleAnswerValue && (
          <Alert sx={{ mt: 2 }} severity="warning">
            {t(
              'riskAnalysis.riskAnalysisSection.personalDataValuesAlert.alertForIncompatibleAnswer'
            )}
          </Alert>
        )}
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
