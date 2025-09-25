import React from 'react'
import { OutlinedInput, type OutlinedInputProps } from '@mui/material'
import { useFormContext, Controller, useWatch } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types/controller'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'

export type RiskAnalysisTextFieldProps = Omit<OutlinedInputProps, 'type'> & {
  questionId: string
  label: string
  infoLabel?: string
  helperText?: string
  formHelper?: string
  rules?: ControllerProps['rules']
  isFromPurposeTemplate?: boolean
}

export const RiskAnalysisTextField: React.FC<RiskAnalysisTextFieldProps> = ({
  questionId,
  label,
  infoLabel,
  helperText,
  multiline,
  rules,
  isFromPurposeTemplate,
  ...props
}) => {
  const { control } = useFormContext()

  const isAssignedToTemplateUsersSwitch = useWatch({
    control,
    name: `assignToTemplateUsers.${questionId}`,
  })

  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const { t } = useTranslation()

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
      name={name}
      label={label}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      {...ids}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionId={questionId}
    >
      <Controller
        name={name}
        rules={conditionalRules}
        render={({ field: { ref, onChange, ...fieldProps } }) => (
          <OutlinedInput
            {...props}
            inputProps={{ ...props.inputProps, ...accessibilityProps }}
            multiline={multiline}
            rows={multiline ? 6 : undefined}
            error={!!error}
            onChange={(e) => {
              onChange(e)
            }}
            inputRef={ref}
            {...fieldProps}
            disabled={isAssignedToTemplateUsersSwitch}
          />
        )}
      />
    </RiskAnalysisInputWrapper>
  )
}
