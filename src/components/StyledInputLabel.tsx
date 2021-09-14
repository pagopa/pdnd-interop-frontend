import React from 'react'
import { Form } from 'react-bootstrap'

type StyledInputLabelProps = {
  label: string
}

export function StyledInputLabel({ label }: StyledInputLabelProps) {
  return <Form.Label className="d-block text-dark fw-bold fs-6 mt-4 mb-2">{label}</Form.Label>
}
