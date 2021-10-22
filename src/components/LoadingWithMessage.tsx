import React from 'react'
import { StyledSpinner } from './Shared/StyledSpinner'

type LoadingWithMessageProps = {
  label?: string
}

export function LoadingWithMessage({ label }: LoadingWithMessageProps) {
  return (
    <div className="text-center bg-white px-4 py-4 rounded">
      <StyledSpinner variant="primary" animation="grow" />
      {label && <p className="text-primary fw-bold mt-2 mb-0">{label}</p>}
    </div>
  )
}
