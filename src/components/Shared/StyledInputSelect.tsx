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
  className?: string
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
    <FormControl component="fieldset" sx={{ display: 'block' }}>
      <FormLabel component="legend">{label}</FormLabel>

      <Select value={currentValue} onChange={onChange}>
        {options.map(({ value, label }, i) => (
          <MenuItem key={i} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>

      {/* <Input
        fullWidth
        id={id}
        disabled={readOnly}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        value={value}
        inputProps={inputProps}
      /> */}
    </FormControl>

    // <Form.Group className={className} controlId={id}>
    //   <StyledInputLabel label={label} />
    //   <Form.Select onChange={onChange} disabled={disabled}>
    //     {options.map((option, i) => (
    //       <option key={i} value={option.value}>
    //         {option.label}
    //       </option>
    //     ))}
    //   </Form.Select>
    // </Form.Group>
  )
}
