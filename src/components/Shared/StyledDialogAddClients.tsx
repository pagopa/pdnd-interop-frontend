import React, { FunctionComponent, useContext, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { DialogAddClientsProps, Client } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledAutocomplete } from './StyledInputControlledAutocomplete'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { PartyContext } from '../../lib/context'
import differenceBy from 'lodash/differenceBy'
import { sortBy } from 'lodash'
import { LoadingWithMessage } from './LoadingWithMessage'

export const StyledDialogAddClients: FunctionComponent<DialogAddClientsProps> = ({
  onSubmit,
  exclude,
}) => {
  const { closeDialog } = useCloseDialog()
  const { party } = useContext(PartyContext)
  const [selected, setSelected] = useState<Array<Client>>([])

  const { data: clientData, isLoading } = useAsyncFetch<{ clients: Array<Client> }, Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { params: { kind: 'CONSUMER', consumerId: party?.id } },
    },
    { mapFn: (data) => data.clients }
  )

  const updateSelected = (data: Client | Client[] | null) => {
    if (data === null) {
      return
    }

    const dataToAdd = Array.isArray(data) ? data : [data]
    setSelected([...selected, ...dataToAdd])
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onSubmit(selected)
    closeDialog()
  }

  const transformFn = (options: Array<Client>, search: string) => {
    const selectedIds: Array<string> = selected.map((o) => o.id)
    const isAlreadySelected = (o: Client) => selectedIds.includes(o.id)

    if (search === '') {
      const filtered = options.filter((o) => !isAlreadySelected(o))
      return sortBy(filtered, ['name'])
    }

    const lowercaseSearch = search.toLowerCase()
    const isInSearch = (o: Client) => o.name.toLowerCase().includes(lowercaseSearch)

    const filtered = options.filter((o) => isInSearch(o) && !isAlreadySelected(o))
    return sortBy(filtered, ['name'])
  }

  const availableClients = differenceBy(clientData, exclude, 'id')

  return (
    <Dialog open onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
      <StyledForm onSubmit={handleSubmit}>
        <DialogTitle>Aggiungi client</DialogTitle>

        {!isLoading ? (
          <DialogContent>
            <Box sx={{ mt: 3 }}>
              <StyledInputControlledAutocomplete
                focusOnMount={true}
                label="Client selezionati"
                sx={{ mt: 6, mb: 0 }}
                multiple={true}
                placeholder="..."
                name="selection"
                onChange={updateSelected}
                values={availableClients || []}
                getOptionLabel={(option: Client) => (option ? option.name : '')}
                isOptionEqualToValue={(option: Client, value: Client) => option.id === value.id}
                transformFn={transformFn}
              />
            </Box>
          </DialogContent>
        ) : (
          <LoadingWithMessage
            label="Stiamo caricando i client associabili alla finalità"
            transparentBackground
          />
        )}

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
  )
}
