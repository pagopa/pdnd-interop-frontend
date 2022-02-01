import React, { ChangeEventHandler } from 'react'
import { InputBaseComponentProps, MenuItem, TextField } from '@mui/material'
import { SelectOption } from '../../../types'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

type StyledInputControlledSelectProps = {
  name: string
  value?: string
  error?: string
  onChange?: ChangeEventHandler
  label?: string

  disabled?: boolean
  infoLabel?: string

  inputProps?: InputBaseComponentProps
  focusOnMount?: boolean
  sx?: SxProps

  options?: Array<SelectOption>
}

export function StyledInputControlledSelect({
  label,
  disabled = false,
  infoLabel,

  name,
  value,
  onChange,
  error,

  inputProps,
  focusOnMount = false,
  sx,

  options,
}: StyledInputControlledSelectProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
  }

  const hasFieldError = Boolean(error)

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        id={name}
        autoFocus={focusOnMount}
        select
        disabled={disabled}
        sx={{ width: '100%' }}
        variant="standard"
        label={label}
        error={hasFieldError}
        inputProps={inputProps}
      >
        {options.map((o, i) => (
          <MenuItem key={i} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>
    </StyledInputWrapper>
  )
}
