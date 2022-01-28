import React, { ChangeEventHandler } from 'react'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

type Option = {
  value: string
  label: string
}

type StyledInputControlledRadioProps = {
  name: string
  value?: string
  error?: string
  onChange?: ChangeEventHandler
  label?: string

  disabled?: boolean
  infoLabel?: string

  sx?: SxProps

  options?: Array<Option>
}

export function StyledInputControlledRadioFormik({
  label,
  disabled = false,
  infoLabel,

  name,
  value,
  onChange,
  error,

  sx,

  options,
}: StyledInputControlledRadioProps) {
  if (!options || Boolean(options.length === 0)) {
    return null
  }

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup sx={{ mt: 2 }} value={value} onChange={onChange} name={name}>
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
    </StyledInputWrapper>
  )
}
