import React, { SyntheticEvent } from 'react'
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import { SxProps } from '@mui/system'
import { FormikErrors } from 'formik'
import { StyledInputWrapper } from './StyledInputWrapper'

type Option = {
  label: string
  name: string
}

type StyledInputControlledCheckboxProps = {
  name: string
  setFieldValue(field: string, value: unknown, shouldValidate?: boolean | undefined): void
  value: Record<string, boolean>
  label?: string

  disabled?: boolean
  infoLabel?: string

  sx?: SxProps

  options?: Array<Option>
  errors?: FormikErrors<Record<string, boolean>>
}

export function StyledInputControlledCheckboxFormik({
  label,
  disabled = false,
  infoLabel,

  name,
  setFieldValue,
  value,

  sx,

  options,
  errors,
}: StyledInputControlledCheckboxProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
  }

  const onChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement
    setFieldValue(`${name}.${target.name}`, target.checked, false)
  }

  const error =
    errors && Object.keys(errors).length > 0 ? Object.values(errors).join(', ') : undefined

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup>
        {options.map((o, i) => (
          <FormControlLabel
            disabled={disabled}
            key={i}
            control={<Checkbox checked={value[o.name]} onChange={onChange} name={o.name} />}
            label={o.label}
          />
        ))}
      </FormGroup>
    </StyledInputWrapper>
  )
}
