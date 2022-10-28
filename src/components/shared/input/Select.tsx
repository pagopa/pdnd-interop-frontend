import React, { ChangeEventHandler } from 'react'
import {
  InputBaseComponentProps,
  MenuItem,
  SelectProps as MUISelectProps,
  TextField,
} from '@mui/material'
import { InputWrapper } from './InputWrapper'
import { SxProps } from '@mui/system'
import { InputSelectOption } from '@/types/common.types'

export type SelectProps = {
  name: string
  value?: string
  error?: string
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  label?: string

  disabled?: boolean
  infoLabel?: string | JSX.Element

  inputProps?: InputBaseComponentProps
  selectProps?: MUISelectProps
  focusOnMount?: boolean
  sx?: SxProps

  options?: Array<InputSelectOption>
  emptyLabel: string

  type?: 'select-one'
}

export function Select({
  label,
  disabled = false,
  infoLabel,

  name,
  value,
  onChange,
  error,

  inputProps,
  selectProps,
  focusOnMount = false,
  sx,

  options,
  emptyLabel,
}: SelectProps) {
  if (!options) {
    return null
  }

  const hasFieldError = Boolean(error)

  return (
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
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
        SelectProps={{ SelectDisplayProps: { style: { display: 'block' } }, ...selectProps }}
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
    </InputWrapper>
  )
}
