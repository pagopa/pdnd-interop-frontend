import React from 'react'
import type { FormConfigQuestion } from '@/api/api.generatedTypes'
import type {
  RiskAnalysisAnswers,
  RiskAnalysisQuestions,
} from '../../../types/risk-analysis-form.types'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import {
  formatRiskAnalysisInputInfoLabel,
  formatRiskAnalysisInputLabel,
  formatRiskAnalysisHerlperText,
  getRiskAnalysisInputOptions,
} from '@/utils/risk-analysis-form.utils'
import { RiskAnalysisSwitch } from './RiskAnalysisSwitch'
import { RiskAnalysisSelect } from './RiskAnalysisSelect'
import { RiskAnalysisTextField } from './RiskAnalysisTextField'
import { RiskAnalysisCheckboxGroup } from './RiskAnalysisCheckboxGroup'
import { RiskAnalysisRadioGroup } from './RiskAnalysisRadioGroup'

/**
 * Returns the updated form components.
 *
 * @param questions - the actual updated questions visible to the user
 * @returns Array of components that should be rendered inside the form
 * */
export const RiskAnalysisFormComponents: React.FC<{ questions: RiskAnalysisQuestions }> = ({
  questions,
}) => {
  const { t } = useTranslation('shared-components')
  const lang = useCurrentLanguage()
  const answers = useFormContext<{ answers: RiskAnalysisAnswers }>().watch('answers')

  return React.useMemo(() => {
    function buildFormQuestionComponents(question: FormConfigQuestion) {
      const questionComponents: Array<React.ReactNode> = []

      const maxLength = question?.validation?.maxLength

      const inputOptions = getRiskAnalysisInputOptions(question, answers, lang)
      const label = formatRiskAnalysisInputLabel(question, lang, t)
      const infoLabel = formatRiskAnalysisInputInfoLabel(question, lang)

      const helperText = formatRiskAnalysisHerlperText(question, t)

      const sx = { mb: 0 }

      const questionId = `answers.${question.id}`
      const commonProps = {
        key: questionId,
        name: questionId,
        id: questionId,
        label,
        infoLabel,
        helperText,
        sx,
      }

      switch (question.visualType) {
        case 'text':
          questionComponents.push(
            <RiskAnalysisTextField
              {...commonProps}
              inputProps={{ maxLength }}
              rules={{ required: true }}
            />
          )
          break
        case 'select-one':
          questionComponents.push(
            <RiskAnalysisSelect
              {...commonProps}
              options={inputOptions}
              emptyLabel={t('riskAnalysis.formComponents.emptyLabel')}
              rules={{ required: true }}
            />
          )
          break
        case 'checkbox':
          questionComponents.push(
            <RiskAnalysisCheckboxGroup
              {...commonProps}
              options={inputOptions}
              rules={{
                validate: (value) =>
                  (typeof value !== 'undefined' && value.length > 0) ||
                  t('riskAnalysis.formComponents.multiCheckboxField.validation.mixed.required'),
              }}
            />
          )
          break
        case 'radio':
          questionComponents.push(
            <RiskAnalysisRadioGroup
              {...commonProps}
              options={inputOptions}
              rules={{ required: true }}
            />
          )
          break
        case 'switch':
          questionComponents.push(
            <RiskAnalysisSwitch
              {...commonProps}
              options={inputOptions}
              rules={{
                validate: (value) =>
                  value === 'true' ||
                  t('riskAnalysis.formComponents.riskAnalysisSwitch.validation.boolean.isValue'),
              }}
            />
          )
          break
      }

      return questionComponents
    }

    const formComponents: Array<React.ReactNode> = []
    const questionIds = Object.keys(questions)

    questionIds.forEach((questionId) => {
      const question = questions[questionId]
      formComponents.push(...buildFormQuestionComponents(question))
    })

    return <>{formComponents}</>
  }, [lang, questions, t, answers])
}
