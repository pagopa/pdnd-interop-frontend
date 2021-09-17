import React from 'react'
import { Form } from 'react-bootstrap'
import { StyledInputLabel } from './StyledInputLabel'

export type StyledInputTextType = 'text' | 'email' | 'number'

type StyledInputTextProps = {
  type?: StyledInputTextType
  id: string
  label: string
  placeholder?: string
  readOnly?: boolean
  value?: string | number
  onChange?: any
}

export function StyledInputText({
  type = 'text',
  id,
  label,
  placeholder = 'Lorem ipsum',
  readOnly = false,
  value,
  onChange,
}: StyledInputTextProps) {
  return (
    <div className="mb-3">
      <StyledInputLabel label={label} id={id} />
      <Form.Control
        id={id}
        className="py-3"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  )
}
