import React from 'react'
import type { FormConfigQuestion } from '@/api/api.generatedTypes'
import type { Answers, Questions } from '../../../types/risk-analysis-form.types'
import { useFormContext } from 'react-hook-form'
import {
  RHFCheckboxGroup,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from '@/components/shared/react-hook-form-inputs'
import { RiskAnalysisSwitch } from './components/RiskAnalysisSwitch'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import {
  formatRiskAnalysisInputInfoLabel,
  formatRiskAnalysisInputLabel,
  formatRiskAnalysisInputValidationInfoLabel,
  getRiskAnalysisInputOptions,
} from '@/pages/ConsumerPurposeEditPage/utils/risk-analysis-form.utils'
import RiskAnalysisFormSection from './components/RiskAnalysisFormSection'

/**
 * Returns the updated form components.
 *
 * @param questions - the actual updated questions visible to the user
 * @returns Array of components that should be rendered inside the form
 * */
export const RiskAnalysisFormComponents: React.FC<{ questions: Questions }> = ({ questions }) => {
  const { t } = useTranslation('purpose')
  const lang = useCurrentLanguage()
  const answers = useFormContext<Answers>().watch()

  return React.useMemo(() => {
    function buildFormQuestionComponents(question: FormConfigQuestion) {
      const questionComponents: Array<React.ReactNode> = []

      const maxLength = question?.validation?.maxLength

      const inputOptions = getRiskAnalysisInputOptions(question, answers, lang)
      const label = formatRiskAnalysisInputLabel(question, lang, t)
      const infoLabel = formatRiskAnalysisInputInfoLabel(question, lang)

      const validationInfoLabel = formatRiskAnalysisInputValidationInfoLabel(question, t)

      const sx = { mb: 0 }
      const commonProps = {
        key: question.id,
        name: question.id,
        infoLabel: validationInfoLabel,
        sx,
      }

      switch (question.visualType) {
        case 'text':
          questionComponents.push(
            <RiskAnalysisFormSection
              title={label}
              description={infoLabel}
              formFieldName={question.id}
            >
              <RHFTextField
                {...commonProps}
                inputProps={{ maxLength }}
                rules={{ required: true }}
              />
            </RiskAnalysisFormSection>
          )
          break
        case 'select-one':
          questionComponents.push(
            <RiskAnalysisFormSection
              title={label}
              description={infoLabel}
              formFieldName={question.id}
            >
              <RHFSelect
                {...commonProps}
                options={inputOptions}
                emptyLabel={t('edit.step2.emptyLabel')}
                rules={{ required: true }}
              />
            </RiskAnalysisFormSection>
          )
          break
        case 'checkbox':
          questionComponents.push(
            <RiskAnalysisFormSection
              title={label}
              description={infoLabel}
              formFieldName={question.id}
            >
              <RHFCheckboxGroup
                {...commonProps}
                options={inputOptions}
                rules={{
                  validate: (value) =>
                    (typeof value !== 'undefined' && value.length > 0) ||
                    t('edit.step2.multiCheckboxField.validation.mixed.required'),
                }}
              />
            </RiskAnalysisFormSection>
          )
          break
        case 'radio':
          questionComponents.push(
            <RiskAnalysisFormSection
              title={label}
              description={infoLabel}
              formFieldName={question.id}
            >
              <RHFRadioGroup {...commonProps} options={inputOptions} rules={{ required: true }} />
            </RiskAnalysisFormSection>
          )
          break
        case 'switch':
          questionComponents.push(
            <RiskAnalysisFormSection
              title={label}
              description={infoLabel}
              formFieldName={question.id}
            >
              <RiskAnalysisSwitch
                {...commonProps}
                options={inputOptions}
                rules={{
                  validate: (value) =>
                    (typeof value === 'boolean' && value === true) ||
                    t('edit.step2.riskAnalysisSwitch.validation.boolean.isValue'),
                }}
              />
            </RiskAnalysisFormSection>
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
