import { createRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { StyledInputLabel } from './StyledInputLabel'

type StyledInputTextAreaProps = {
  value: string
  height?: number
  readOnly?: boolean
  id?: string
  label?: string
  placeholder?: string
  onChange?: any
  onBlur?: any
  className?: string
  autofocusOnFalseReadOnly?: boolean
  readOnlyBgWhite?: boolean
}

export function StyledInputTextArea({
  value,
  readOnly = false,
  height = 120,
  id = 'textarea',
  label,
  placeholder = 'Lorem ipsum',
  onChange,
  onBlur,
  className = 'mt-4 mb-3',
  autofocusOnFalseReadOnly = false,
  readOnlyBgWhite = false,
}: StyledInputTextAreaProps) {
  const inputRef = createRef<HTMLTextAreaElement>()

  useEffect(() => {
    if (!readOnly && inputRef.current && autofocusOnFalseReadOnly) {
      inputRef.current.focus()
    }
  }, [readOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={className}>
      {label && <StyledInputLabel label={label} />}
      <Form.Control
        ref={inputRef}
        id={id}
        className={`border border-light ${readOnly ? 'py-1' : 'pt-4 pb-1'} ${
          readOnlyBgWhite ? 'readonly-white' : ''
        }`}
        style={{ height, resize: 'none', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
        value={value}
        as="textarea"
        placeholder={placeholder}
        readOnly={readOnly}
        plaintext={readOnly}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  )
}
