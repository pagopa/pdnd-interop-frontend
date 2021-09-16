import React from 'react'
import { Form } from 'react-bootstrap'

type StyledInputLabelProps = {
  label: string
  id?: string
  isHTMLLabelElement?: boolean
}

export function StyledInputLabel({ label, id, isHTMLLabelElement = true }: StyledInputLabelProps) {
  const styleClasses = 'd-block text-dark fw-bold fs-6 mt-4 mb-2'

  if (!isHTMLLabelElement) {
    return <span className={styleClasses}>{label}</span>
  }

  return (
    <Form.Label className={styleClasses} htmlFor={id}>
      {label}
    </Form.Label>
  )
}
