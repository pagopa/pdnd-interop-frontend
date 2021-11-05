import React from 'react'
import { InputBaseComponentProps, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import { InfoTooltip } from './InfoTooltip'
import { StyledInputError } from './StyledInputError'

export type StyledInputTextType = 'text' | 'email' | 'number'

type StyledInputControlledTextProps = {
  label?: string
  disabled?: boolean
  tooltipLabel?: string

  name: string
  defaultValue?: any
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
  defaultValue,
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
            error={errors[name]}
            {...field}
          />
        )}
      />

      {errors && <StyledInputError error={errors[name]} />}
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
    </React.Fragment>
  )
}
