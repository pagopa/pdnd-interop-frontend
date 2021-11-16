import React from 'react'
import { Controller } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { FormControlLabel, Switch } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'

type StyledInputControlledSwitchProps = {
  label?: string
  disabled?: boolean
  infoLabel?: string

  defaultValue?: boolean

  name: string
  control: any
  rules?: any
  errors?: any
  sx?: any
}

export function StyledInputControlledSwitch({
  label,
  disabled = false,
  infoLabel,

  defaultValue = false,

  name,
  control,
  rules,
  errors,
  sx,
}: StyledInputControlledSwitchProps) {
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
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormControlLabel {...field} control={<Switch disabled={disabled} />} label={label} />
        )}
      />
    </StyledInputWrapper>
  )
}
