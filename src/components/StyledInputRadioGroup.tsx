import React from 'react'
import { Form } from 'react-bootstrap'
import { SmallLabel } from './SmallLabel'

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
}

export function StyledInputRadioGroup({
  groupLabel,
  options,
  id,
  currentValue,
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
            checked={currentValue === option.value}
            onChange={onChange || option.onChange}
          />
        )
      })}
    </div>
  )
}
