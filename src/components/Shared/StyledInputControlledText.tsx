import React from 'react'
import { Controller } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { InputBaseComponentProps, TextField } from '@mui/material'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

export type StyledInputTextType = 'text' | 'email' | 'number'

type StyledInputControlledTextProps = {
  label?: string
  disabled?: boolean
  infoLabel?: string

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
  infoLabel,

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

  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

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

      {hasFieldError && <StyledInputError error={get(errors, name)} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </React.Fragment>
  )
}
