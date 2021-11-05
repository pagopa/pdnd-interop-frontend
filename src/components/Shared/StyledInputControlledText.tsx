import React from 'react'
import { Controller } from 'react-hook-form'
import isEmpty from 'lodash/isEmpty'
import { InputBaseComponentProps, TextField } from '@mui/material'
import { InfoTooltip } from './InfoTooltip'
import { StyledInputError } from './StyledInputError'

export type StyledInputTextType = 'text' | 'email' | 'number'

type StyledInputControlledTextProps = {
  label?: string
  disabled?: boolean
  tooltipLabel?: string

  name: string
  defaultValue?: string
  control: any
  rules: any
  errors: any

  inputProps?: InputBaseComponentProps
  readOnly?: boolean
  type?: StyledInputTextType
  multiline?: boolean
}

export function StyledInputControlledText({
  label,
  disabled = false,
  tooltipLabel,

  name,
  defaultValue = '',
  control,
  rules,
  errors,

  inputProps,
  readOnly = false,
  type = 'text',
  multiline = false,
}: StyledInputControlledTextProps) {
  if (readOnly) {
    return (
      <TextField
        multiline={multiline}
        rows={multiline ? 6 : 1}
        disabled={true}
        sx={{ width: '100%', my: 2 }}
        variant="standard"
        label={label}
        type={type}
        defaultValue={defaultValue}
      />
    )
  }

  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(errors[name]))

  return (
    <React.Fragment>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <TextField
            multiline={multiline}
            rows={multiline ? 6 : 1}
            disabled={disabled}
            sx={{ width: '100%', my: 2 }}
            variant="standard"
            label={label}
            type={type}
            error={hasFieldError}
            {...field}
          />
        )}
      />

      {hasFieldError && <StyledInputError error={errors[name]} />}
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
    </React.Fragment>
  )
}
