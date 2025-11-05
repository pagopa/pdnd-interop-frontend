import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import type { RiskAnalysisAnswers, RiskAnalysisQuestions } from '@/types/risk-analysis-form.types'
import type {
  RiskAnalysisTemplateAnswer,
  RiskAnalysisTemplateAnswerAnnotation,
} from '@/api/api.generatedTypes'
import {
  getRiskAnalysisDefaultValues,
  getUpdatedQuestions,
  getValidAnswers,
} from '@/utils/risk-analysis-form.utils'
import { useTransition, useState, useEffect } from 'react'
import type { DefaultValues, FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'

type RiskAnalysisForm<TExtraFields extends FieldValues = {}> = {
  answers: RiskAnalysisAnswers
  annotations?: Record<string, RiskAnalysisTemplateAnswerAnnotation>
  answerIds?: Record<string, string>
  suggestedValues?: Record<string, string[]>
  suggestedValueConsumer?: Record<string, string>
} & TExtraFields

/**
 * Hook for risk analysis forms when editing a purpose from a template as consumer.
 */
export function useRiskAnalysisFormFromTemplate<TExtraFields extends FieldValues = {}>({
  riskAnalysisConfig,
  defaultAnswers,
  extraFields,
}: {
  riskAnalysisConfig: RiskAnalysisFormConfig
  defaultAnswers?: Record<string, RiskAnalysisTemplateAnswer>
  extraFields?: TExtraFields
}) {
  const [_, startTransition] = useTransition()

  // Extract all default values in a single pass
  const {
    transformedDefaultAnswers,
    defaultAnnotations,
    defaultAnswerIds,
    defaultSuggestedValues,
  } = defaultAnswers
    ? Object.entries(defaultAnswers).reduce(
        (acc, [key, answer]) => {
          acc.transformedDefaultAnswers[key] = answer.values
          if (answer.annotation) acc.defaultAnnotations[key] = answer.annotation
          if (answer.id) acc.defaultAnswerIds[key] = answer.id
          if (answer.suggestedValues?.length)
            acc.defaultSuggestedValues[key] = answer.suggestedValues
          return acc
        },
        {
          transformedDefaultAnswers: {} as Record<string, string[]>,
          defaultAnnotations: {} as Record<string, RiskAnalysisTemplateAnswerAnnotation>,
          defaultAnswerIds: {} as Record<string, string>,
          defaultSuggestedValues: {} as Record<string, string[]>,
        }
      )
    : {
        transformedDefaultAnswers: undefined,
        defaultAnnotations: {},
        defaultAnswerIds: {},
        defaultSuggestedValues: {},
      }

  const defaultRiskAnalysisAnswers = getRiskAnalysisDefaultValues(
    riskAnalysisConfig.questions,
    transformedDefaultAnswers
  )

  // Initialize all questions as editable=true, override with backend values
  const defaultEditableFlags = riskAnalysisConfig.questions.reduce<Record<string, boolean>>(
    (acc, question) => {
      acc[question.id] = defaultAnswers?.[question.id]?.editable ?? true
      return acc
    },
    {}
  )

  const formMethods = useForm<
    RiskAnalysisForm<TExtraFields> & { assignToTemplateUsers: Record<string, boolean> }
  >({
    defaultValues: {
      answers: defaultRiskAnalysisAnswers,
      annotations: defaultAnnotations,
      answerIds: defaultAnswerIds,
      suggestedValues: defaultSuggestedValues,
      suggestedValueConsumer: {},
      assignToTemplateUsers: defaultEditableFlags,
      ...extraFields,
    } as DefaultValues<
      RiskAnalysisForm<TExtraFields> & { assignToTemplateUsers: Record<string, boolean> }
    >,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { watch } = formMethods

  const [questions, setQuestions] = useState<RiskAnalysisQuestions>(() =>
    getUpdatedQuestions(defaultRiskAnalysisAnswers, riskAnalysisConfig.questions)
  )

  /**
   * Subscribes to the form values changes
   * and updates the actual visible questions on values change.
   */
  useEffect(() => {
    const subscription = watch(({ answers }) => {
      startTransition(() => {
        setQuestions(
          getUpdatedQuestions(answers as RiskAnalysisAnswers, riskAnalysisConfig.questions)
        )
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, riskAnalysisConfig])

  type SubmitValues = {
    validAnswers: Record<string, Array<string>>
  }

  // In handleSubmit, simplify the logic:
  const handleSubmit = (
    onSubmit: (values: SubmitValues) => void,
    onError?: Parameters<typeof formMethods.handleSubmit>[1]
  ) =>
    formMethods.handleSubmit((values) => {
      const currentQuestionsIds = Object.keys(questions)
      const allValidAnswers = getValidAnswers(currentQuestionsIds, values.answers)

      const filteredAnswers: Record<string, string[]> = {}

      Object.entries(allValidAnswers).forEach(([questionId, answerValues]) => {
        const isEditable = values.assignToTemplateUsers?.[questionId] ?? true
        const suggestedValues = values.suggestedValues?.[questionId] || []
        const selectedSuggestedValue = values.suggestedValueConsumer?.[questionId]

        // FreeText with suggestedValues: always include, use selectedSuggestedValue if available
        if (suggestedValues.length > 0) {
          filteredAnswers[questionId] = selectedSuggestedValue
            ? [selectedSuggestedValue]
            : answerValues
        } else if (isEditable) {
          // Non-freeText: only include if editable
          filteredAnswers[questionId] = answerValues
        }
      })

      onSubmit({ validAnswers: filteredAnswers })
    }, onError)

  return {
    ...formMethods,
    handleSubmit,
    questions,
  }
}
