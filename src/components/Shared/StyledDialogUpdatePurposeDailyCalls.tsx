import React, { FunctionComponent } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { Formik } from 'formik'
import { StyledButton } from './StyledButton'
import { DialogUpdatePurposeDailyCallsProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledText } from './StyledInputControlledText'

export const StyledDialogUpdatePurposeDailyCalls: FunctionComponent<DialogUpdatePurposeDailyCallsProps> =
  ({ onSubmit, initialValues, validationSchema }) => {
    const { closeDialog } = useCloseDialog()

    return (
      <TrapFocus open>
        <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, values, handleChange }) => (
              <StyledForm onSubmit={handleSubmit}>
                <DialogTitle>Indica nuova stima di carico</DialogTitle>

                <DialogContent>
                  <StyledInputControlledText
                    type="number"
                    name="dailyCalls"
                    label="Stima di carico aggiornata*"
                    error={errors.dailyCalls}
                    value={values.dailyCalls}
                    onChange={handleChange}
                    focusOnMount={true}
                  />
                </DialogContent>

                <DialogActions>
                  <StyledButton variant="outlined" onClick={closeDialog}>
                    Annulla
                  </StyledButton>
                  <StyledButton variant="contained" type="submit">
                    Conferma
                  </StyledButton>
                </DialogActions>
              </StyledForm>
            )}
          </Formik>
        </Dialog>
      </TrapFocus>
    )
  }
