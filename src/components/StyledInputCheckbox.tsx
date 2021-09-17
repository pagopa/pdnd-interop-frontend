import React from 'react'
import { Form } from 'react-bootstrap'
import { StyledInputLabel } from './StyledInputLabel'

type StyledInputCheckboxProps = {
  id: string
  label: string
  groupLabel?: string
  checked: boolean
  onChange: any
  inline?: boolean
  readOnly?: boolean
  className?: string
}

export function StyledInputCheckbox({
  groupLabel,
  label,
  id,
  checked,
  onChange,
  inline = false,
  readOnly = false,
  className = 'mt-4 mb-3',
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
        disabled={readOnly}
      />
    )
  }

  return (
    <div className={className}>
      <StyledInputLabel label={groupLabel!} isHTMLLabelElement={false} />
      <Form.Check
        type="checkbox"
        id={id}
        label={label}
        checked={checked}
        onChange={onChange}
        disabled={readOnly}
      />
    </div>
  )
}
