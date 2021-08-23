import React from 'react'
import { Form } from 'react-bootstrap'

type StyledInputFileProps = { id: string; onChange: any }

export function StyledInputFile({ id, onChange }: StyledInputFileProps) {
  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Control type="file" onChange={onChange} />
    </Form.Group>
  )
}
