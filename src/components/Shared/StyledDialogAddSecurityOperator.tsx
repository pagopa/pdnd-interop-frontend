import React, { FunctionComponent, useContext } from 'react'
import { useFormik } from 'formik'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import sortBy from 'lodash/sortBy'

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
        endpoint: 'USER_GET_LIST',
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

  const transformFn = (options: Array<User>, search: string) => {
    const selectedIds: Array<string> = formik.values.selected.map((o) => o.id)
    const isAlreadySelected = (o: User) => selectedIds.includes(o.id)
    const isInSearch = (o: User) => `${o.name} ${o.surname}`.toLowerCase().includes(search)

    const filtered = options.filter((o) => isInSearch(o) && !isAlreadySelected(o))
    return sortBy(filtered, ['surname', 'name'])
  }

  return (
    <TrapFocus open>
      <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
        <StyledForm onSubmit={handleSubmit}>
          <DialogTitle>Aggiungi operatori di sicurezza</DialogTitle>

          <DialogContent>
            <Box sx={{ mt: 3 }}>
              <StyledInputControlledAutocomplete
                focusOnMount={true}
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
                transformFn={transformFn}
              />
            </Box>
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
