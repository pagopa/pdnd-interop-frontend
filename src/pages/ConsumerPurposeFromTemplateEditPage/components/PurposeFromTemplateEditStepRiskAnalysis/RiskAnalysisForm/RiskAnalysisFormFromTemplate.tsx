import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Stack } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import type { RiskAnalysisTemplateAnswer } from '@/api/api.generatedTypes'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { RiskAnalysisFormComponents } from '@/components/shared/RiskAnalysisFormComponents'
import { useRiskAnalysisFormFromTemplate } from '@/hooks/useRiskAnalysisFormFromTemplate'

type RiskAnalysisFormFromTemplateProps = {
  defaultAnswers: Record<string, RiskAnalysisTemplateAnswer>
  riskAnalysis: RiskAnalysisFormConfig
  suggestedValueConsumer?: Record<string, string>
  onSubmit: (answers: Record<string, string[]>) => void
  onCancel: VoidFunction
}

export const RiskAnalysisFormFromTemplate: React.FC<RiskAnalysisFormFromTemplateProps> = ({
  defaultAnswers,
  riskAnalysis,
  suggestedValueConsumer,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })

  const riskAnalysisForm = useRiskAnalysisFormFromTemplate({
    riskAnalysisConfig: riskAnalysis,
    defaultAnswers: defaultAnswers,
    extraFields: suggestedValueConsumer ? { suggestedValueConsumer } : undefined,
  })

  const handleSubmit = riskAnalysisForm.handleSubmit(({ validAnswers }) => onSubmit(validAnswers))

  return (
    <FormProvider {...riskAnalysisForm}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer
          title={t('stepRiskAnalysis.title')}
          description={t('stepRiskAnalysis.description')}
        >
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {t('stepRiskAnalysis.personalInfoAlert')}
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

export const RiskAnalysisFormFromTemplateSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
