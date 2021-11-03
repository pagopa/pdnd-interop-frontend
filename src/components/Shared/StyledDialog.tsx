import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { ActionFunction } from '../../../types'

type ConfirmationDialogOverlayProps = {
  title?: string
  close: VoidFunction
  proceedCallback: ActionFunction
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
    <Dialog
      open={true}
      onClose={close}
      aria-describedby={`Modale per azione: ${title}`}
      sx={{ minWidth }}
    >
      <Box>
        <DialogTitle>{title}</DialogTitle>

        {children && <DialogContent>{children}</DialogContent>}

        <DialogActions>
          <StyledButton variant="outlined" onClick={voidClose}>
            Annulla
          </StyledButton>
          <StyledButton variant="contained" onClick={proceedCallback} disabled={disabled}>
            {proceedLabel}
          </StyledButton>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
