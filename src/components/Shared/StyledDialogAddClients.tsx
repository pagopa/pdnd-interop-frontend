import React, { FunctionComponent, useContext, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogAddClientsProps, Client } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { Box } from '@mui/system'
import { StyledForm } from './StyledForm'
import { StyledInputControlledAutocomplete } from './StyledInputControlledAutocomplete'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { PartyContext } from '../../lib/context'
import { differenceBy } from 'lodash'
import { CLIENT_STATE_LABEL } from '../../config/labels'

export const StyledDialogAddClients: FunctionComponent<DialogAddClientsProps> = ({
  onSubmit,
  exclude,
}) => {
  const { closeDialog } = useCloseDialog()
  const { party } = useContext(PartyContext)
  const [selected, setSelected] = useState<Array<Client>>([])

  const { data: clientData } = useAsyncFetch<Array<Client>>(
    { path: { endpoint: 'CLIENT_GET_LIST' }, config: { params: { consumerId: party?.partyId } } },
    { loadingTextLabel: 'Stiamo caricando i client associabili alla finalità' }
  )

  const updateSelected = (data: Client | Client[] | null) => {
    if (data === null) {
      return
    }

    const dataToAdd = Array.isArray(data) ? data : [data]
    setSelected([...selected, ...dataToAdd])
  }

  const handleSubmit = () => {
    onSubmit(selected)
    closeDialog()
  }

  const availableClients = differenceBy(clientData, exclude, 'id')

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
                values={availableClients || []}
                getOptionLabel={(option: Client) =>
                  option ? `${option.name} - ${CLIENT_STATE_LABEL[option.state]}` : ''
                }
                isOptionEqualToValue={(option: Client, value: Client) => option.id === value.id}
                transformFn={(o) => o}
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
