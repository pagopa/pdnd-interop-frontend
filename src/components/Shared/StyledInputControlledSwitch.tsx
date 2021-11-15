import React from 'react'
import { Controller } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { FormControlLabel, Switch } from '@mui/material'
import { Box } from '@mui/system'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

type StyledInputControlledSwitchProps = {
  label?: string
  disabled?: boolean
  infoLabel?: string

  defaultValue?: boolean

  name: string
  control: any
  rules?: any
  errors?: any
  inline?: boolean
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
  inline = false,
}: StyledInputControlledSwitchProps) {
  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

  return (
    <Box sx={{ my: inline ? 0 : 2 }}>
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

      {hasFieldError && <StyledInputError error={get(errors, name)} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </Box>
  )
}
