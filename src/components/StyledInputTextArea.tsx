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
}

export function StyledInputTextArea({
  value,
  readOnly = false,
  height = 120,
  id = 'textarea',
  label,
  placeholder = 'Lorem ipsum',
  onChange,
}: StyledInputTextAreaProps) {
  return (
    <div className="mb-3">
      {label && <StyledInputLabel label={label} />}
      <Form.Control
        id={id}
        className={`border border-light ${readOnly ? 'py-1' : 'pt-4 pb-1'}`}
        style={{ height, resize: 'none', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
        value={value}
        as="textarea"
        placeholder={placeholder}
        readOnly={readOnly}
        plaintext={readOnly}
        onChange={onChange}
      />
    </div>
  )
}
