import React from 'react'
import { Checkbox, FormControl, FormControlLabel, FormLabel, FormGroup } from '@mui/material'

type StyledInputCheckboxProps = {
  id: string
  label: string
  groupLabel?: string
  checked: boolean
  onChange: any
  inline?: boolean
  readOnly?: boolean
  className?: string
}

export function StyledInputCheckbox({
  groupLabel,
  label,
  checked,
  onChange,
  inline = false,
  readOnly = false,
}: StyledInputCheckboxProps) {
  if (inline) {
    return (
      <FormControlLabel
        sx={{ display: 'block' }}
        checked={checked}
        onChange={onChange}
        disabled={readOnly}
        control={<Checkbox />}
        label={label}
      />
    )
  }

  return (
    <FormControl component="fieldset" sx={{ display: 'block' }}>
      <FormLabel component="legend">{groupLabel}</FormLabel>
      <FormGroup>
        <FormControlLabel
          checked={checked}
          onChange={onChange}
          disabled={readOnly}
          control={<Checkbox />}
          label={label}
        />
      </FormGroup>
    </FormControl>
  )
}
