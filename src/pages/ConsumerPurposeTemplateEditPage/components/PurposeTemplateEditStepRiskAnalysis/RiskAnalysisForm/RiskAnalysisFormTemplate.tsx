import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Stack } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type {
  RiskAnalysisFormConfig,
  RiskAnalysisFormTemplateSeed,
  RiskAnalysisTemplateAnswer,
  RiskAnalysisTemplateAnswerSeed,
} from '@/api/api.generatedTypes'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { RiskAnalysisFormComponents } from '@/components/shared/RiskAnalysisFormComponents'
import { useRiskAnalysisFormTemplate } from '@/hooks/useRiskAnalysisFormTemplate'

type RiskAnalysisFormTemplateProps = {
  defaultAnswers: Record<string, RiskAnalysisTemplateAnswer>
  riskAnalysis: RiskAnalysisFormConfig
  onSubmit: (riskAnalysisFormTemplateSeed: RiskAnalysisFormTemplateSeed) => void
  onCancel: VoidFunction
}

export const RiskAnalysisFormTemplate: React.FC<RiskAnalysisFormTemplateProps> = ({
  defaultAnswers,
  riskAnalysis,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit' })

  const riskAnalysisForm = useRiskAnalysisFormTemplate({
    riskAnalysisConfig: riskAnalysis,
    defaultAnswers: defaultAnswers,
  })

  const handleSubmit = riskAnalysisForm.handleSubmit(
    ({ validAnswers, assignToTemplateUsers, annotations, suggestedValues }) => {
      // Transform the answers to the correct format for RiskAnalysisFormTemplateSeed
      const transformedAnswers: Record<string, RiskAnalysisTemplateAnswerSeed> = {}

      Object.entries(validAnswers).forEach(([key, values]) => {
        // Get the editable value from the assignToTemplateUsers switch for this question
        const editable = assignToTemplateUsers?.[key] ?? false
        const annotationObj = annotations?.[key]
        const questionSuggestedValues = suggestedValues?.[key] || []

        transformedAnswers[key] = {
          // If there are suggested values, this is a freeText question - always send empty array for values
          // Otherwise, use the normal logic (empty if editable, actual values if not editable)
          values: questionSuggestedValues.length > 0 ? [] : editable ? [] : values,
          editable,
          ...(annotationObj?.text ? { annotation: { text: annotationObj.text, docs: [] } } : {}),
          suggestedValues: questionSuggestedValues,
        }
      })

      onSubmit({ version: riskAnalysis.version, answers: transformedAnswers })
    }
  )

  return (
    <FormProvider {...riskAnalysisForm}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer
          title={t('step3.detailsTitle')}
          description={t('step3.detailsDescription')}
        >
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {t('step3.alert')}
          </Alert>
        </SectionContainer>
        <Stack spacing={2}>
          <RiskAnalysisFormComponents
            questions={riskAnalysisForm.questions}
            isFromPurposeTemplate={true}
          />
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

export const RiskAnalysisFormTemplateSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
