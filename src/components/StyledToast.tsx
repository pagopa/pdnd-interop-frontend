import React from 'react'
import { Toast } from 'react-bootstrap'
import { RequestOutcome, ToastContentWithOutcome } from '../../types'
import noop from 'lodash/noop'

type StyledToastProps = ToastContentWithOutcome & {
  onClose?: any
}

const BG_TYPE: { [key in RequestOutcome]: string } = {
  success: 'success',
  error: 'danger',
}

export function StyledToast({ outcome, title, description, onClose = noop }: StyledToastProps) {
  return (
    <Toast
      animation={true}
      className="position-fixed bottom-0 mb-4"
      bg={BG_TYPE[outcome!]}
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
