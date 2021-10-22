import React from 'react'
import { Form } from 'react-bootstrap'
import { InfoTooltip } from '../InfoTooltip'
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
  className?: string
  tooltipLabel?: string
  min?: number | string | undefined
  white?: boolean
}

export function StyledInputText({
  type = 'text',
  id,
  label,
  placeholder = 'Lorem ipsum',
  readOnly = false,
  value,
  onChange,
  className = 'mt-4 mb-3',
  tooltipLabel,
  min,
  white,
}: StyledInputTextProps) {
  return (
    <div className={className}>
      <div className="d-flex align-contents-center">
        <StyledInputLabel label={label} id={id} white={white} />{' '}
        {tooltipLabel && <InfoTooltip className="ms-2" label={tooltipLabel} />}
      </div>

      <Form.Control
        id={id}
        className="py-3"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        min={min}
      />
    </div>
  )
}
