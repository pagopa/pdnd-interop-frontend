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
import { match } from 'ts-pattern'

/**
 * Returns the updated form components.
 *
 * @param questions - the actual updated questions visible to the user
 * @returns Array of components that should be rendered inside the form
 * */
export const RiskAnalysisFormComponents: React.FC<{ questions: RiskAnalysisQuestions }> = ({
  questions,
}) => {
  return Object.entries(questions).map(([questionId, question]) => (
    <QuestionComponent key={questionId} question={question} />
  ))
}

function QuestionComponent({ question }: { question: FormConfigQuestion }) {
  const lang = useCurrentLanguage()
  const answers = useFormContext<{ answers: RiskAnalysisAnswers }>().watch('answers')

  const { t } = useTranslation('shared-components')

  const maxLength = question?.validation?.maxLength

  const inputOptions = getRiskAnalysisInputOptions(question, answers, lang)
  const label = formatRiskAnalysisInputLabel(question, lang, t)
  const infoLabel = formatRiskAnalysisInputInfoLabel(question, lang)

  const helperText = formatRiskAnalysisHerlperText(question, t)

  const sx = { mb: 0 }

  const questionId = `answers.${question.id}`
  const commonProps = {
    name: questionId,
    id: questionId,
    label,
    infoLabel,
    helperText,
    sx,
  }

  return match(question.visualType)
    .with('text', () => (
      <RiskAnalysisTextField
        {...commonProps}
        inputProps={{ maxLength }}
        rules={{ required: true }}
      />
    ))
    .with('select-one', () => (
      <RiskAnalysisSelect
        {...commonProps}
        options={inputOptions}
        emptyLabel={t('riskAnalysis.formComponents.emptyLabel')}
        rules={{ required: true }}
      />
    ))
    .with('checkbox', () => (
      <RiskAnalysisCheckboxGroup
        {...commonProps}
        options={inputOptions}
        rules={{
          validate: (value) =>
            (typeof value !== 'undefined' && value.length > 0) ||
            t('riskAnalysis.formComponents.multiCheckboxField.validation.mixed.required'),
        }}
      />
    ))
    .with('radio', () => (
      <RiskAnalysisRadioGroup {...commonProps} options={inputOptions} rules={{ required: true }} />
    ))
    .with('switch', () => (
      <RiskAnalysisSwitch
        {...commonProps}
        options={inputOptions}
        rules={{
          validate: (value) =>
            value === 'true' ||
            t('riskAnalysis.formComponents.riskAnalysisSwitch.validation.boolean.isValue'),
        }}
      />
    ))
    .otherwise(() => null)
}
