import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Formik } from 'formik'
import { StyledButton } from './StyledButton'
import { DialogAddSecurityOperatorKeyProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledText } from './StyledInputControlledText'
import { StyledLink } from './StyledLink'
import { useRoute } from '../../hooks/useRoute'
import { useTranslation } from 'react-i18next'

export const StyledDialogAddSecurityOperatorKey: FunctionComponent<
  DialogAddSecurityOperatorKeyProps
> = ({ onSubmit, initialValues, validationSchema }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'styledDialogAddSecurityOperatorKeys',
  })
  const { routes } = useRoute()
  const { closeDialog } = useCloseDialog()

  return (
    <Dialog open onClose={closeDialog} aria-describedby={t('ariaDescribedBy')} fullWidth>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, errors, values, handleChange }) => (
          <StyledForm onSubmit={handleSubmit}>
            <DialogTitle>{t('title')}</DialogTitle>

            <DialogContent>
              <StyledInputControlledText
                name="name"
                label={t('content.nameField.label')}
                infoLabel={t('content.nameField.infoLabel')}
                error={errors.name}
                value={values.name}
                onChange={handleChange}
                focusOnMount={true}
              />

              <StyledInputControlledText
                name="key"
                label={t('content.keyField.label')}
                infoLabel={
                  <React.Fragment>
                    {t('content.keyField.infoLabel.message')}{' '}
                    <StyledLink to={routes.SECURITY_KEY_GUIDE.PATH} target="_blank">
                      {t('content.keyField.infoLabel.linkLabel')}
                    </StyledLink>
                  </React.Fragment>
                }
                error={errors.key}
                value={values.key}
                multiline={true}
                onChange={handleChange}
              />
            </DialogContent>

            <DialogActions>
              <StyledButton variant="outlined" onClick={closeDialog}>
                {t('actions.cancelLabel')}
              </StyledButton>
              <StyledButton variant="contained" type="submit">
                {t('actions.confirmLabel')}
              </StyledButton>
            </DialogActions>
          </StyledForm>
        )}
      </Formik>
    </Dialog>
  )
}
