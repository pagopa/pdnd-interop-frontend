import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type { Purpose, RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { PurposeMutations } from '@/api/purpose'
import type { Answers, Questions } from '../../../types/risk-analysis-form.types'
import {
  getRiskAnalysisDefaultValues,
  getUpdatedQuestions,
  getValidAnswers,
} from '../../../utils/risk-analysis-form.utils'
import { RiskAnalysisFormComponents } from './RiskAnalysisFormComponents'

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

  const [_, startTransition] = React.useTransition()
  const [questions, setQuestions] = React.useState<Questions>(() =>
    getUpdatedQuestions(defaultValues, riskAnalysis.questions)
  )
  const [defaultValues, __] = React.useState<Answers>(() =>
    getRiskAnalysisDefaultValues(riskAnalysis.questions, purpose.riskAnalysisForm?.answers)
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
          <Stack spacing={5}>
            <RiskAnalysisFormComponents questions={questions} />
          </Stack>
        </SectionContainer>
        <StepActions
          back={{ label: t('backWithoutSaveBtn'), type: 'button', onClick: back }}
          forward={{
            label: t('forwardWithSaveBtn'),
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
