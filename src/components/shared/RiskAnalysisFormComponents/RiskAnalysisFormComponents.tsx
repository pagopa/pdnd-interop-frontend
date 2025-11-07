import React from 'react'
import type { FormConfigQuestion } from '@/api/api.generatedTypes'
import {
  type RiskAnalysisAnswers,
  type RiskAnalysisQuestions,
} from '@/types/risk-analysis-form.types'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import {
  formatRiskAnalysisInputLabel,
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
type RiskAnalysisFormComponentsProps = {
  questions: RiskAnalysisQuestions
  isFromPurposeTemplate?: boolean
}

export const RiskAnalysisFormComponents: React.FC<RiskAnalysisFormComponentsProps> = ({
  questions,
  isFromPurposeTemplate,
}) => {
  return Object.entries(questions).map(([questionKey, question]) => (
    <RiskAnalysisQuestion
      key={questionKey}
      questionKey={questionKey}
      question={question}
      isFromPurposeTemplate={isFromPurposeTemplate}
    />
  ))
}

function RiskAnalysisQuestion({
  questionKey,
  question,
  isFromPurposeTemplate,
}: {
  questionKey: string
  question: FormConfigQuestion
  isFromPurposeTemplate?: boolean
}) {
  const lang = useCurrentLanguage()
  const answers = useFormContext<{ answers: RiskAnalysisAnswers }>().watch('answers')

  const { t } = useTranslation('shared-components')

  const maxLength = question?.validation?.maxLength

  const inputOptions = getRiskAnalysisInputOptions(question, answers, lang)
  const label = formatRiskAnalysisInputLabel(question, lang, t)

  const infoLabel = question.infoLabel?.[lang]
  const helperText = question.validation?.maxLength
    ? t('riskAnalysis.formComponents.validation.maxLength', { num: maxLength })
    : undefined

  const commonProps = {
    id: question.id,
    label,
    infoLabel,
    helperText,
    sx: { mb: 0 },
  }

  const { control } = useFormContext()

  const isAssignedToTemplateUsersSwitch = useWatch({
    control,
    name: `assignToTemplateUsers.${questionKey}`,
  })

  return match(question.visualType)
    .with('text', () => (
      <RiskAnalysisTextField
        {...commonProps}
        questionKey={questionKey}
        inputProps={{ maxLength }}
        rules={isAssignedToTemplateUsersSwitch ? { required: false } : { required: true }}
        isFromPurposeTemplate={isFromPurposeTemplate}
        questionType={question.visualType}
      />
    ))
    .with('select-one', () => (
      <RiskAnalysisSelect
        {...commonProps}
        questionKey={questionKey}
        options={inputOptions}
        emptyLabel={t('riskAnalysis.formComponents.emptyLabel')}
        rules={{ required: true }}
        isFromPurposeTemplate={isFromPurposeTemplate}
      />
    ))
    .with('checkbox', () => (
      <RiskAnalysisCheckboxGroup
        {...commonProps}
        questionKey={questionKey}
        options={inputOptions}
        rules={{
          validate: (value) =>
            (typeof value !== 'undefined' && value.length > 0) ||
            t('riskAnalysis.formComponents.multiCheckboxField.validation.mixed.required'),
        }}
        isFromPurposeTemplate={isFromPurposeTemplate}
      />
    ))
    .with('radio', () => {
      return (
        <RiskAnalysisRadioGroup
          {...commonProps}
          questionKey={questionKey}
          options={inputOptions}
          rules={{ required: true }}
          isFromPurposeTemplate={isFromPurposeTemplate}
        />
      )
    })
    .with('switch', () => (
      <RiskAnalysisSwitch
        {...commonProps}
        questionKey={questionKey}
        options={inputOptions}
        rules={{
          validate: (value) =>
            value === 'true' ||
            t('riskAnalysis.formComponents.riskAnalysisSwitch.validation.boolean.isValue'),
        }}
        isFromPurposeTemplate={isFromPurposeTemplate}
      />
    ))
    .otherwise(() => null)
}
