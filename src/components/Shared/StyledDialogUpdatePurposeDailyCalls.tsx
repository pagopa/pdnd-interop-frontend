import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
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
      <Dialog open onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, values, handleChange }) => (
            <StyledForm onSubmit={handleSubmit}>
              <DialogTitle>Aggiorna numero di chiamate API/giorno</DialogTitle>

              <DialogContent>
                <StyledInputControlledText
                  type="number"
                  name="dailyCalls"
                  label="Numero di chiamate API/giorno (richiesto)"
                  infoLabel="Il numero di chiamate al giorno che stimi di effettuare. Questo valore contribuirà a definire una soglia oltre la quale l'erogatore dovrà approvare manualmente nuove finalità per garantire la sostenibilità tecnica dell'E-Service"
                  error={errors.dailyCalls}
                  value={values.dailyCalls}
                  onChange={handleChange}
                  focusOnMount={true}
                  inputProps={{ min: '1' }}
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
    )
  }
