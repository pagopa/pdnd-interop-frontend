import React from 'react'
import { Form } from 'react-bootstrap'

type StyledInputLabelProps = {
  label: string
  id?: string
  isHTMLLabelElement?: boolean
  white?: boolean
}

export function StyledInputLabel({
  label,
  id,
  isHTMLLabelElement = true,
  white = false,
}: StyledInputLabelProps) {
  const styleClasses = `d-block fw-bold fs-6 mb-2 ${white ? 'text-white' : 'text-dark'}`

  if (!isHTMLLabelElement) {
    return <span className={styleClasses}>{label}</span>
  }

  return (
    <Form.Label className={styleClasses} htmlFor={id}>
      {label}
    </Form.Label>
  )
}
