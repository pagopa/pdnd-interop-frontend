import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'
import type {
  RiskAnalysisTemplateAnswerAnnotation,
  RiskAnalysisTemplateAnswer,
} from '@/api/api.generatedTypes'
import {
  getRiskAnalysisDefaultValues,
  getUpdatedQuestionsForTemplate,
  getValidAnswers,
} from '@/utils/risk-analysis-form.utils'
import { useMemo } from 'react'
import type { DefaultValues, FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'

type RiskAnalysisForm<TExtraFields extends FieldValues = {}> = {
  answers: RiskAnalysisAnswers
  annotations?: Record<string, RiskAnalysisTemplateAnswerAnnotation>
  answerIds?: Record<string, string>
  suggestedValues?: Record<string, string[]>
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
  defaultAnswers?: Record<string, RiskAnalysisTemplateAnswer>
  extraFields?: TExtraFields
}) {
  // Transform the template answers to the format expected by the form components
  const transformedDefaultAnswers = defaultAnswers
    ? Object.fromEntries(
        Object.entries(defaultAnswers).map(([key, answer]) => [key, answer.values])
      )
    : undefined

  const defaultRiskAnalysisAnswers = getRiskAnalysisDefaultValues(
    riskAnalysisConfig.questions,
    transformedDefaultAnswers
  )

  // Create default assignToTemplateUsers from the editable flags
  const defaultAssignToTemplateUsers = defaultAnswers
    ? Object.fromEntries(
        Object.entries(defaultAnswers).map(([key, answer]) => [key, answer.editable])
      )
    : {}

  // Create default annotations from the backend data
  const defaultAnnotations = defaultAnswers
    ? Object.fromEntries(
        Object.entries(defaultAnswers)
          .filter(([_, answer]) => answer.annotation)
          .map(([key, answer]) => [key, answer.annotation!])
      )
    : {}

  // Create default answerIds from the backend data
  const defaultAnswerIds = defaultAnswers
    ? Object.fromEntries(
        Object.entries(defaultAnswers)
          .filter(([_, answer]) => answer.id)
          .map(([key, answer]) => [key, answer.id!])
      )
    : {}

  // Create default suggestedValues from the backend data
  const defaultSuggestedValues = defaultAnswers
    ? Object.fromEntries(
        Object.entries(defaultAnswers)
          .filter(([_, answer]) => answer.suggestedValues && answer.suggestedValues.length > 0)
          .map(([key, answer]) => [key, answer.suggestedValues!])
      )
    : {}

  const formMethods = useForm<
    RiskAnalysisForm<TExtraFields> & { assignToTemplateUsers: Record<string, boolean> }
  >({
    defaultValues: {
      answers: defaultRiskAnalysisAnswers,
      assignToTemplateUsers: defaultAssignToTemplateUsers,
      annotations: defaultAnnotations,
      answerIds: defaultAnswerIds,
      suggestedValues: defaultSuggestedValues,
      ...extraFields,
    } as DefaultValues<
      RiskAnalysisForm<TExtraFields> & { assignToTemplateUsers: Record<string, boolean> }
    >,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { watch } = formMethods

  // Watch all form values to trigger re-computation when they change
  const watchedValues = watch()

  // Use useMemo to compute questions reactively based on form values
  const questions = useMemo(() => {
    return getUpdatedQuestionsForTemplate(
      watchedValues.answers as RiskAnalysisAnswers,
      riskAnalysisConfig.questions,
      Object.fromEntries(
        Object.entries(watchedValues.assignToTemplateUsers || {}).filter(
          ([_, value]) => value !== undefined
        )
      ) as Record<string, boolean>
    )
  }, [watchedValues, riskAnalysisConfig])

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
