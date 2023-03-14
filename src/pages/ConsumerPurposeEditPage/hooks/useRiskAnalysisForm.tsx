import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Answers, Questions, RiskAnalysis } from '../types/risk-analysis.types'
import { getFormOperations } from '../utils/form-operations'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import useGetRiskAnalysisFormDefaultValues from './useGetRiskAnalysisFormDefaultValues'
import type { Purpose } from '@/types/purpose.types'
import { PurposeMutations } from '@/api/purpose'

function useRiskAnalysisForm(
  riskAnalysisConfig: RiskAnalysis,
  purpose: Purpose,
  forward: VoidFunction
) {
  const { t } = useTranslation('purpose')
  const currentaLanguage = useCurrentLanguage()
  const { mutate: updatePurpose } = PurposeMutations.useUpdateDraft()

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

  const handleSubmit = formMethods.handleSubmit((answers) => {
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

    updatePurpose(
      {
        purposeId: purpose.id,
        title: purpose.title,
        description: purpose.description,
        riskAnalysisForm: { version: riskAnalysisConfig.version, answers: validAnswers },
      },
      { onSuccess: forward }
    )
  })

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

  return { handleSubmit, formMethods, formComponents, isSubmitBtnDisabled }
}

export default useRiskAnalysisForm
