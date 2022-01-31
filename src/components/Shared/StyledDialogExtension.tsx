import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogAskExtensionProps } from '../../../types'
import { StyledInputControlledTextFormik } from './StyledInputControlledTextFormik'
import { StyledForm } from './StyledForm'
import { useFeedback } from '../../hooks/useFeedback'
import { useCloseDialog } from '../../hooks/useCloseDialog'

type InputValues = {
  reasons?: string
}

export const StyledDialogExtension: FunctionComponent<DialogAskExtensionProps> = () => {
  const { runFakeAction } = useFeedback()
  const { closeDialog } = useCloseDialog()

  const askExtension = async () => {
    await runFakeAction('Richiedi estensione')
  }

  const initialValues: InputValues = { reasons: '' }
  // const validationSchema = {}

  return (
    <TrapFocus open>
      <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={askExtension}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, values, handleChange }) => (
            <StyledForm onSubmit={handleSubmit}>
              <DialogTitle>Richiedi estensione</DialogTitle>

              <DialogContent>
                <p>
                  Compila il form indicando i motivi per cui ritieni che il tuo ente abbia diritto
                  di iscriversi all’e-service, completo di basi giuridiche e finalità. Una notifica
                  sarà inviata all’ente erogatore del servizio
                </p>
                <StyledInputControlledTextFormik
                  focusOnMount={true}
                  name="reasons"
                  error={errors.reasons}
                  value={values.reasons}
                  onChange={handleChange}
                  multiline={true}
                  rows={12}
                />
              </DialogContent>

              <DialogActions>
                <StyledButton variant="outlined" onClick={closeDialog}>
                  Annulla
                </StyledButton>
                <StyledButton variant="contained" type="submit">
                  Richiedi
                </StyledButton>
              </DialogActions>
            </StyledForm>
          )}
        </Formik>
      </Dialog>
    </TrapFocus>
  )
}
