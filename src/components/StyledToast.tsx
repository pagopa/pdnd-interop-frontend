import React from 'react'
import { Toast } from 'react-bootstrap'
import { ToastContent } from '../../types'
import noop from 'lodash/noop'

type StyledToastProps = ToastContent & {
  onClose?: any
}

export function StyledToast({ title, description, onClose = noop }: StyledToastProps) {
  return (
    <Toast
      animation={true}
      className="position-fixed bottom-0 mb-4"
      bg="success"
      style={{ zIndex: 3, left: '50%', transform: `translate(-50%, 0)` }}
      onClose={onClose}
    >
      <Toast.Header>
        <strong className="me-auto">🎉 {title}</strong>
      </Toast.Header>
      <Toast.Body>{description}</Toast.Body>
    </Toast>
  )
}
