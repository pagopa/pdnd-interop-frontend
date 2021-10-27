import React from 'react'
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material'

type Option = {
  label: string
  value: string
}

type StyledInputRadioGroupProps = {
  groupLabel: string
  options: Option[]
  currentValue: string
  onChange: any
  name: string
  readOnly?: boolean
}

export function StyledInputRadioGroup({
  groupLabel,
  options,
  currentValue,
  onChange,
  readOnly = false,
  name,
}: StyledInputRadioGroupProps) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{groupLabel}</FormLabel>
      <RadioGroup aria-label={groupLabel} value={currentValue} onChange={onChange} name={name}>
        {options.map(({ label, value }, i) => (
          <FormControlLabel
            key={i}
            value={value}
            control={<Radio />}
            label={label}
            disabled={readOnly}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
