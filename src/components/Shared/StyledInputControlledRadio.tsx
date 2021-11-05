import React from 'react'
import { Controller } from 'react-hook-form'
import { FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup } from '@mui/material'
import { InfoTooltip } from './InfoTooltip'
import { StyledInputError } from './StyledInputError'

type Option = {
  value: string
  label: string
}

type StyledInputControlledRadioProps = {
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

export function StyledInputControlledRadio({
  label,
  options,
  disabled = false,
  tooltipLabel,

  name,
  defaultValue,
  control,
  rules,
  errors,
}: StyledInputControlledRadioProps) {
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
            <RadioGroup {...field}>
              {options.map((o, i) => (
                <FormControlLabel
                  disabled={disabled}
                  key={i}
                  value={o.value}
                  control={<Radio />}
                  label={o.label}
                />
              ))}
            </RadioGroup>
          </React.Fragment>
        )}
      />

      {errors && <StyledInputError error={errors[name]} />}
      {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
    </React.Fragment>
  )
}
