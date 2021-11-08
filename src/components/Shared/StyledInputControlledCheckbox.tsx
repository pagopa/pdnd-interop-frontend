import React from 'react'
import { Controller } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import { Box } from '@mui/system'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

type Option = {
  value: string
  label: string
}

type StyledInputControlledCheckboxProps = {
  label?: string
  options?: Option[]
  disabled?: boolean
  infoLabel?: string

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
  infoLabel,

  name,
  defaultValue,
  control,
  rules,
  errors,
}: StyledInputControlledCheckboxProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
  }

  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

  return (
    <Box sx={{ my: 2 }}>
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

      {hasFieldError && <StyledInputError error={get(errors, name)} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </Box>
  )
}
