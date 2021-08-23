import { FormControl } from 'react-bootstrap'

type StyledInputTextAreaProps = {
  text: string
  height?: number
  readOnly?: boolean
}

export function StyledInputTextArea({
  text,
  readOnly = false,
  height = 120,
}: StyledInputTextAreaProps) {
  return (
    <FormControl
      className="border border-light px-2 py-1"
      style={{ height, resize: 'none' }}
      value={text}
      as="textarea"
      aria-label="With textarea"
      readOnly={readOnly}
      plaintext={readOnly}
    />
  )
}
