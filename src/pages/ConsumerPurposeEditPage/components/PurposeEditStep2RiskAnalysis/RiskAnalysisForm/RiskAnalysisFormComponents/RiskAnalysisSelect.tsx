import React from 'react'
import { MenuItem, Select as MUISelect, type SelectProps as MUISelectProps } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'

export type RiskAnalysisSelectProps = Omit<MUISelectProps, 'onChange' | 'label'> & {
  name: string
  label: string
  infoLabel?: string
  helperText?: string
  emptyLabel?: string
  options: Array<InputOption>
  rules?: ControllerProps['rules']
}

export const RiskAnalysisSelect: React.FC<RiskAnalysisSelectProps> = ({
  name,
  label,
  options,
  infoLabel,
  helperText,
  emptyLabel,
  rules,
  ...props
}) => {
  const { t } = useTranslation()
  const { formState } = useFormContext()
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
      infoLabel={infoLabel}
      error={error}
      helperText={helperText}
      {...ids}
    >
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { ref, onChange, ...fieldProps } }) => (
          <MUISelect
            {...props}
            {...fieldProps}
            inputProps={{
              ...props.inputProps,
              ...accessibilityProps,
            }}
            onChange={(e) => {
              onChange(e)
            }}
            inputRef={ref}
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
