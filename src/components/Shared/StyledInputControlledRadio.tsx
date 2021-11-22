import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

type Option = {
  value: string
  label: string
}

type StyledInputControlledRadioProps = {
  label?: string
  options?: Option[]
  disabled?: boolean
  infoLabel?: string

  name: string
  defaultValue?: string
  control: Control<FieldValues, Record<string, unknown>>
  rules: Record<string, unknown>
  errors: Record<string, unknown>
  sx?: SxProps
}

export function StyledInputControlledRadio({
  label,
  options,
  disabled = false,
  infoLabel,

  name,
  defaultValue,
  control,
  rules,
  errors,
  sx,
}: StyledInputControlledRadioProps) {
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
          <React.Fragment>
            {label && <FormLabel component="legend">{label}</FormLabel>}
            <RadioGroup {...field} sx={{ mt: 2 }}>
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
    </StyledInputWrapper>
  )
}
