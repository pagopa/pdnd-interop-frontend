import React, { FunctionComponent } from 'react'
import { Modal } from 'react-bootstrap'
import { Overlay } from '../Overlay'
import { StyledButton } from './StyledButton'

type ConfirmationDialogOverlayProps = {
  title?: string
  close: VoidFunction
  proceedCallback: VoidFunction
  proceedLabel?: string
  disabled?: boolean
  minWidth?: number | string
}

export const StyledDialog: FunctionComponent<ConfirmationDialogOverlayProps> = ({
  title = 'Conferma azione',
  close,
  proceedCallback,
  proceedLabel = 'Conferma',
  disabled = false,
  minWidth = 'auto',
  children,
}) => {
  // TEMP Refactor
  // This is silly, but it is to avoid a runtime TypeError when closing the AttributeModal
  const voidClose = () => {
    close()
  }

  return (
    <Overlay>
      <Modal.Dialog contentClassName="px-1 py-1" style={{ minWidth }} scrollable={true}>
        <Modal.Header onHide={close} closeButton>
          <Modal.Title className="me-5">{title}</Modal.Title>
        </Modal.Header>

        {children && <Modal.Body className="py-4">{children}</Modal.Body>}

        <Modal.Footer>
          <StyledButton variant="outlined" onClick={voidClose}>
            Annulla
          </StyledButton>
          <StyledButton variant="contained" onClick={proceedCallback} disabled={disabled}>
            {proceedLabel}
          </StyledButton>
        </Modal.Footer>
      </Modal.Dialog>
    </Overlay>
  )
}
