import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogAskExtensionProps } from '../../../types'
import { StyledInputControlledText } from './StyledInputControlledText'
import { StyledForm } from './StyledForm'
// import { useFeedback } from '../../hooks/useFeedback'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './LoadingTranslations'

type InputValues = {
  reasons?: string
}

export const StyledDialogExtension: FunctionComponent<DialogAskExtensionProps> = () => {
  const { t, ready } = useTranslation('shared-components', {
    keyPrefix: 'styledDialogExtension',
    useSuspense: false,
  })
  // const { runAction } = useFeedback()
  const { closeDialog } = useCloseDialog()

  const askExtension = async () => {
    // await runAction('Richiedi estensione')
  }

  const initialValues: InputValues = { reasons: '' }
  // const validationSchema = {}

  if (!ready) {
    return <LoadingTranslations />
  }

  return (
    <Dialog open onClose={closeDialog} aria-describedby={t('ariaDescribedBy')} fullWidth>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={askExtension}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, errors, values, handleChange }) => (
          <StyledForm onSubmit={handleSubmit}>
            <DialogTitle>{t('title')}</DialogTitle>

            <DialogContent>
              <p>{t('content.message')}</p>
              <StyledInputControlledText
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
