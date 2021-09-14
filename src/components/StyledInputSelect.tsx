import React from 'react'
import { Form } from 'react-bootstrap'
import { StyledInputLabel } from './StyledInputLabel'

type Option = {
  value?: string
  label: string
}

type StyledInputSelectProps = {
  id: string
  onChange: any
  label: string
  options: Option[]
  disabled?: boolean
}

export function StyledInputSelect({
  id,
  onChange,
  options,
  label,
  disabled = false,
}: StyledInputSelectProps) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <StyledInputLabel label={label} />
      <Form.Select onChange={onChange} disabled={disabled}>
        {options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}
