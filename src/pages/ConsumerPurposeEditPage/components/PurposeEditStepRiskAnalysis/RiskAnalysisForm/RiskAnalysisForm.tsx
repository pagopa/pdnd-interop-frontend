import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Stack } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { RiskAnalysisFormComponents } from '@/components/shared/RiskAnalysisFormComponents'
import { useRiskAnalysisForm } from '@/hooks/useRiskAnalysisForm'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'

type RiskAnalysisFormProps = {
  defaultAnswers: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  onSubmit: (answers: Record<string, string[]>) => void
  onCancel: VoidFunction
  personalData?: boolean
  from?: 'purposeEdit' | 'eserviceEdit'
}

export const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({
  defaultAnswers,
  riskAnalysis,
  onSubmit,
  onCancel,
  personalData,
  from,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })

  const riskAnalysisForm = useRiskAnalysisForm({
    riskAnalysisConfig: riskAnalysis,
    defaultAnswers: defaultAnswers,
  })

  const [incompatibleAnswerValue, setIncompatibleAnswerValue] = React.useState<boolean>(false)

  const checkIncompatibleAnswerValue = (answers: Record<string, string[]>) => {
    if (personalData === undefined) {
      return false
    }
    const userAnswer = answers['usesPersonalData']?.[0]
    const isYes = userAnswer === 'YES'
    const isNo = userAnswer === 'NO'

    const incompatible = (isYes && personalData !== true) || (isNo && personalData !== false)

    return incompatible
  }

  const errorToShow =
    from === 'purposeEdit'
      ? !personalData
        ? t('stepRiskAnalysis.personalDataFlag.incompatibleAnswerError.purposeEdit.personalData')
        : t('stepRiskAnalysis.personalDataFlag.incompatibleAnswerError.purposeEdit.noPersonalData')
      : t('stepRiskAnalysis.personalDataFlag.incompatibleAnswerError.eserviceEdit')

  const handleSubmit = riskAnalysisForm.handleSubmit(({ validAnswers }) => {
    if (checkIncompatibleAnswerValue(validAnswers)) {
      setIncompatibleAnswerValue(true)
      riskAnalysisForm.setError('answers.usesPersonalData', {
        type: 'manual',
        message: errorToShow,
      })
      return
    }

    onSubmit(validAnswers)
  })

  return (
    <FormProvider {...riskAnalysisForm}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer
          title={t('stepRiskAnalysis.title')}
          description={t('stepRiskAnalysis.description')}
          sx={{ mb: 2 }}
        >
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && (
            <InformationContainer
              label={t('stepRiskAnalysis.personalDataFlag.label')}
              content={t(`stepRiskAnalysis.personalDataFlag.content.${personalData}`)}
            />
          )}
        </SectionContainer>
        <Stack spacing={2}>
          <Alert sx={{ mt: 4, mb: 2 }} severity="warning">
            {t('stepRiskAnalysis.personalInfoAlert')}
          </Alert>
          <RiskAnalysisFormComponents questions={riskAnalysisForm.questions} />
        </Stack>
        {incompatibleAnswerValue && (
          <Alert sx={{ mt: 2 }} severity="warning">
            {!personalData
              ? t(
                  'stepRiskAnalysis.personalDataFlag.alertForIncompatibleAnswerPurpose.personalData'
                )
              : t(
                  'stepRiskAnalysis.personalDataFlag.alertForIncompatibleAnswerPurpose.noPersonalData'
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
            label: t('endWithSaveBtn'),
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
