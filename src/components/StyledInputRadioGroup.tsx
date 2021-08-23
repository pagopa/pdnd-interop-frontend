import React from 'react'
import { Form } from 'react-bootstrap'
import { SmallLabel } from './SmallLabel'

type Option = {
  label: string
  disabled?: boolean
  onChange?: any
}

type StyledInputRadioGroupProps = {
  groupLabel: string
  options: Option[]
  id: string
  value?: string
  onChange?: any
}

export function StyledInputRadioGroup({
  groupLabel,
  options,
  id,
  value,
  onChange,
}: StyledInputRadioGroupProps) {
  return (
    <div className="mb-3">
      <SmallLabel text={groupLabel} />
      {options.map((option, i) => {
        return (
          <Form.Check
            key={i}
            type="radio"
            id={id}
            disabled={option.disabled}
            name={option.label}
            label={option.label}
            checked={value === option.label}
            onChange={onChange || option.onChange}
          />
        )
      })}
    </div>
  )
}
