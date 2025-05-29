import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import type { RiskAnalysisAnswers, RiskAnalysisQuestions } from '@/types/risk-analysis-form.types'
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
} & TExtraFields

export function useRiskAnalysisForm<TExtraFields extends FieldValues = {}>({
  riskAnalysisConfig,
  defaultAnswers,
  extraFields,
}: {
  riskAnalysisConfig: RiskAnalysisFormConfig
  defaultAnswers?: Record<string, string[]>
  extraFields?: TExtraFields
}) {
  const [_, startTransition] = useTransition()
  const [defaultRiskAnalysisAnswers, __] = useState<RiskAnalysisAnswers>(() =>
    getRiskAnalysisDefaultValues(riskAnalysisConfig.questions, defaultAnswers)
  )
  const [questions, setQuestions] = useState<RiskAnalysisQuestions>(() =>
    getUpdatedQuestions(defaultRiskAnalysisAnswers, riskAnalysisConfig.questions)
  )

  const formMethods = useForm<RiskAnalysisForm<TExtraFields>>({
    defaultValues: { answers: defaultRiskAnalysisAnswers, ...extraFields } as DefaultValues<
      RiskAnalysisForm<TExtraFields>
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
