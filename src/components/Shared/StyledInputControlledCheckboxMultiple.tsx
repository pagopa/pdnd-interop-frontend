import React, { SyntheticEvent } from 'react'
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import { SxProps } from '@mui/system'
import { StyledInputWrapper } from './StyledInputWrapper'
import { FormikSetFieldValue, InputCheckboxOption } from '../../../types'

export type StyledInputControlledCheckboxMultipleProps = {
  name: string
  setFieldValue: FormikSetFieldValue
  value: Array<string>
  label?: string

  disabled?: boolean
  infoLabel?: string

  sx?: SxProps

  options?: Array<InputCheckboxOption>
  error?: string

  type?: 'checkbox'
}

export function StyledInputControlledCheckboxMultiple({
  label,
  disabled = false,
  infoLabel,

  name,
  setFieldValue,
  value,

  sx,

  options,
  error,
}: StyledInputControlledCheckboxMultipleProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
  }

  const onChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement

    const newValue = value.includes(target.name)
      ? value.filter((v) => v !== target.name)
      : [...value, target.name]

    setFieldValue(name, newValue, false)
  }

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup>
        {options.map((o, i) => (
          <FormControlLabel
            disabled={disabled}
            key={i}
            control={
              <Checkbox checked={value.includes(o.value)} onChange={onChange} name={o.value} />
            }
            label={o.label}
          />
        ))}
      </FormGroup>
    </StyledInputWrapper>
  )
}
