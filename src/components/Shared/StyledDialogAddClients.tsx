import React, { FunctionComponent, useState } from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogAddClientsProps, Client } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { StyledInputControlledAutocomplete } from './StyledInputControlledAutocomplete'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import differenceBy from 'lodash/differenceBy'
import { sortBy } from 'lodash'
import { LoadingWithMessage } from './LoadingWithMessage'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../../hooks/useJwt'
import { LoadingTranslations } from './LoadingTranslations'

export const StyledDialogAddClients: FunctionComponent<DialogAddClientsProps> = ({
  onSubmit,
  exclude,
}) => {
  const { t, ready } = useTranslation('shared-components', {
    keyPrefix: 'styledDialogAddClients',
    useSuspense: false,
  })
  const { closeDialog } = useCloseDialog()
  const { jwt } = useJwt()
  const [selected, setSelected] = useState<Array<Client>>([])

  const { data: clientData, isLoading } = useAsyncFetch<{ clients: Array<Client> }, Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { params: { kind: 'CONSUMER', consumerId: jwt?.organizationId } },
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

  if (!ready) {
    return <LoadingTranslations />
  }

  return (
    <Dialog open onClose={closeDialog} aria-describedby={t('ariaDescribedBy')} fullWidth>
      <StyledForm onSubmit={handleSubmit}>
        <DialogTitle>{t('title')}</DialogTitle>

        {!isLoading ? (
          <DialogContent>
            <Box sx={{ mt: 3 }}>
              <StyledInputControlledAutocomplete
                focusOnMount={true}
                label={t('content.autocompleteLabel')}
                sx={{ mt: 6, mb: 0 }}
                multiple={true}
                placeholder="..."
                name="selection"
                onChange={updateSelected}
                options={availableClients || []}
                getOptionLabel={(option: Client) => (option ? option.name : '')}
                isOptionEqualToValue={(option: Client, value: Client) => option.id === value.id}
                transformFn={transformFn}
              />
            </Box>
          </DialogContent>
        ) : (
          <LoadingWithMessage label={t('content.loadingMessage')} transparentBackground />
        )}

        <DialogActions>
          <StyledButton variant="outlined" onClick={closeDialog}>
            {t('actions.cancelLabel')}
          </StyledButton>
          <StyledButton variant="contained" type="submit">
            {t('actions.confirmLabel')}
          </StyledButton>
        </DialogActions>
      </StyledForm>
    </Dialog>
  )
}
