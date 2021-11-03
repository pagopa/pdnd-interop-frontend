import { createRef, useEffect } from 'react'
import { FormControl, FormLabel, Input } from '@mui/material'

type StyledInputTextAreaProps = {
  value: string
  readOnly?: boolean
  id?: string
  label?: string
  placeholder?: string
  onChange?: any
  onBlur?: any
  autofocusOnFalseReadOnly?: boolean
}

export function StyledInputTextArea({
  value,
  readOnly = false,
  id = 'textarea',
  label,
  placeholder = 'Lorem ipsum',
  onChange,
  onBlur,
  autofocusOnFalseReadOnly = false,
}: StyledInputTextAreaProps) {
  const inputRef = createRef<HTMLTextAreaElement>()

  useEffect(() => {
    if (!readOnly && inputRef.current && autofocusOnFalseReadOnly) {
      inputRef.current.focus()
    }
  }, [readOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormControl component="fieldset" sx={{ display: 'block' }}>
      <FormLabel component="legend">{label}</FormLabel>

      <Input
        fullWidth
        id={id}
        disabled={readOnly}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
        inputComponent="textarea"
        multiline={true}
        rows={6}
      />
    </FormControl>
  )
}
