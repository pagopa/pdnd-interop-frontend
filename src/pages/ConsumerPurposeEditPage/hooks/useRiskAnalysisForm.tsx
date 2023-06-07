import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Answers, Questions } from '../types/risk-analysis.types'
import { getFormOperations } from '../utils/form-operations'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import useGetRiskAnalysisFormDefaultValues from './useGetRiskAnalysisFormDefaultValues'
import type { Purpose, RiskAnalysisFormConfig } from '@/api/api.generatedTypes'

function useRiskAnalysisForm(riskAnalysisConfig: RiskAnalysisFormConfig, purpose: Purpose) {
  const { t } = useTranslation('purpose')
  const currentaLanguage = useCurrentLanguage()

  const dynamicFormOperations = React.useMemo(
    () => getFormOperations(riskAnalysisConfig.version),
    [riskAnalysisConfig.version]
  )

  const { defaultValues, defaultQuestions } = useGetRiskAnalysisFormDefaultValues(
    riskAnalysisConfig,
    dynamicFormOperations,
    purpose
  )

  const [questions, setQuestions] = useState<Questions>(defaultQuestions)

  const [_, startTransition] = React.useTransition()

  const formMethods = useForm<Answers>({
    defaultValues: defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })
  const { watch } = formMethods

  const getValidAnswers = (answers: Answers) => {
    const currentQuestions = Object.keys(questions)

    function transformAnswerToArray(answer: unknown) {
      switch (typeof answer) {
        case 'object':
          return answer
        case 'boolean':
          return [new Boolean(answer).toString()]
        case 'string':
          return [answer]
      }
    }

    // Send only answers to currently visible questions
    const validAnswers = Object.keys(answers).reduce(
      (acc, key) =>
        currentQuestions.includes(key)
          ? { ...acc, [key]: transformAnswerToArray(answers[key]) }
          : acc,
      {}
    )

    return validAnswers
  }

  React.useEffect(() => {
    const subscription = watch((values) => {
      startTransition(() => {
        if (!values) return
        const updatedQuestions = dynamicFormOperations.getUpdatedQuestions(
          values,
          riskAnalysisConfig
        )
        setQuestions(updatedQuestions)
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, t, dynamicFormOperations, riskAnalysisConfig])

  const { formComponents, isSubmitBtnDisabled } = dynamicFormOperations.buildForm(
    questions,
    formMethods,
    currentaLanguage,
    t
  )

  return { getValidAnswers, formMethods, formComponents, isSubmitBtnDisabled }
}

export default useRiskAnalysisForm
