import React from 'react'
import { ClientQueries } from '@/api/client'
import { useDialog } from '@/stores'
import type { DialogAddClientToPurposeProps } from '@/types/dialog.types'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFAutocompleteMultiple } from '../shared/react-hook-form-inputs'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { useAutocompleteTextInput } from '@/hooks/useAutocompleteTextInput'

type AddClientToPurposeFormValues = {
  selectedClients: Array<string>
}

export const DialogAddClientToPurpose: React.FC<DialogAddClientToPurposeProps> = ({
  purposeId,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAddClientToPurpose',
    useSuspense: false,
  })
  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  const { mutateAsync: addClient } = PurposeMutations.useAddClient()
  const [clientSearchParam, setClientSearchParam] = useAutocompleteTextInput()

  const formMethods = useForm<AddClientToPurposeFormValues>({
    defaultValues: {
      selectedClients: [],
    },
  })

  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  const { data, isLoading: isLoadingClients } = ClientQueries.useGetList(
    {
      kind: 'CONSUMER',
      q: clientSearchParam,
      offset: 0,
      limit: 50,
    },
    { suspense: false }
  )

  const options = React.useMemo(() => {
    if (!purpose) return []
    const clientAlreadyInPurpose = purpose.clients
    const clients = data?.results ?? []
    const availableClients = clients.filter(
      (client) => !clientAlreadyInPurpose.some(({ id }) => client.id === id)
    )

    return availableClients.map((client) => ({ label: client.name, value: client.id }))
  }, [purpose, data])

  const onSubmit = ({ selectedClients }: AddClientToPurposeFormValues) => {
    Promise.all(
      selectedClients.map((selectedClient) => addClient({ clientId: selectedClient, purposeId }))
    ).then(closeDialog)
  }

  const selectedClients = formMethods.watch('selectedClients')

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Box sx={{ mt: 3 }}>
              <RHFAutocompleteMultiple
                focusOnMount
                label={t('content.autocompleteLabel')}
                sx={{ mt: 6, mb: 0 }}
                onInputChange={(_, value) => setClientSearchParam(value)}
                name="selectedClients"
                options={options}
                loading={isLoadingPurpose || isLoadingClients}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {t('actions.cancelLabel')}
            </Button>
            <Button disabled={selectedClients.length === 0} variant="contained" type="submit">
              {t('actions.confirmLabel')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
