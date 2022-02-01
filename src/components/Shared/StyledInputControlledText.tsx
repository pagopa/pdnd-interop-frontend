import React, { ChangeEventHandler } from 'react'
import { InputBaseComponentProps, TextField } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

export type StyledInputTextType = 'text' | 'email' | 'number'

type StyledInputControlledTextProps =
  | {
      name: string
      error?: string
      onChange?: ChangeEventHandler
      label?: string

      disabled?: boolean
      infoLabel?: string

      inputProps?: InputBaseComponentProps
      multiline?: boolean
      rows?: number
      focusOnMount?: boolean
      sx?: SxProps
    } & (
      | {
          type?: 'text' | 'email'
          value?: string
        }
      | {
          type?: 'number'
          value?: number
        }
    )

export function StyledInputControlledText({
  label,
  disabled = false,
  infoLabel,

  name,
  value,
  onChange,
  error,

  inputProps,
  type = 'text',
  multiline = false,
  rows = 6,
  focusOnMount = false,
  sx,
}: StyledInputControlledTextProps) {
  const hasFieldError = Boolean(error)

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        id={name} // used to generate the a11y htmlFor in label and id in input
        autoFocus={focusOnMount}
        multiline={multiline}
        rows={multiline ? rows : 1}
        disabled={disabled}
        sx={{ width: '100%' }}
        variant="standard"
        label={label}
        type={type}
        error={hasFieldError}
        inputProps={inputProps}
      />
    </StyledInputWrapper>
  )
}
