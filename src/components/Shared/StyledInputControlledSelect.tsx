import React from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Controller } from 'react-hook-form'
import { MenuItem, TextField } from '@mui/material'
import { SelectOption } from '../../../types'
import { StyledInputWrapper } from './StyledInputWrapper'

type StyledInputControlledSelectProps = {
  label?: string
  options?: SelectOption[]
  disabled?: boolean
  infoLabel?: string

  name: string
  defaultValue?: string | number | null
  control: any
  rules: any
  errors: any
  sx?: any
  focusOnMount?: boolean
}

export function StyledInputControlledSelect({
  label,
  options,
  disabled = false,
  infoLabel,

  name,
  defaultValue = null,
  control,
  rules,
  errors,
  sx,
  focusOnMount = false,
}: StyledInputControlledSelectProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
  }

  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

  return (
    <StyledInputWrapper
      name={name}
      errors={errors}
      sx={sx}
      infoLabel={infoLabel}
      hasFieldError={hasFieldError}
    >
      <Controller
        shouldUnregister={true}
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <TextField
            autoFocus={focusOnMount}
            select
            disabled={disabled}
            sx={{ width: '100%' }}
            variant="standard"
            label={label}
            error={hasFieldError}
            {...field}
          >
            {options.map((o, i) => (
              <MenuItem key={i} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </StyledInputWrapper>
  )
}
