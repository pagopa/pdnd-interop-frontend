import React, { FunctionComponent, useContext } from 'react'
import { useFormik } from 'formik'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogAddSecurityOperatorProps, User } from '../../../types'
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
  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  })

  const { data: userData } = useAsyncFetch<Array<User>>(
    {
      path: {
        endpoint: 'USERS_GET_LIST',
        endpointParams: { institutionId: party?.institutionId },
      },
      config: { params: { productRoles: ['security'] } },
    },
    { loaderType: 'contextual', loadingTextLabel: 'Stiamo caricando gli operatori' }
  )

  const updateSelected = (data: unknown) => {
    formik.setFieldValue('selected', data as Array<User>, false)
  }

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement> | undefined) => {
    formik.handleSubmit(e)
    closeDialog()
  }

  return (
    <TrapFocus open>
      <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
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
                onChange={updateSelected}
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

            {formik.values.selected && !!(formik.values.selected.length > 0) && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ mt: 0, mb: 1 }} fontWeight={600}>
                  Hai selezionato{' '}
                  {formik.values.selected
                    .map(({ name, surname }) => `${name} ${surname}`)
                    .join(', ')}
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
      </Dialog>
    </TrapFocus>
  )
}
