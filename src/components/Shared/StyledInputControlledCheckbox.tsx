import React from 'react'
import { Controller } from 'react-hook-form'
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import { InfoTooltip } from './InfoTooltip'
import { StyledInputError } from './StyledInputError'

type Option = {
  value: string
  label: string
}

type StyledInputControlledCheckboxProps = {
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

export function StyledInputControlledCheckbox({
  label,
  options,
  disabled = false,
  tooltipLabel,

  name,
  defaultValue,
  control,
  rules,
  errors,
}: StyledInputControlledCheckboxProps) {
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
          <React.Fragment>
            {label && <FormLabel component="legend">{label}</FormLabel>}
            <FormGroup {...field}>
              {options.map((o, i) => (
                <FormControlLabel
                  disabled={disabled}
                  key={i}
                  value={o.value}
                  control={<Checkbox />}
                  label={o.label}
                />
              ))}
            </FormGroup>
          </React.Fragment>
        )}
      />

      {errors && <StyledInputError error={errors[name]} />}
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
    </React.Fragment>
  )
}
