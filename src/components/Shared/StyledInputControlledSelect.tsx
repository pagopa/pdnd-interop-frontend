import React from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Controller } from 'react-hook-form'
import { MenuItem, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { SelectOption } from '../../../types'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

type StyledInputControlledSelectProps = {
  label?: string
  options?: SelectOption[]
  disabled?: boolean
  infoLabel?: string

  name: string
  defaultValue?: string | number | null
  control: any
  rules: any
  errors: any
  inline?: boolean
  focusOnMount?: boolean
}

export function StyledInputControlledSelect({
  label,
  options,
  disabled = false,
  infoLabel,

  name,
  defaultValue = null,
  control,
  rules,
  errors,
  inline,
  focusOnMount = false,
}: StyledInputControlledSelectProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
  }

  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

  return (
    <Box sx={{ my: inline ? 0 : 2 }}>
      <Controller
        shouldUnregister={true}
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <TextField
            autoFocus={focusOnMount}
            select
            disabled={disabled}
            sx={{ width: '100%' }}
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

      {hasFieldError && <StyledInputError error={get(errors, name)} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </Box>
  )
}
