import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type {
  Answers,
  Questions,
} from '@/components/shared/RiskAnalysisFormComponents/types/risk-analysis-form.types'
import {
  getRiskAnalysisDefaultValues,
  getUpdatedQuestions,
  getValidAnswers,
} from '@/components/shared/RiskAnalysisFormComponents/utils/risk-analysis-form.utils'
import { RiskAnalysisFormComponents } from '@/components/shared/RiskAnalysisFormComponents'

type RiskAnalysisFormProps = {
  defaultAnswers: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  onSubmit: (answers: Record<string, string[]>) => void
  onCancel: VoidFunction
}

export const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({
  defaultAnswers,
  riskAnalysis,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })

  const [_, startTransition] = React.useTransition()
  const [defaultValues, __] = React.useState<Answers>(() =>
    getRiskAnalysisDefaultValues(riskAnalysis.questions, defaultAnswers)
  )
  const [questions, setQuestions] = React.useState<Questions>(() =>
    getUpdatedQuestions(defaultValues, riskAnalysis.questions)
  )

  const formMethods = useForm<Answers>({
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { watch } = formMethods

  /**
   * Subscribes to the form values changes
   * and updates the actual visible questions on values change.
   */
  React.useEffect(() => {
    const subscription = watch((answers) => {
      startTransition(() => {
        setQuestions(getUpdatedQuestions(answers as Answers, riskAnalysis.questions))
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, riskAnalysis])

  const handleSubmit = formMethods.handleSubmit((answers) => {
    const currentQuestionsIds = Object.keys(questions)
    const validAnswers = getValidAnswers(currentQuestionsIds, answers)

    onSubmit(validAnswers)
  })

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer title={t('step2.title')} description={t('step2.description')}>
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {t('step2.personalInfoAlert')}
          </Alert>
        </SectionContainer>
        <Stack spacing={2}>
          <RiskAnalysisFormComponents questions={questions} />
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
