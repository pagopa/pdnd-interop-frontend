import React from 'react'
import type { FormConfigQuestion, LabeledValue } from '@/api/api.generatedTypes'
import type { Answers, Questions } from '../../../types/risk-analysis-form.types'
import type { InputOption } from '@/types/common.types'
import { useFormContext } from 'react-hook-form'
import {
  RHFCheckboxGroup,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from '@/components/shared/react-hook-form-inputs'
import { RiskAnalysisSwitch } from './RiskAnalysisSwitch'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { isDependencySatisfied } from '@/pages/ConsumerPurposeEditPage/utils/risk-analysis-form.utils'

/**
 * Returns the updated form components.
 *
 * @param questions - the actual updated questions visible to the user
 * @returns Array of components that should be rendered inside the form
 * */
export const RiskAnalysisFormComponents: React.FC<{ questions: Questions }> = ({ questions }) => {
  const { t } = useTranslation('purpose')
  const lang = useCurrentLanguage()
  const { setValue, watch } = useFormContext<Answers>()

  const values = watch()

  return React.useMemo(() => {
    function parseOption(
      option: LabeledValue,
      { hideOption, id, defaultValue }: FormConfigQuestion
    ) {
      // if the key "hideOption" is present in the question object and the conditions are satisfied
      // the option will be not added to the array of options
      const shouldHideOption =
        hideOption &&
        hideOption[option.value] &&
        hideOption[option.value].some((dep) => isDependencySatisfied(dep, values))

      if (!shouldHideOption) {
        return { value: option.value, label: option.label[lang] }
      }

      if ((values[id] as string[])?.includes(option.value)) {
        setValue(id, defaultValue)
      }
    }

    function buildFormQuestionComponents(question: FormConfigQuestion, isLast: boolean) {
      const questionComponents: Array<React.ReactNode> = []

      const maxLength = question?.validation?.maxLength
      const isRequired = question.required
      const isMultipleChoice = question.dataType === 'MULTI'
      const inputOptions = (question.options
        ?.map((option) => parseOption(option, question))
        .filter(Boolean) ?? []) as Array<InputOption>

      let label = question.label[lang]
      let infoLabel = question.infoLabel && question.infoLabel[lang]

      if (maxLength) {
        const maxLengthLabel = t('edit.step2.validation.maxLength', { num: maxLength })
        if (infoLabel) {
          infoLabel += `. ${maxLengthLabel}`
        } else {
          infoLabel = maxLengthLabel
        }
      }

      const labelValidation: Array<string> = []

      if (isRequired) {
        labelValidation.push(t('edit.step2.validation.required'))
      }

      if (isMultipleChoice) {
        labelValidation.push(t('edit.step2.validation.multipleChoice'))
      }

      if (labelValidation.length > 0) {
        label += ` (${labelValidation.join(', ')})`
      }

      const sx = isLast ? { mb: 0 } : {}
      const commonProps = { key: question.id, name: question.id, label, infoLabel, sx }

      switch (question.visualType) {
        case 'text':
          questionComponents.push(
            <RHFTextField {...commonProps} inputProps={{ maxLength }} rules={{ required: true }} />
          )
          break
        case 'select-one':
          questionComponents.push(
            <RHFSelect
              {...commonProps}
              options={inputOptions}
              emptyLabel={t('edit.step2.emptyLabel')}
              rules={{ required: true }}
            />
          )
          break
        case 'checkbox':
          questionComponents.push(
            <RHFCheckboxGroup
              {...commonProps}
              options={inputOptions}
              rules={{
                validate: (value) =>
                  (typeof value !== 'undefined' && value.length > 0) ||
                  t('edit.step2.multiCheckboxField.validation.mixed.required'),
              }}
            />
          )
          break
        case 'radio':
          questionComponents.push(
            <RHFRadioGroup {...commonProps} options={inputOptions} rules={{ required: true }} />
          )
          break
        case 'switch':
          questionComponents.push(
            <RiskAnalysisSwitch
              {...commonProps}
              options={inputOptions}
              rules={{
                validate: (value) =>
                  (typeof value === 'boolean' && value === true) ||
                  t('edit.step2.riskAnalysisSwitch.validation.boolean.isValue'),
              }}
            />
          )
          break
      }

      return questionComponents
    }

    const formComponents: Array<React.ReactNode> = []
    const questionIds = Object.keys(questions)

    questionIds.forEach((questionId, i) => {
      const question = questions[questionId]
      formComponents.push(...buildFormQuestionComponents(question, questionIds.length - 1 === i))
    })

    return <>{formComponents}</>
  }, [lang, questions, t, setValue, values])
}
