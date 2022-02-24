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
import { DialogAddSecurityOperatorKeyProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledText } from './StyledInputControlledText'

export const StyledDialogAddSecurityOperatorKey: FunctionComponent<DialogAddSecurityOperatorKeyProps> =
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
                <DialogTitle>Carica nuova chiave pubblica</DialogTitle>

                <DialogContent>
                  <StyledInputControlledText
                    name="name"
                    label="Nome della chiave (richiesto)"
                    infoLabel="Ti aiuta a distinguerla dalle altre"
                    error={errors.name}
                    value={values.name}
                    onChange={handleChange}
                    focusOnMount={true}
                  />

                  <StyledInputControlledText
                    name="key"
                    label="Chiave pubblica (richiesto)"
                    error={errors.key}
                    value={values.key}
                    multiline={true}
                    onChange={handleChange}
                  />
                </DialogContent>

                <DialogActions>
                  <StyledButton variant="outlined" onClick={closeDialog}>
                    Annulla
                  </StyledButton>
                  <StyledButton variant="contained" type="submit">
                    Carica
                  </StyledButton>
                </DialogActions>
              </StyledForm>
            )}
          </Formik>
        </Dialog>
      </TrapFocus>
    )
  }
