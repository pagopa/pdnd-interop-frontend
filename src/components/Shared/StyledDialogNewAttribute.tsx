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
import { DialogNewAttributeProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledTextFormik } from './StyledInputControlledTextFormik'
import { ATTRIBUTE_TYPE_SINGULAR_LABEL } from '../../config/labels'

export const StyledDialogNewAttribute: FunctionComponent<DialogNewAttributeProps> = ({
  attributeKey,
  initialValues,
  validationSchema,
  onSubmit,
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
              <DialogTitle>
                Crea nuovo attributo {ATTRIBUTE_TYPE_SINGULAR_LABEL[attributeKey]}
              </DialogTitle>

              <DialogContent>
                <StyledInputControlledTextFormik
                  focusOnMount={true}
                  name="name"
                  error={errors.name}
                  value={values.name}
                  onChange={handleChange}
                  label="Nome dell'attributo (richiesto)"
                />
                <StyledInputControlledTextFormik
                  name="code"
                  error={errors.code}
                  value={values.code}
                  onChange={handleChange}
                  label="Id della fonte autoritativa (richiesto)"
                />
                <StyledInputControlledTextFormik
                  name="origin"
                  error={errors.origin}
                  value={values.origin}
                  onChange={handleChange}
                  label="Nome della fonte autoritativa (richiesto)"
                />
                <StyledInputControlledTextFormik
                  name="description"
                  error={errors.description}
                  value={values.description}
                  onChange={handleChange}
                  label="Descrizione della fonte autoritativa (richiesto)"
                  multiline={true}
                />
              </DialogContent>

              <DialogActions>
                <StyledButton variant="outlined" onClick={closeDialog}>
                  Annulla
                </StyledButton>
                <StyledButton variant="contained" type="submit">
                  Crea attributo
                </StyledButton>
              </DialogActions>
            </StyledForm>
          )}
        </Formik>
      </Dialog>
    </TrapFocus>
  )
}
