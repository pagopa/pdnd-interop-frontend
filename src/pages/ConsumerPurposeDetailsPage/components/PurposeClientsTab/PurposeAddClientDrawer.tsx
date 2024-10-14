import type { CompactClient } from '@/api/api.generatedTypes'
import { ClientQueries } from '@/api/client'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type PurposeAddClientFormValues = {
  selectedClient: CompactClient | undefined
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
    selectedClient: undefined,
  }
  const formMethods = useForm({
    defaultValues,
  })

  const selectedClient = formMethods.watch('selectedClient')
  const isAnyClientSelected = Boolean(selectedClient)

  const onSubmit = ({ selectedClient }: PurposeAddClientFormValues) => {
    onClose()
    if (!selectedClient) return
    addClient({ clientId: selectedClient.id, purposeId: purposeId })
  }

  const { data: clientIdsAlreadyInPurpose, isFetching: isLoadingPurpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    select: (d) => d.clients.map((d) => d.id),
  })

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
   */
  function getClientQ() {
    let result = clientSearchParam

    if (selectedClient && clientSearchParam === selectedClient.name) {
      result = ''
    }

    return result
  }

  const { data, isFetching: isLoadingClients } = useQuery(
    ClientQueries.getList({
      kind: 'CONSUMER',
      q: getClientQ(),
      offset: 0,
      limit: 50,
    })
  )

  const options = React.useMemo(() => {
    if (!clientIdsAlreadyInPurpose) return []
    const clients = data?.results ?? []
    const availableClients = clients.filter(
      (client) => !clientIdsAlreadyInPurpose.some((id) => client.id === id)
    )
    return availableClients.map((client) => ({ label: client.name, value: client }))
  }, [clientIdsAlreadyInPurpose, data])

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)

    setClientSearchParam('')
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={t('title')}
        buttonAction={{
          label: t('actions.confirmLabel'),
          disabled: !isAnyClientSelected,
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Box sx={{ mt: 3 }}>
          <RHFAutocompleteSingle
            focusOnMount
            label={t('content.autocompleteLabel')}
            sx={{ mt: 6, mb: 0 }}
            onInputChange={(_, value) => setClientSearchParam(value)}
            name="selectedClient"
            rules={{ required: true }}
            options={options}
            loading={isLoadingPurpose || isLoadingClients}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
