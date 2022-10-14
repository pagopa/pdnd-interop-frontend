import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Formik } from 'formik'
import { StyledButton } from './StyledButton'
import { DialogRejectAgreementProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledText } from './StyledInputControlledText'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './LoadingTranslations'

export const StyledDialogRejectAgreement: FunctionComponent<DialogRejectAgreementProps> = ({
  onSubmit,
  initialValues,
  validationSchema,
}) => {
  const { t, ready } = useTranslation('shared-components', {
    useSuspense: false,
    keyPrefix: 'styledDialogRejectAgreement',
  })
  const { closeDialog } = useCloseDialog()

  if (!ready) {
    return <LoadingTranslations />
  }

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
                name="reason"
                label={t('content.reason.label')}
                infoLabel={t('content.reason.infoLabel')}
                error={errors.reason}
                value={values.reason}
                onChange={handleChange}
                focusOnMount={true}
                multiline={true}
                inputProps={{ maxLength: 250 }}
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
