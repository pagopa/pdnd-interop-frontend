import React from 'react'
import { FormLabel } from '@mui/material'

type StyledInputLabelProps = {
  label: string
  id?: string
  isHTMLLabelElement?: boolean
  white?: boolean
}

export function StyledInputLabel({
  label,
  id,
  isHTMLLabelElement = true,
  white = false,
}: StyledInputLabelProps) {
  const styleClasses = `d-block fw-bold fs-6 mb-2 ${white ? 'text-white' : 'text-dark'}`

  if (!isHTMLLabelElement) {
    return <span className={styleClasses}>{label}</span>
  }

  return (
    <FormLabel className={styleClasses} htmlFor={id}>
      {label}
    </FormLabel>
  )
}
