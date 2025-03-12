import type { RiskAnalysisFormConfig, TenantKind } from '@/api/api.generatedTypes'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, Box, Stack } from '@mui/material'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { RHFRadioGroup, RHFTextField } from '@/components/shared/react-hook-form-inputs'
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

export type CreateStepPurposeRiskAnalysisFormValues = {
  name: string
} & Answers

type CreateStepPurposeRiskAnalysisFormProps = {
  defaultName: string | undefined
  defaultAnswers: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  riskAnalysisPrivate?: RiskAnalysisFormConfig
  kind: 'ESERVICE' | 'ESERVICE_TEMPLATE'
  onSubmit: (name: string, answers: Record<string, string[]>, tenantKind: TenantKind) => void
  onCancel: VoidFunction
}

export const CreateStepPurposeRiskAnalysisForm: React.FC<
  CreateStepPurposeRiskAnalysisFormProps
> = ({
  defaultName,
  defaultAnswers,
  riskAnalysis,
  riskAnalysisPrivate,
  kind,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'create.stepPurpose' })

  const [actualRiskAnalysis, setActualRiskAnalysis] = React.useState(riskAnalysis)

  const [_, startTransition] = React.useTransition()
  const [defaultValues, __] = React.useState<Answers>(() =>
    getRiskAnalysisDefaultValues(actualRiskAnalysis.questions, defaultAnswers)
  )
  const [questions, setQuestions] = React.useState<Questions>(() =>
    getUpdatedQuestions(defaultValues, actualRiskAnalysis.questions)
  )

  const formMethods = useForm<CreateStepPurposeRiskAnalysisFormValues>({
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
        setQuestions(getUpdatedQuestions(answers as Answers, actualRiskAnalysis.questions))
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, actualRiskAnalysis])

  const handleSubmit = formMethods.handleSubmit((values) => {
    const currentQuestionsIds = Object.keys(questions)

    const { name, tenantKind, ...answers } = values
    const validAnswers = getValidAnswers(currentQuestionsIds, answers)

    onSubmit(name, validAnswers, tenantKind as TenantKind)
  })

  const onTenantKindChange = (value: string) => {
    if (value === 'PRIVATE' && riskAnalysisPrivate) {
      setActualRiskAnalysis(riskAnalysisPrivate)
    } else {
      setActualRiskAnalysis(riskAnalysis)
    }
  }

  return (
    <FormProvider {...formMethods}>
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
        {kind === 'ESERVICE_TEMPLATE' && (
          <SectionContainer
            sx={{ mb: 2 }}
            title={t('riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.title')}
            description={t(
              'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.description'
            )}
          >
            <RHFRadioGroup
              name="tenantKind"
              options={[
                {
                  label: t(
                    'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelPA'
                  ),
                  value: 'PA',
                },
                {
                  label: t(
                    'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelNotPA'
                  ),
                  value: 'PRIVATE',
                },
              ]}
              rules={{ required: true }}
              sx={{ mb: 0, mt: 1 }}
              defaultValue={'PA'}
              onValueChange={onTenantKindChange}
            />
          </SectionContainer>
        )}
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
