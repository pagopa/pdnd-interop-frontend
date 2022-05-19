import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
} from '@mui/material'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import {
  CatalogAttribute,
  DialogExistingAttributeProps,
  ExistingAttributeVerifiedCondition,
  FormikSetFieldValue,
} from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledAccordion } from './StyledAccordion'
import { StyledInputControlledCheckbox } from './StyledInputControlledCheckbox'
import { StyledInputControlledAsyncAutocomplete } from './StyledInputControlledAsyncAutocomplete'
import { useTranslation } from 'react-i18next'

export const StyledDialogExistingAttribute: FunctionComponent<DialogExistingAttributeProps> = ({
  initialValues,
  onSubmit,
  selectedIds,
  attributeKey,
}) => {
  const { t } = useTranslation(['shared-components', 'attribute'])
  const { closeDialog } = useCloseDialog()

  const options = [{ label: "Richiedi nuova convalida dell'attributo", value: 'attribute' }]

  const wrapUpdateSelected = (setFieldValue: FormikSetFieldValue) => (data: unknown) => {
    setFieldValue('selected', data as Array<CatalogAttribute>, false)
  }

  const certifiedCondition = attributeKey === 'certified'
  const verifiedCondition = attributeKey === 'verified'

  return (
    <Dialog
      open
      onClose={closeDialog}
      aria-describedby={t('styledDialogExistingAttribute.ariaDescribedBy')}
      fullWidth
      maxWidth="md"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <StyledForm onSubmit={handleSubmit}>
            <DialogTitle>
              {t('styledDialogExistingAttribute.title')}{' '}
              {t(`type.${attributeKey}`, { count: 1, ns: 'attribute' })}
            </DialogTitle>

            <DialogContent>
              <Typography>{t('styledDialogExistingAttribute.content.message')}</Typography>

              <Box sx={{}}>
                <StyledInputControlledAsyncAutocomplete
                  label={t('styledDialogExistingAttribute.content.autocompleteLabel')}
                  sx={{ mt: 2, mb: 0 }}
                  multiple={true}
                  placeholder="..."
                  path={{ endpoint: 'ATTRIBUTE_GET_LIST' }}
                  transformKey="attributes"
                  transformFn={(fetchedData) => {
                    const alreadySelectedIds = [...selectedIds, ...values.selected.map((a) => a.id)]
                    const notAlreadySelectedAttributes = fetchedData.filter(
                      (d) => !alreadySelectedIds.includes(d.id)
                    )

                    // TEMP PIN-1176: this is ugly on purpose, it will change as soon as it
                    // is possible to filter attributes in the GET request
                    if (certifiedCondition) {
                      return notAlreadySelectedAttributes.filter((a) => a.kind === 'CERTIFIED')
                    }

                    return notAlreadySelectedAttributes.filter((a) => a.kind !== 'CERTIFIED')
                  }}
                  name="selection"
                  onChange={wrapUpdateSelected(setFieldValue)}
                  getOptionLabel={(option: CatalogAttribute) => (option ? option.name : '')}
                  isOptionEqualToValue={(option: CatalogAttribute, value: CatalogAttribute) =>
                    option.name === value.name
                  }
                />

                {verifiedCondition && (
                  <StyledInputControlledCheckbox
                    name="verifiedCondition"
                    value={values.verifiedCondition as ExistingAttributeVerifiedCondition}
                    setFieldValue={setFieldValue}
                    options={options}
                    sx={{ mt: 0 }}
                    // TEMP PIN-1227
                    disabled={true}
                  />
                )}
              </Box>

              {values.selected && !!(values.selected.length > 0) && (
                <Box sx={{ mt: 2 }}>
                  <Divider />
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ mt: 0, mb: 1 }} fontWeight={600}>
                      {t('styledDialogExistingAttribute.content.selectedLabel')}
                    </Typography>
                    <StyledAccordion
                      entries={values.selected.map(({ name, description }) => ({
                        summary: name,
                        details: description,
                      }))}
                    />
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <StyledButton variant="outlined" onClick={closeDialog}>
                {t('styledDialogExistingAttribute.cancelLabel')}
              </StyledButton>
              <StyledButton variant="contained" type="submit">
                {t('styledDialogExistingAttribute.confirmLabel')}
              </StyledButton>
            </DialogActions>
          </StyledForm>
        )}
      </Formik>
    </Dialog>
  )
}
