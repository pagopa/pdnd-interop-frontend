import React, { FunctionComponent, useContext } from 'react'
import { Control, FieldValues, useForm, UseFormGetValues, UseFormWatch } from 'react-hook-form'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { ActionFunction, MUISize } from '../../../types'
import { StyledForm } from './StyledForm'
import { TableActionMenuContext } from '../../lib/context'

type RHFProps = {
  control: Control<FieldValues, Record<string, unknown>>
  errors: Record<string, unknown>
  watch: UseFormWatch<FieldValues>
  getValues: UseFormGetValues<FieldValues>
}

type ConfirmationDialogOverlayProps = {
  title?: string
  Contents?: FunctionComponent<RHFProps>
  close: VoidFunction
  proceedCallback: ActionFunction
  proceedLabel?: string
  disabled?: boolean
  maxWidth?: MUISize
}

export const StyledDialog: FunctionComponent<ConfirmationDialogOverlayProps> = ({
  title = 'Conferma azione',
  close,
  proceedCallback,
  proceedLabel = 'Conferma',
  disabled = false,
  maxWidth = 'xs',
  children,

  Contents,
}) => {
  const { setTableActionMenu } = useContext(TableActionMenuContext)
  const {
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm()

  const voidClose = () => {
    close()
    // Close any table action that might be open
    setTableActionMenu(null)
  }

  return (
    <TrapFocus open>
      <Dialog
        open={true}
        onClose={close}
        aria-describedby={`Modale per azione: ${title}`}
        maxWidth={maxWidth}
        fullWidth
      >
        <StyledForm onSubmit={handleSubmit(proceedCallback)}>
          <Box>
            <DialogTitle>{title}</DialogTitle>

            {children && <DialogContent>{children}</DialogContent>}
            {Contents && (
              <DialogContent>
                <Contents control={control} errors={errors} watch={watch} getValues={getValues} />
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
