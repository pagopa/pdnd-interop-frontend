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
  handlesPersonalData?: boolean
}

export const RiskAnalysisFormComponents: React.FC<RiskAnalysisFormComponentsProps> = ({
  questions,
  handlesPersonalData
}) => {
  return Object.entries(questions).map(([questionId, question]) => (
    <RiskAnalysisQuestion key={questionId} question={question} handlesPersonalData={handlesPersonalData} />
  ))
}

function RiskAnalysisQuestion({ question, handlesPersonalData }: { question: FormConfigQuestion, handlesPersonalData?: boolean }) {
  const lang = useCurrentLanguage()
  const answers = useFormContext<{ answers: RiskAnalysisAnswers }>().watch('answers')

  const { t } = useTranslation('shared-components')
  const { t: tPurposeTemplate } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })

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
      />
    ))
    .with('radio', () => {
      const radioRules = {
        required: true,
        validate: (value: string) => {
          // Special validation for usesPersonalData question
          if (questionKey === 'usesPersonalData' && handlesPersonalData !== undefined) {
            const selectedValue = value === 'YES' ? true : false
            if (selectedValue !== handlesPersonalData) {
              return tPurposeTemplate('validation.usesPersonalDataMismatch')
            }
          }
          return true
        },
      }

      return (
        <RiskAnalysisRadioGroup
          {...commonProps}
          questionKey={questionKey}
          options={inputOptions}
          rules={radioRules}
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
      />
    ))
    .otherwise(() => null)
}
