import React from 'react'
import { Form } from 'react-bootstrap'
import { SmallLabel } from './SmallLabel'

type StyledInputCheckboxProps = {
  id: string
  label: string
  groupLabel?: string
  checked: boolean
  onChange: any
  inline?: boolean
}

export function StyledInputCheckbox({
  groupLabel,
  label,
  id,
  checked,
  onChange,
  inline = false,
}: StyledInputCheckboxProps) {
  if (inline) {
    return (
      <Form.Check
        className="mt-2"
        onChange={onChange}
        checked={checked}
        type="checkbox"
        id={id}
        label={label}
      />
    )
  }

  return (
    <div className="mb-3">
      <SmallLabel text={groupLabel!} />
      <Form.Check type="checkbox" id={id} label={label} checked={checked} onChange={onChange} />
    </div>
  )
}
