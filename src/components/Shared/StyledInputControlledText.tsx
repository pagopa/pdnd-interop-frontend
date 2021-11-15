import React from 'react'
import { Controller } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { InputBaseComponentProps, TextField } from '@mui/material'
import { Box } from '@mui/system'
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
  rules?: any
  errors: any

  inputProps?: InputBaseComponentProps
  type?: StyledInputTextType
  multiline?: boolean
  rows?: number
  focusOnMount?: boolean
  inline?: boolean
}

export function StyledInputControlledText({
  label,
  disabled = false,
  infoLabel,

  name,
  defaultValue = '',
  control,
  rules = {},
  errors,

  inputProps,
  type = 'text',
  multiline = false,
  rows = 6,
  focusOnMount = false,
  inline = false,
}: StyledInputControlledTextProps) {
  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

  return (
    <Box sx={{ my: inline ? 0 : 2 }}>
      <Controller
        shouldUnregister={true}
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <TextField
            autoFocus={focusOnMount}
            multiline={multiline}
            rows={multiline ? rows : 1}
            disabled={disabled}
            sx={{ width: '100%' }}
            variant="standard"
            label={label}
            type={type}
            error={hasFieldError}
            {...field}
            inputProps={inputProps}
          />
        )}
      />

      {hasFieldError && <StyledInputError error={get(errors, name)} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </Box>
  )
}
