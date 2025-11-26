import React from 'react'
import { MenuItem, Select as MUISelect, type SelectProps as MUISelectProps } from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'
import { isRiskAnalysisQuestionDisabled } from '@/utils/common.utils'
import { usePurposeCreateContext } from '../PurposeCreateContext'

export type RiskAnalysisSelectProps = Omit<MUISelectProps, 'onChange' | 'label'> & {
  questionKey: string
  label: string
  infoLabel?: string
  helperText?: string
  emptyLabel?: string
  options: Array<InputOption>
  rules?: ControllerProps['rules']
}

export const RiskAnalysisSelect: React.FC<RiskAnalysisSelectProps> = ({
  questionKey,
  label,
  options,
  infoLabel,
  helperText,
  emptyLabel,
  rules,
  ...props
}) => {
  const { control } = useFormContext()
  const { isFromPurposeTemplate, type } = usePurposeCreateContext()

  const isAssignedToTemplateUsersSwitch = useWatch({
    control,
    name: `assignToTemplateUsers.${questionKey}`,
  })

  const { t } = useTranslation()
  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()

  const name = `answers.${questionKey}`

  const error = formState.errors.answers?.[questionKey]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  const conditionalRules =
    isAssignedToTemplateUsersSwitch && type === 'creator'
      ? { required: false }
      : mapValidationErrorMessages(rules, t)

  return (
    <RiskAnalysisInputWrapper
      label={label}
      infoLabel={infoLabel}
      error={error}
      helperText={helperText}
      {...ids}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionKey={questionKey}
      type={type}
      isAssignedToTemplateUsersSwitch={isAssignedToTemplateUsersSwitch}
    >
      <Controller
        name={name}
        rules={conditionalRules}
        render={({ field: { ref, onChange, value, ...fieldProps } }) => (
          <MUISelect
            {...props}
            {...fieldProps}
            value={value ?? ''}
            inputProps={{
              ...props.inputProps,
              ...accessibilityProps,
            }}
            onChange={(e) => {
              onChange(e)
            }}
            inputRef={ref}
            disabled={isRiskAnalysisQuestionDisabled(
              isFromPurposeTemplate,
              type,
              isAssignedToTemplateUsersSwitch
            )}
          >
            {options.length > 0 ? (
              options.map((o, i) => (
                <MenuItem key={i} value={o.value}>
                  {o.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">{emptyLabel ?? ''}</MenuItem>
            )}
          </MUISelect>
        )}
      />
    </RiskAnalysisInputWrapper>
  )
}
