import React from 'react'
import { Controller } from 'react-hook-form'
import { MenuItem, TextField } from '@mui/material'
import { InfoTooltip } from './InfoTooltip'
import { StyledInputError } from './StyledInputError'
import { SelectOption } from '../../../types'
import { isEmpty } from 'lodash'

type StyledInputControlledSelectProps = {
  label?: string
  options?: SelectOption[]
  disabled?: boolean
  tooltipLabel?: string

  name: string
  defaultValue?: string | number | null
  control: any
  rules: any
  errors: any
}

export function StyledInputControlledSelect({
  label,
  options,
  disabled = false,
  tooltipLabel,

  name,
  defaultValue = null,
  control,
  rules,
  errors,
}: StyledInputControlledSelectProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
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
            select
            disabled={disabled}
            sx={{ width: '100%', my: 2 }}
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

      {hasFieldError && <StyledInputError error={errors[name]} />}
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
    </React.Fragment>
  )
}
