import { DecoratedPurpose } from '@/types/purpose.types'
import React from 'react'
import { Answers, BuildForm, GetUpdatedQuestions, RiskAnalysis } from '../types/risk-analysis.types'

function useGetRiskAnalysisFormDefaultValues(
  riskAnalysisConfig: RiskAnalysis,
  operations: {
    getUpdatedQuestions: GetUpdatedQuestions
    buildForm: BuildForm
  },
  purpose: DecoratedPurpose
) {
  return React.useMemo(() => {
    let defaultValues: Answers | null

    if (purpose?.riskAnalysisForm) {
      const { answers } = purpose.riskAnalysisForm
      const currentAnswersIds = Object.keys(answers)
      // Set them as formik values. This will also trigger the useEffect that
      // depends on formik.values and update the questions accordingly
      defaultValues = currentAnswersIds.reduce((acc, id) => {
        let answer: Array<string> | string | boolean = answers[id]
        const question = riskAnalysisConfig.questions.find((question) => question.id === id)
        // Only the checkbox needs the data as Array
        if (answer) {
          if (question?.type !== 'checkbox') {
            answer = answer[0]
          }
          if (question?.type === 'switch') {
            answer = !!answer[0]
          }
        }
        return { ...acc, [id]: answer }
      }, {})
    } else {
      defaultValues = riskAnalysisConfig.questions.reduce(
        (acc, { id, defaultValue }) => ({ ...acc, [id]: defaultValue }),
        {}
      )
    }

    const defaultQuestions = operations.getUpdatedQuestions(defaultValues, riskAnalysisConfig)

    return { defaultValues, defaultQuestions }
  }, [riskAnalysisConfig, operations, purpose])
}

export default useGetRiskAnalysisFormDefaultValues
