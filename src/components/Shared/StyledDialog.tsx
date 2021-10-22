import React from 'react'
import { Modal } from 'react-bootstrap'
import { Overlay } from '../Overlay'
import { StyledButton } from './StyledButton'

type ConfirmationDialogOverlayProps = {
  title?: string
  description?: string | React.ReactNode
  close: VoidFunction
  proceedCallback: VoidFunction
  proceedLabel?: string
  disabled?: boolean
}

export function StyledDialog({
  title = 'Conferma azione',
  description,
  close,
  proceedCallback,
  proceedLabel = 'Conferma',
  disabled = false,
}: ConfirmationDialogOverlayProps) {
  return (
    <Overlay>
      <Modal.Dialog contentClassName="px-1 py-1">
        <Modal.Header onHide={close} closeButton>
          <Modal.Title className="me-5">{title}</Modal.Title>
        </Modal.Header>

        {description && <Modal.Body className="py-4">{description}</Modal.Body>}

        <Modal.Footer>
          <StyledButton variant="outline-primary" onClick={close}>
            Annulla
          </StyledButton>
          <StyledButton variant="primary" onClick={proceedCallback} disabled={disabled}>
            {proceedLabel}
          </StyledButton>
        </Modal.Footer>
      </Modal.Dialog>
    </Overlay>
  )
}
