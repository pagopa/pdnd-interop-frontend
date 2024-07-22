import { ClientQueries } from '@/api/client'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteMultiple } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type PurposeAddClientFormValues = {
  selectedClients: Array<string>
}

type PurposeAddClientDrawerProps = {
  purposeId: string
  isOpen: boolean
  onClose: VoidFunction
}

export const PurposeAddClientDrawer: React.FC<PurposeAddClientDrawerProps> = ({
  purposeId,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'drawerAddClientToPurpose',
    useSuspense: false,
  })

  const { mutateAsync: addClient } = PurposeMutations.useAddClient()
  const [clientSearchParam, setClientSearchParam] = useAutocompleteTextInput()

  const defaultValues: PurposeAddClientFormValues = {
    selectedClients: [],
  }
  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = ({ selectedClients }: PurposeAddClientFormValues) => {
    Promise.all(
      selectedClients.map((selectedClient) =>
        addClient({ clientId: selectedClient, purposeId: purposeId })
      )
    ).then(onClose)
  }

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

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  const selectedClients = formMethods.watch('selectedClients')
  let isSelectedClient = false

  if (selectedClients.length === 0) {
    isSelectedClient = true
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={t('title')}
        buttonAction={{
          label: t('actions.confirmLabel'),
          disabled: isSelectedClient,
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
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
      </Drawer>
    </FormProvider>
  )
}
