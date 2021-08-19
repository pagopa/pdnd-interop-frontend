import { FormControl } from 'react-bootstrap'

type ReadOnlyTextAreaProps = {
  text: string
  height?: number
}

export function ReadOnlyTextArea({ text, height = 120 }: ReadOnlyTextAreaProps) {
  return (
    <FormControl
      className="border border-light px-2 py-1"
      style={{ height, resize: 'none' }}
      value={text}
      as="textarea"
      aria-label="With textarea"
      readOnly
      plaintext
    />
  )
}
