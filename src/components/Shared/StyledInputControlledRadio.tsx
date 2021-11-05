import React from 'react'
import { Controller } from 'react-hook-form'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { Box } from '@mui/system'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

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
  defaultValue?: any
  control: any
  rules: any
  errors: any
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
}: StyledInputControlledRadioProps) {
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

      {hasFieldError && <StyledInputError error={get(errors, name)} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </Box>
  )
}
