import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Formik } from 'formik'
import { StyledButton } from './StyledButton'
import { DialogUpdatePurposeDailyCallsProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledText } from './StyledInputControlledText'
import { useTranslation } from 'react-i18next'

export const StyledDialogUpdatePurposeDailyCalls: FunctionComponent<
  DialogUpdatePurposeDailyCallsProps
> = ({ onSubmit, initialValues, validationSchema }) => {
  const { t } = useTranslation('shared-components')
  const { closeDialog } = useCloseDialog()

  return (
    <Dialog open onClose={closeDialog} aria-describedby={t('ariaLabelledBy')} fullWidth>
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
                type="number"
                name="dailyCalls"
                label={t('content.dailyCallsField.label')}
                infoLabel={t('content.dailyCallsField.infoLabel')}
                error={errors.dailyCalls}
                value={values.dailyCalls}
                onChange={handleChange}
                focusOnMount={true}
                inputProps={{ min: '1' }}
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
