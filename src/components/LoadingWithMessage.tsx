import React from 'react'
import { Spinner } from 'react-bootstrap'

type LoadingWithMessageProps = {
  label?: string
}

export function LoadingWithMessage({ label }: LoadingWithMessageProps) {
  return (
    <div className="text-center bg-white px-4 py-4 rounded">
      <Spinner variant="primary" animation="grow" />
      {label && <p className="text-primary fw-bold mt-2 mb-0">{label}</p>}
    </div>
  )
}
