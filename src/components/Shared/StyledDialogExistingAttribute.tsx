import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { StyledButton } from './StyledButton'
import {
  CatalogAttribute,
  DialogExistingAttributeProps,
  ExistingAttributeVerifiedCondition,
  FormikSetFieldValue,
} from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { Box } from '@mui/system'
import { StyledForm } from './StyledForm'
import { StyledAccordion } from './StyledAccordion'
import { StyledInputControlledCheckbox } from './StyledInputControlledCheckbox'
import { StyledInputControlledAsyncAutocomplete } from './StyledInputControlledAsyncAutocomplete'

export const StyledDialogExistingAttribute: FunctionComponent<DialogExistingAttributeProps> = ({
  initialValues,
  onSubmit,
  attributeKey,
}) => {
  const { closeDialog } = useCloseDialog()

  const options = [{ label: "Richiedi nuova convalida dell'attributo", value: 'attribute' }]

  const wrapUpdateSelected = (setFieldValue: FormikSetFieldValue) => (data: unknown) => {
    setFieldValue('selected', data as Array<CatalogAttribute>, false)
  }

  const certifiedCondition = attributeKey === 'certified'
  const verifiedCondition = attributeKey === 'verified'

  return (
    <TrapFocus open>
      <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <StyledForm onSubmit={handleSubmit}>
              <DialogTitle>Aggiungi attributo esistente</DialogTitle>

              <DialogContent>
                <Typography>
                  Se selezioni più di un attributo verrà trattato come “gruppo”
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <StyledInputControlledAsyncAutocomplete
                    label="Attributi selezionati"
                    sx={{ mt: 6, mb: 0 }}
                    multiple={true}
                    placeholder="..."
                    path={{ endpoint: 'ATTRIBUTE_GET_LIST' }}
                    transformKey="attributes"
                    transformFn={(data) => {
                      // TEMP PIN-1176: this is ugly on purpose, it will change as soon as it
                      // is possible to filter attributes in the GET request
                      if (certifiedCondition) {
                        return data.filter((a) => a.kind === 'CERTIFIED')
                      }

                      return data.filter((a) => a.kind !== 'CERTIFIED')
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
                    />
                  )}
                </Box>

                {values.selected && !!(values.selected.length > 0) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ mt: 0, mb: 1 }} fontWeight={600}>
                      Hai selezionato
                    </Typography>
                    <StyledAccordion
                      entries={values.selected.map(({ name, description }) => ({
                        summary: name,
                        details: description,
                      }))}
                    />
                  </Box>
                )}
              </DialogContent>

              <DialogActions>
                <StyledButton variant="outlined" onClick={closeDialog}>
                  Annulla
                </StyledButton>
                <StyledButton variant="contained" type="submit">
                  Aggiungi
                </StyledButton>
              </DialogActions>
            </StyledForm>
          )}
        </Formik>
      </Dialog>
    </TrapFocus>
  )
}
