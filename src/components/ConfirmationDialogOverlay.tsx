import React, { FunctionComponent } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { VoidCallback } from '../../types'
import { Overlay } from './Overlay'

type ConfirmationDialogOverlayProps = {
  modalTitle?: string
  close: VoidCallback
  proceedCallback: VoidCallback
  proceedLabel?: string
}

export const ConfirmationDialogOverlay: FunctionComponent<ConfirmationDialogOverlayProps> = ({
  children,
  modalTitle = 'Conferma azione',
  close,
  proceedCallback,
  proceedLabel = 'Conferma',
}) => {
  return (
    <Overlay>
      <Modal.Dialog contentClassName="px-1 py-1">
        <Modal.Header onHide={close} closeButton>
          <Modal.Title className="me-5">{modalTitle}</Modal.Title>
        </Modal.Header>

        {children && <Modal.Body className="py-4">{children}</Modal.Body>}

        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Annulla
          </Button>
          <Button variant="primary" onClick={proceedCallback}>
            {proceedLabel}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Overlay>
  )
}
