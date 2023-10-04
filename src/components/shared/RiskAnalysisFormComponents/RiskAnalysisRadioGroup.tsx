import React from 'react'
import {
  FormControlLabel,
  Radio,
  RadioGroup as MUIRadioGroup,
  type RadioGroupProps as MUIRadioGroupProps,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'

export type RiskAnalysisRadioGroupProps = Omit<MUIRadioGroupProps, 'onChange'> & {
  name: string
  label: string
  infoLabel?: string
  helperText?: string
  disabled?: boolean
  rules?: ControllerProps['rules']
  options: Array<InputOption & { disabled?: boolean }>
}

export const RiskAnalysisRadioGroup: React.FC<RiskAnalysisRadioGroupProps> = ({
  name,
  label,
  options,
  infoLabel,
  helperText,
  disabled,
  rules,
  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  return (
    <RiskAnalysisInputWrapper
      label={label}
      error={error}
      infoLabel={infoLabel}
      helperText={helperText}
      {...ids}
    >
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
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
                disabled={disabled || o.disabled}
                key={o.label}
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
