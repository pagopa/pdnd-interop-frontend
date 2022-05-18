import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogNewAttributeProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledText } from './StyledInputControlledText'
import { useTranslation } from 'react-i18next'

export const StyledDialogNewAttribute: FunctionComponent<DialogNewAttributeProps> = ({
  attributeKey,
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  const { t } = useTranslation('attribute')
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
            <DialogTitle>
              Crea nuovo attributo {t(`keys.${attributeKey}`, { count: 1 })}
            </DialogTitle>

            <DialogContent>
              <StyledInputControlledText
                focusOnMount={true}
                name="name"
                error={errors.name}
                value={values.name}
                onChange={handleChange}
                label="Nome dell'attributo (richiesto)"
              />
              <StyledInputControlledText
                name="description"
                error={errors.description}
                value={values.description}
                onChange={handleChange}
                label="Descrizione dell'attributo (richiesto)"
                multiline={true}
              />
              <StyledInputControlledText
                name="code"
                error={errors.code}
                value={values.code}
                onChange={handleChange}
                label="Id della fonte autoritativa (richiesto)"
              />
              <StyledInputControlledText
                name="origin"
                error={errors.origin}
                value={values.origin}
                onChange={handleChange}
                label="Nome della fonte autoritativa (richiesto)"
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
  )
}
