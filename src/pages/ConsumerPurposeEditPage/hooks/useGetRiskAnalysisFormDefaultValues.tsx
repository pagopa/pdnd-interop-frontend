import type { Purpose } from '@/api/api.generatedTypes'
import React from 'react'
import type {
  Answers,
  BuildForm,
  GetUpdatedQuestions,
  RiskAnalysis,
} from '../types/risk-analysis.types'

function useGetRiskAnalysisFormDefaultValues(
  riskAnalysisConfig: RiskAnalysis,
  operations: {
    getUpdatedQuestions: GetUpdatedQuestions
    buildForm: BuildForm
  },
  purpose: Purpose
) {
  return React.useMemo(() => {
    let defaultValues: Answers | null

    if (purpose?.riskAnalysisForm) {
      const { answers } = purpose.riskAnalysisForm // answers generated type is any but the real type is { [id: string]: Array<string> }
      const currentAnswersIds = Object.keys(answers)
      // Set them as formik values. This will also trigger the useEffect that
      // depends on formik.values and update the questions accordingly
      defaultValues = currentAnswersIds.reduce((acc, id) => {
        let answer: Array<string> | string | boolean = answers[id] as Array<string>
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
