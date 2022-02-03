import React, { FunctionComponent, useContext } from 'react'
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
  AddSecurityOperatorFormInputValues,
  DialogAddSecurityOperatorProps,
  FormikSetFieldValue,
  User,
} from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { Box } from '@mui/system'
import { StyledForm } from './StyledForm'
import { StyledInputControlledAutocomplete } from './StyledInputControlledAutocomplete'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { PartyContext } from '../../lib/context'

export const StyledDialogAddSecurityOperator: FunctionComponent<DialogAddSecurityOperatorProps> = ({
  initialValues,
  onSubmit,
}) => {
  const { closeDialog } = useCloseDialog()
  const { party } = useContext(PartyContext)

  const { data: userData } = useAsyncFetch<Array<User>>(
    {
      path: {
        endpoint: 'OPERATOR_API_GET_LIST' /* TODO SELF-CARE */,
        endpointParams: { institutionId: party?.institutionId },
      },
      config: {
        params: {
          role: 'security',
        },
      },
    },
    { loaderType: 'contextual', loadingTextLabel: 'Stiamo caricando gli operatori' }
  )

  const wrapUpdateSelected = (setFieldValue: FormikSetFieldValue) => (data: unknown) => {
    setFieldValue('selected', data as Array<User>, false)
  }

  const handleSubmit = (data: AddSecurityOperatorFormInputValues) => {
    onSubmit(data)
    closeDialog()
  }

  return (
    <TrapFocus open>
      <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <StyledForm onSubmit={handleSubmit}>
              <DialogTitle>Aggiungi operatori di sicurezza</DialogTitle>

              <DialogContent>
                <Box sx={{ mt: 3 }}>
                  <StyledInputControlledAutocomplete
                    label="Operatori selezionati"
                    sx={{ mt: 6, mb: 0 }}
                    multiple={true}
                    placeholder="..."
                    name="selection"
                    onChange={wrapUpdateSelected(setFieldValue)}
                    values={userData || []}
                    getOptionLabel={(option: User) =>
                      option ? `${option.name} ${option.surname}` : ''
                    }
                    isOptionEqualToValue={(option: User, value: User) => option.id === value.id}
                    filterFn={(options, search) =>
                      options.filter(
                        (o) =>
                          o.name.toLowerCase().includes(search) ||
                          o.surname.toLowerCase().includes(search)
                      )
                    }
                  />
                </Box>

                {values.selected && !!(values.selected.length > 0) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ mt: 0, mb: 1 }} fontWeight={600}>
                      Hai selezionato{' '}
                      {values.selected.map(({ name, surname }) => `${name} ${surname}`).join(', ')}
                    </Typography>
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
