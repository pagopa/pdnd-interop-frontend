import React from 'react'
import { FormControl, FormLabel, MenuItem, Select } from '@mui/material'

type Option = {
  value: string
  label: string
}

type StyledInputSelectProps = {
  id: string
  onChange: any
  label: string
  options: Option[]
  currentValue: any
  disabled?: boolean
}

export function StyledInputSelect({
  id,
  onChange,
  options,
  label,
  currentValue,
  disabled = false,
}: StyledInputSelectProps) {
  return (
    <FormControl component="fieldset" sx={{ display: 'block' }} disabled={disabled} id={id}>
      <FormLabel component="legend">{label}</FormLabel>

      <Select value={currentValue} onChange={onChange}>
        {options.map(({ value, label }, i) => (
          <MenuItem key={i} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
