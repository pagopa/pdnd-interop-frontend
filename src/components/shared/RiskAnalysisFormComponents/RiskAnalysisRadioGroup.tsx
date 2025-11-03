import React, { useId } from 'react'
import {
  FormControlLabel,
  Radio,
  RadioGroup as MUIRadioGroup,
  type RadioGroupProps as MUIRadioGroupProps,
} from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'

export type RiskAnalysisRadioGroupProps = Omit<MUIRadioGroupProps, 'onChange'> & {
  questionId: string
  label: string
  infoLabel?: string
  helperText?: string
  disabled?: boolean
  rules?: ControllerProps['rules']
  options: Array<InputOption & { disabled?: boolean }>
  isFromPurposeTemplate?: boolean
  type?: 'creator' | 'consumer'
}

export const RiskAnalysisRadioGroup: React.FC<RiskAnalysisRadioGroupProps> = ({
  questionId,
  label,
  options,
  infoLabel,
  helperText,
  disabled,
  rules,
  isFromPurposeTemplate,
  type,
  ...props
}) => {
  const { control } = useFormContext()

  const isAssignedToTemplateUsersSwitch = useWatch({
    control,
    name: `assignToTemplateUsers.${questionId}`,
  })

  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const { t } = useTranslation()
  const labelId = useId()

  const name = `answers.${questionId}`

  const error = formState.errors.answers?.[questionId]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  const conditionalRules = isAssignedToTemplateUsersSwitch
    ? { required: false }
    : mapValidationErrorMessages(rules, t)

  return (
    <RiskAnalysisInputWrapper
      label={label}
      error={error}
      infoLabel={infoLabel}
      helperText={helperText}
      {...ids}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionId={questionId}
      type={type}
    >
      <Controller
        name={name}
        rules={conditionalRules}
        render={({ field: { onChange, ...fieldProps } }) => (
          <MUIRadioGroup
            {...accessibilityProps}
            {...props}
            {...fieldProps}
            onChange={(_, value) => {
              onChange(value)
            }}
          >
            {options.map((o) => (
              <FormControlLabel
                disabled={disabled || o.disabled || isAssignedToTemplateUsersSwitch}
                key={`${labelId}-${o.value}`}
                value={o.value}
                control={<Radio />}
                label={o.label}
                sx={{ mr: 3 }}
              />
            ))}
          </MUIRadioGroup>
        )}
      />
    </RiskAnalysisInputWrapper>
  )
}
