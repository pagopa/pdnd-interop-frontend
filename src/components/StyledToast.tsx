import React from 'react'
import { Toast } from 'react-bootstrap'
import { RequestOutcome, ToastContent, ToastContentWithOutcome } from '../../types'
import noop from 'lodash/noop'

type StyledToastProps = ToastContentWithOutcome & {
  onClose?: any
}

const BG_TYPE: { [key in RequestOutcome]: string } = {
  success: 'success',
  error: 'danger',
}

const BG_TYPE_EMOJI: { [key in RequestOutcome]: string } = {
  success: '🎉',
  error: '❌',
}

const DEFAULT_TEXT: { [key in RequestOutcome]: ToastContent } = {
  success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
  error: {
    title: 'Errore',
    description: "C'è stato un errore, non è stato possibile completare l'operazione",
  },
}

export function StyledToast({ outcome, title, description, onClose = noop }: StyledToastProps) {
  return (
    <Toast
      animation={true}
      className="position-fixed bottom-0 mb-4"
      bg={BG_TYPE[outcome]}
      style={{ zIndex: 3, left: '50%', transform: `translate(-50%, 0)` }}
      onClose={onClose}
    >
      <Toast.Header>
        <strong className="me-auto">
          {BG_TYPE_EMOJI[outcome]} {title || DEFAULT_TEXT[outcome].title}
        </strong>
      </Toast.Header>
      <Toast.Body>{description || DEFAULT_TEXT[outcome].description}</Toast.Body>
    </Toast>
  )
}
