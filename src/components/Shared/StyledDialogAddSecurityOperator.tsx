import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Unstable_TrapFocus as TrapFocus } from '@mui/base'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { DialogAddSecurityOperatorProps, User } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledAutocomplete } from './StyledInputControlledAutocomplete'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { PartyContext } from '../../lib/context'
import sortBy from 'lodash/sortBy'
import { useHistory } from 'react-router-dom'
import { getBits } from '../../lib/router-utils'

export const StyledDialogAddSecurityOperator: FunctionComponent<DialogAddSecurityOperatorProps> = ({
  initialValues,
  onSubmit,
}) => {
  const [excludeIdsList, setExcludeIdsList] = useState<Array<string>>([])

  const history = useHistory()
  const locationBits = getBits(history.location)
  const clientId = locationBits[locationBits.length - 1]

  const { closeDialog } = useCloseDialog()
  const { party } = useContext(PartyContext)
  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  })

  const { data: currentUserData } = useAsyncFetch<Array<User>>({
    path: { endpoint: 'OPERATOR_SECURITY_GET_LIST', endpointParams: { clientId } },
  })

  const { data: allUserData } = useAsyncFetch<Array<User>>({
    path: {
      endpoint: 'USER_GET_LIST',
      endpointParams: { institutionId: party?.institutionId },
    },
    config: { params: { productRoles: ['security'] } },
  })

  const filteredUserData = allUserData
    ? allUserData.filter((d) => !excludeIdsList.includes(d.id))
    : []

  useEffect(() => {
    if (currentUserData) {
      setExcludeIdsList(
        (currentUserData.map((u) => u.relationshipId).filter((id) => id) as
          | Array<string>
          | undefined) || []
      )
    }
  }, [currentUserData])

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

    if (search === '') {
      const filtered = options.filter((o) => !isAlreadySelected(o))
      return sortBy(filtered, ['surname', 'name'])
    }

    const lowercaseSearch = search.toLowerCase()
    const isInSearch = (o: User) => `${o.name} ${o.surname}`.toLowerCase().includes(lowercaseSearch)

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
                values={filteredUserData}
                getOptionLabel={(option: User) =>
                  option ? `${option.name} ${option.surname}` : ''
                }
                isOptionEqualToValue={(option: User, value: User) => option.id === value.id}
                transformFn={transformFn}
              />
            </Box>

            <Alert sx={{ mt: 1 }} severity="info">
              Se l&rsquo;operatore non è in elenco, in questa fase di test contattaci per
              aggiungerlo
            </Alert>
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
