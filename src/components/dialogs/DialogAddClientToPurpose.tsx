import React from 'react'
import { ClientQueries } from '@/api/client'
import { useDialog } from '@/stores'
import { useJwt } from '@/hooks/useJwt'
import { DialogAddClientToPurposeProps } from '@/types/dialog.types'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AutocompleteMultiple } from '../shared/ReactHookFormInputs'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'

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
  const { closeDialog } = useDialog()
  const { mutateAsync: addClient } = PurposeMutations.useAddClient()

  const { jwt } = useJwt()
  const formMethods = useForm<AddClientToPurposeFormValues>({
    defaultValues: {
      selectedClients: [],
    },
  })

  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  const { data: allClients = [], isLoading: isLoadingClients } = ClientQueries.useGetList(
    {
      kind: 'CONSUMER',
      consumerId: jwt?.organizationId,
    },
    { suspense: false }
  )

  const options = React.useMemo(() => {
    if (!purpose) return []
    const clientAlreadyInPurpose = purpose.clients
    const availableClients = allClients.filter(
      (client) => !clientAlreadyInPurpose.some(({ id }) => client.id === id)
    )

    return availableClients.map((client) => ({ label: client.name, value: client.id }))
  }, [purpose, allClients])

  const onSubmit = ({ selectedClients }: AddClientToPurposeFormValues) => {
    Promise.all(
      selectedClients.map((selectedClient) => addClient({ clientId: selectedClient, purposeId }))
    ).then(closeDialog)
  }

  const selectedClients = formMethods.watch('selectedClients')

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle>{t('title')}</DialogTitle>

          <DialogContent>
            <Box sx={{ mt: 3 }}>
              <AutocompleteMultiple
                focusOnMount
                label={t('content.autocompleteLabel')}
                sx={{ mt: 6, mb: 0 }}
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
