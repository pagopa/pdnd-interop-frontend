import React from 'react'
import { Form } from 'react-bootstrap'
import { StyledInputLabel } from './StyledInputLabel'

type Option = {
  label: string
  disabled?: boolean
  onChange?: any
  value: string
}

type StyledInputRadioGroupProps = {
  groupLabel: string
  options: Option[]
  id: string
  currentValue?: string
  onChange?: any
  readOnly?: boolean
}

export function StyledInputRadioGroup({
  groupLabel,
  options,
  id,
  currentValue,
  onChange,
  readOnly = false,
}: StyledInputRadioGroupProps) {
  return (
    <div className="mb-3">
      <StyledInputLabel label={groupLabel} isHTMLLabelElement={false} />
      {options.map((option, i) => {
        return (
          <Form.Check
            key={i}
            type="radio"
            disabled={option.disabled || readOnly}
            // This looks weird but it is actually meant.
            // Usually id and name coincide for easy debugging,
            // but here id is needed to associate label to specific option
            name={id}
            id={option.value}
            label={option.label}
            checked={currentValue === option.value}
            onChange={onChange || option.onChange}
          />
        )
      })}
    </div>
  )
}
