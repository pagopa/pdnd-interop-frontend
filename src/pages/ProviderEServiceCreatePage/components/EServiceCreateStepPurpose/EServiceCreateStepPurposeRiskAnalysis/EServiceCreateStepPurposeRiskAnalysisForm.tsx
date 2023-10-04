import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, Box, Stack } from '@mui/material'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
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

export type EServiceCreateStepPurposeRiskAnalysisFormValues = {
  name: string
} & Answers

type EServiceCreateStepPurposeRiskAnalysisFormProps = {
  defaultName: string | undefined
  defaultAnswers: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  onSubmit: (name: string, answers: Record<string, string[]>) => void
  onCancel: VoidFunction
}

export const EServiceCreateStepPurposeRiskAnalysisForm: React.FC<
  EServiceCreateStepPurposeRiskAnalysisFormProps
> = ({ defaultName, defaultAnswers, riskAnalysis, onSubmit, onCancel }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' }) // TODO stringhe

  const [_, startTransition] = React.useTransition()
  const [defaultValues, __] = React.useState<Answers>(() =>
    getRiskAnalysisDefaultValues(riskAnalysis.questions, defaultAnswers)
  )
  const [questions, setQuestions] = React.useState<Questions>(() =>
    getUpdatedQuestions(defaultValues, riskAnalysis.questions)
  )

  const formMethods = useForm<EServiceCreateStepPurposeRiskAnalysisFormValues>({
    defaultValues: {
      name: defaultName ?? '',
      ...defaultValues,
    },
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

  const handleSubmit = formMethods.handleSubmit((values) => {
    const currentQuestionsIds = Object.keys(questions)

    const { name, ...answers } = values
    const validAnswers = getValidAnswers(currentQuestionsIds, answers)

    onSubmit(name, validAnswers)
  })

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <SectionContainer
          newDesign
          title={'TODO Finalità'}
          description={
            'TODO Indica un caso d’uso per i quali intendi raccogliere dati e compila l’analisi del rischio.'
          }
        >
          <RHFTextField
            name="name"
            label={'TODO Nome della finalità'}
            infoLabel={'TODO Massimo 60 caratteri'}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            rules={{ required: true }}
          />
        </SectionContainer>
        <SectionContainer
          newDesign
          title={'TODO Analisi del rischio'}
          description={
            'TODO Le domande del questionario varieranno in base alle risposte fornite man mano. Modificando la risposta a una domanda precedente, le successive domande potrebbero variare.'
          }
        >
          <Alert sx={{ mt: 2, mb: -1 }} severity="warning">
            {'TODO Attenzione non inserire dati personali all’interno dei campi liberi di testo'}
          </Alert>
        </SectionContainer>
        <Stack spacing={2}>
          <RiskAnalysisFormComponents questions={questions} />
        </Stack>
        <StepActions
          back={{
            label: t('backWithoutSaveBtn') /* TODO */,
            type: 'button',
            onClick: onCancel,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{
            label: t('forwardWithSaveBtn') /* TODO */,
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
