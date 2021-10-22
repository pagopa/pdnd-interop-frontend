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
  className?: string
}

export function StyledInputSelect({
  id,
  onChange,
  options,
  label,
  disabled = false,
  className = 'mt-4 mb-3',
}: StyledInputSelectProps) {
  return (
    <Form.Group className={className} controlId={id}>
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
