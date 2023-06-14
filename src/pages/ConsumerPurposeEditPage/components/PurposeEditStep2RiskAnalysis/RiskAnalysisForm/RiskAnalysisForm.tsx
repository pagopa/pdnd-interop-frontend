import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import type { Answers, Questions } from '../../../types/risk-analysis-form.types'
import {
  getRiskAnalysisDefaultValues,
  getUpdatedQuestions,
  getValidAnswers,
} from '../../../utils/risk-analysis-form.utils'
import { RiskAnalysisFormComponents } from './RiskAnalysisFormComponents'

type RiskAnalysisFormProps = {
  defaultAnswers: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  onSubmit: (answers: Record<string, string[]>) => void
}

export const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({
  defaultAnswers,
  riskAnalysis,
  onSubmit,
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
        <SectionContainer>
          <Typography component="h2" variant="h5">
            {t('step2.title')}
          </Typography>
          <Typography color="text.secondary">{t('step2.description')}</Typography>
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {t('step2.personalInfoAlert')}
          </Alert>
          <Stack spacing={5}>
            <RiskAnalysisFormComponents questions={questions} />
          </Stack>
        </SectionContainer>
      </Box>
    </FormProvider>
  )
}

export const RiskAnalysisFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
