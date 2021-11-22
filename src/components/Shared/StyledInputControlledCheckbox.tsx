import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

type Option = {
  value: string
  label: string
}

type StyledInputControlledCheckboxProps = {
  label?: string
  options?: Array<Option>
  disabled?: boolean
  infoLabel?: string

  name: string
  defaultValue?: string
  control: Control<FieldValues, Record<string, unknown>>
  rules: Record<string, unknown>
  errors: Record<string, unknown>
  sx?: SxProps
}

export function StyledInputControlledCheckbox({
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
}: StyledInputControlledCheckboxProps) {
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
    </StyledInputWrapper>
  )
}
