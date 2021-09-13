import React from 'react'
import { Form } from 'react-bootstrap'

type Option = {
  value: string
  label: string
}

type StyledInputSelectProps = { id: string; onChange: any; ariaLabel: string; options: Option[] }

export function StyledInputSelect({ id, onChange, options, ariaLabel }: StyledInputSelectProps) {
  return (
    <Form.Select aria-label={ariaLabel} onChange={onChange}>
      {options.map(({ label, value }, i) => (
        <option key={i} value={value}>
          {label}
        </option>
      ))}
    </Form.Select>
  )
}
