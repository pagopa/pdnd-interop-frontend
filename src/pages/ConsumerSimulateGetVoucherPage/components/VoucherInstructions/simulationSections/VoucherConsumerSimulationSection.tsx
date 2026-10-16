import React, { useEffect } from 'react'
import { CircularProgress, FormControl } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { RHFAutocompleteSingle, RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { ClientQueries } from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { useToastNotification } from '@/stores'
import { VoucherInstructionsGeneralFormAlertConsumer } from '../alerts/VoucherInstructionsGeneralFormAlertConsumer'
import {
  INTERACTION_TYPE,
  type VoucherInstructionsGeneralFormValues,
} from '../VoucherInstructionsGeneralForm'
import { VoucherInstructionsAsyncExchangeSelect } from '../VoucherInstructionsGeneralForm/VoucherInstructionsAsyncExchangeSelect'

type VoucherConsumerSimulationSectionForm = Pick<
  VoucherInstructionsGeneralFormValues,
  'clientId' | 'purposeId' | 'keyId' | 'interactionType'
>

export const VoucherConsumerSimulationSection: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { watch, setValue } = useFormContext<VoucherConsumerSimulationSectionForm>()
  const clientKind = useClientKind()
  const { showToast } = useToastNotification()

  const clientId = watch('clientId') || ''
  const interactionType = watch('interactionType')

  const [clientSearch, setClientSearch] = useAutocompleteTextInput('')

  const { data: clients, isFetching: isFetchingClients } = useQuery({
    ...ClientQueries.getList({
      kind: clientKind,
      q: clientSearch,
      offset: 0,
      limit: 50,
    }),
  })

  const {
    data: client,
    isFetching: isFetchingClient,
    isError: isClientError,
  } = useQuery({
    ...ClientQueries.getSingle(clientId),
    enabled: Boolean(clientId),
    throwOnError: clientKind !== 'CONSUMER',
  })

  const { data: clientKeys, isFetching: isFetchingKeys } = useQuery({
    ...ClientQueries.getAllKeysList({ clientId }),
    enabled: Boolean(clientId),
  })

  const purposes = client?.purposes

  const clientsOptions = React.useMemo(() => {
    return (clients?.results ?? []).map((c) => ({
      label: c.name,
      value: c.id,
    }))
  }, [clients])

  useEffect(() => {
    if (clientKind === 'CONSUMER' && isClientError && !isFetchingClient) {
      showToast(t('generalForm.purposeSelectInput.error'), 'error')
    }
  }, [clientKind, isClientError, isFetchingClient, showToast, t])

  useEffect(() => {
    if (
      clientKind === 'CONSUMER' &&
      clientId &&
      !isFetchingClient &&
      !isClientError &&
      purposes?.length === 1
    ) {
      setValue('purposeId', purposes[0].purposeId)
    }
  }, [clientKind, clientId, isFetchingClient, isClientError, purposes, setValue])

  useEffect(() => {
    if (clientId && clientKeys && clientKeys.length === 1) {
      setValue('keyId', clientKeys[0].keyId)
    }
  }, [clientId, clientKeys, setValue])

  useEffect(() => {
    if (!clientId) {
      setClientSearch('')
    }
  }, [clientId, setClientSearch])

  const hasPurposes = Boolean(purposes?.length)
  const hasClientKeys = Boolean(clientKeys?.length)
  const isPurposeDisabled =
    !clientId || isFetchingClients || isFetchingClient || isClientError || !hasPurposes
  const isClientKeysDisabled = !clientId || isFetchingClients || isFetchingKeys || !hasClientKeys

  return (
    <>
      <FormControl fullWidth>
        <RHFAutocompleteSingle
          name="clientId"
          rules={{ required: true }}
          label={t('generalForm.clientSelectInput.label')}
          onInputChange={(_, value) => setClientSearch(value)}
          options={clientsOptions}
          loading={isFetchingClients}
        />
      </FormControl>

      {clientKind === 'CONSUMER' && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <RHFSelect
            name="purposeId"
            label={t('generalForm.purposeSelectInput.label')}
            options={(purposes ?? []).map((p) => ({
              label: `${p.title} per ${p.eservice.name}`,
              value: p.purposeId,
            }))}
            rules={{ required: true }}
            disabled={isPurposeDisabled}
            endAdornment={
              isFetchingClient ? (
                <CircularProgress
                  size={20}
                  sx={{ mr: 3 }}
                  aria-label={t('generalForm.purposeSelectInput.loading')}
                />
              ) : undefined
            }
          />
        </FormControl>
      )}

      <FormControl fullWidth sx={{ mt: 2 }}>
        <RHFSelect
          name="keyId"
          label={t('generalForm.keySelectInput.label')}
          options={(clientKeys ?? []).map((k) => ({
            label: k.name,
            value: k.keyId,
          }))}
          rules={{ required: true }}
          disabled={isClientKeysDisabled}
        />
      </FormControl>

      {interactionType === INTERACTION_TYPE.ASYNC && <VoucherInstructionsAsyncExchangeSelect />}

      {!isClientError && (
        <VoucherInstructionsGeneralFormAlertConsumer
          client={client}
          clientId={clientId}
          isFetchingClient={isFetchingClient}
          isFetchingKeys={isFetchingKeys}
          purposes={purposes}
          clientKeys={clientKeys}
        />
      )}
    </>
  )
}
