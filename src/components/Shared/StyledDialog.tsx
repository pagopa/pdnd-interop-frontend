import React, { FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { ActionFunction } from '../../../types'
import { StyledForm } from './StyledForm'

type ConfirmationDialogOverlayProps = {
  title?: string
  close: VoidFunction
  proceedCallback: ActionFunction
  proceedLabel?: string
  disabled?: boolean
  minWidth?: number | string

  contents?: any
}

export const StyledDialog: FunctionComponent<ConfirmationDialogOverlayProps> = ({
  title = 'Conferma azione',
  close,
  proceedCallback,
  proceedLabel = 'Conferma',
  disabled = false,
  minWidth = 'auto',
  children,

  contents: Contents,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  // TEMP Refactor
  // This is silly, but it is to avoid a runtime TypeError when closing the AttributeModal
  const voidClose = () => {
    close()
  }

  return (
    <TrapFocus open>
      <Dialog
        open={true}
        onClose={close}
        aria-describedby={`Modale per azione: ${title}`}
        sx={{ minWidth }}
      >
        <StyledForm onSubmit={handleSubmit(proceedCallback)}>
          <Box>
            <DialogTitle>{title}</DialogTitle>

            {children && <DialogContent>{children}</DialogContent>}
            {Contents && (
              <DialogContent>
                <Contents control={control} errors={errors} />
              </DialogContent>
            )}

            <DialogActions>
              <StyledButton variant="outlined" onClick={voidClose}>
                Annulla
              </StyledButton>
              <StyledButton variant="contained" type="submit" disabled={disabled}>
                {proceedLabel}
              </StyledButton>
            </DialogActions>
          </Box>
        </StyledForm>
      </Dialog>
    </TrapFocus>
  )
}
