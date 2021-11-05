import React from 'react'
import { Controller } from 'react-hook-form'
import { MenuItem, TextField } from '@mui/material'
import { InfoTooltip } from './InfoTooltip'
import { StyledInputError } from './StyledInputError'

type Option = {
  value: string
  label: string
}

type StyledInputControlledSelectProps = {
  label?: string
  options?: Option[]
  disabled?: boolean
  tooltipLabel?: string

  name: string
  defaultValue?: any
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
  defaultValue,
  control,
  rules,
  errors,
}: StyledInputControlledSelectProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
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
            select
            disabled={disabled}
            sx={{ width: '100%', my: 2 }}
            variant="standard"
            label={label}
            error={errors[name]}
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

      {errors && <StyledInputError error={errors[name]} />}
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
    </React.Fragment>
  )
}
