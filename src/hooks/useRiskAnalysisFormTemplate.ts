import type {
  RiskAnalysisFormConfig,
  RiskAnalysisTemplateAnswerSeed,
} from '@/api/api.generatedTypes'
import type { RiskAnalysisAnswers, RiskAnalysisQuestions } from '@/types/risk-analysis-form.types'
import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import {
  getRiskAnalysisDefaultValues,
  getUpdatedQuestionsForTemplate,
  getValidAnswers,
} from '@/utils/risk-analysis-form.utils'
import { useTransition, useState, useEffect } from 'react'
import type { DefaultValues, FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'

type RiskAnalysisForm<TExtraFields extends FieldValues = {}> = {
  answers: RiskAnalysisAnswers
  annotations?: Record<string, RiskAnalysisTemplateAnswerAnnotation>
} & TExtraFields

/**
 * Hook for risk analysis forms that work directly with RiskAnalysisFormTemplateSeed types.
 * This eliminates the need for complex mappings and transformations.
 */
export function useRiskAnalysisFormTemplate<TExtraFields extends FieldValues = {}>({
  riskAnalysisConfig,
  defaultAnswers,
  extraFields,
}: {
  riskAnalysisConfig: RiskAnalysisFormConfig
  defaultAnswers?: Record<string, RiskAnalysisTemplateAnswerSeed>
  extraFields?: TExtraFields
}) {
  const [_, startTransition] = useTransition()

  // Transform the template answers to the format expected by the form components
  const transformedDefaultAnswers = defaultAnswers
    ? Object.fromEntries(
        Object.entries(defaultAnswers).map(([key, answerSeed]) => [key, answerSeed.values])
      )
    : undefined

  const [defaultRiskAnalysisAnswers, __] = useState<RiskAnalysisAnswers>(() =>
    getRiskAnalysisDefaultValues(riskAnalysisConfig.questions, transformedDefaultAnswers)
  )

  // Create default assignToTemplateUsers from the editable flags
  const defaultAssignToTemplateUsers = defaultAnswers
    ? Object.fromEntries(
        Object.entries(defaultAnswers).map(([key, answerSeed]) => [key, answerSeed.editable])
      )
    : {}

  const [questions, setQuestions] = useState<RiskAnalysisQuestions>(() =>
    getUpdatedQuestionsForTemplate(
      defaultRiskAnalysisAnswers,
      riskAnalysisConfig.questions,
      defaultAssignToTemplateUsers
    )
  )

  const formMethods = useForm<
    RiskAnalysisForm<TExtraFields> & { assignToTemplateUsers: Record<string, boolean> }
  >({
    defaultValues: {
      answers: defaultRiskAnalysisAnswers,
      assignToTemplateUsers: defaultAssignToTemplateUsers,
      annotations: {},
      ...extraFields,
    } as DefaultValues<
      RiskAnalysisForm<TExtraFields> & { assignToTemplateUsers: Record<string, boolean> }
    >,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { watch } = formMethods

  /**
   * Subscribes to the form values changes
   * and updates the actual visible questions on values change.
   */
  useEffect(() => {
    const subscription = watch(({ answers, assignToTemplateUsers }) => {
      startTransition(() => {
        setQuestions(
          getUpdatedQuestionsForTemplate(
            answers as RiskAnalysisAnswers,
            riskAnalysisConfig.questions,
            Object.fromEntries(
              Object.entries(assignToTemplateUsers || {}).filter(
                ([_, value]) => value !== undefined
              )
            ) as Record<string, boolean>
          )
        )
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, riskAnalysisConfig])

  type SubmitValues = {
    validAnswers: Record<string, Array<string>>
    assignToTemplateUsers: Record<string, boolean>
  } & RiskAnalysisForm<TExtraFields>

  const handleSubmit = (
    onSubmit: (values: SubmitValues) => void,
    onError?: Parameters<typeof formMethods.handleSubmit>[1]
  ) =>
    formMethods.handleSubmit((values) => {
      const currentQuestionsIds = Object.keys(questions)
      onSubmit({ validAnswers: getValidAnswers(currentQuestionsIds, values.answers), ...values })
    }, onError)

  return {
    ...formMethods,
    handleSubmit,
    questions,
  }
}
