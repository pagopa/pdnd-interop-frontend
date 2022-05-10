import React, { ChangeEventHandler } from 'react'
import { InputBaseComponentProps, MenuItem, TextField } from '@mui/material'
import { InputSelectOption } from '../../../types'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

export type StyledInputControlledSelectProps = {
  name: string
  value?: string
  error?: string
  onChange?: ChangeEventHandler
  label?: string

  disabled?: boolean
  infoLabel?: string | JSX.Element

  inputProps?: InputBaseComponentProps
  focusOnMount?: boolean
  sx?: SxProps

  options?: Array<InputSelectOption>
  emptyLabel: string

  type?: 'select-one'
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
  emptyLabel,
}: StyledInputControlledSelectProps) {
  if (!options) {
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
        variant="outlined"
        label={label}
        error={hasFieldError}
        // The display: 'block' below makes text ellipsis work correctly
        // on the clickable div that opens the select menu
        SelectProps={{ SelectDisplayProps: { style: { display: 'block' } } }}
        inputProps={inputProps}
        InputLabelProps={{ shrink: true }}
      >
        {Boolean(options.length > 0) ? (
          options.map((o, i) => (
            <MenuItem key={i} value={o.value}>
              {o.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">{emptyLabel}</MenuItem>
        )}
      </TextField>
    </StyledInputWrapper>
  )
}
