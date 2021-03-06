import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogNewAttributeProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledText } from './StyledInputControlledText'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './LoadingTranslations'

export const StyledDialogNewAttribute: FunctionComponent<DialogNewAttributeProps> = ({
  attributeKey,
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  const { t, ready } = useTranslation(['shared-components', 'attribute'], { useSuspense: false })
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
            <DialogTitle>
              {t('styledDialogNewAttribute.title')}{' '}
              {t(`type.${attributeKey}`, { count: 1, ns: 'attribute' })}
            </DialogTitle>

            <DialogContent>
              <StyledInputControlledText
                focusOnMount={true}
                name="name"
                error={errors.name}
                value={values.name}
                onChange={handleChange}
                label={t('styledDialogNewAttribute.content.nameField.label')}
              />
              <StyledInputControlledText
                name="description"
                error={errors.description}
                value={values.description}
                onChange={handleChange}
                label={t('styledDialogNewAttribute.content.descriptionField.label')}
                multiline={true}
              />
              <StyledInputControlledText
                name="code"
                error={errors.code}
                value={values.code}
                onChange={handleChange}
                label={t('styledDialogNewAttribute.content.codeField.label')}
                infoLabel={t('styledDialogNewAttribute.content.codeField.infoLabel')}
              />
              <StyledInputControlledText
                name="origin"
                error={errors.origin}
                value={values.origin}
                onChange={handleChange}
                label={t('styledDialogNewAttribute.content.originField.label')}
              />
            </DialogContent>

            <DialogActions>
              <StyledButton variant="outlined" onClick={closeDialog}>
                {t('styledDialogNewAttribute.actions.cancelLabel')}
              </StyledButton>
              <StyledButton variant="contained" type="submit">
                {t('styledDialogNewAttribute.actions.confirmLabel')}
              </StyledButton>
            </DialogActions>
          </StyledForm>
        )}
      </Formik>
    </Dialog>
  )
}
