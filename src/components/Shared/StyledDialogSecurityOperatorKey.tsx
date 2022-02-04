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
import { DialogSecurityOperatorKeyProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledSelect } from './StyledInputControlledSelect'
import { StyledInputControlledText } from './StyledInputControlledText'

export const StyledDialogSecurityOperatorKey: FunctionComponent<DialogSecurityOperatorKeyProps> = ({
  onSubmit,
  initialValues,
  validationSchema,
}) => {
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
                <StyledInputControlledSelect
                  name="alg"
                  label="Seleziona algoritmo*"
                  options={[{ label: 'RS256', value: 'RS256' }]}
                  error={errors.alg}
                  value={values.alg}
                  onChange={handleChange}
                />

                <StyledInputControlledText
                  name="key"
                  label="Chiave pubblica*"
                  error={errors.key}
                  value={values.key}
                  multiline={true}
                  onChange={handleChange}
                  focusOnMount={true}
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
