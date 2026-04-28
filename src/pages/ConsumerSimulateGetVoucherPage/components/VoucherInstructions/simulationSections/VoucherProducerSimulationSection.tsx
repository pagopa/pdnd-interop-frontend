import React, { useEffect } from 'react'
import { FormControl } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { RHFAutocompleteSingle, RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { KeychainQueries } from '@/api/keychain'
import { useTranslation } from 'react-i18next'
import { VoucherInstructionsGeneralFormAlertProducer } from '../alerts/VoucherInstructionsGeneralFormAlertProducer'
import {
  INTERACTION_TYPE,
  type VoucherInstructionsGeneralFormValues,
} from '../VoucherInstructionsGeneralForm'
import { VoucherInstructionsAsyncExchangeSelect } from '../VoucherInstructionsGeneralForm/VoucherInstructionsAsyncExchangeSelect'

type VoucherProducerSimulationSectionForm = Pick<
  VoucherInstructionsGeneralFormValues,
  'producerKeychainId' | 'eserviceId' | 'publicKeyId' | 'interactionType'
>

export const VoucherProducerSimulationSection: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { watch, setValue } = useFormContext<VoucherProducerSimulationSectionForm>()

  const producerKeychainId = watch('producerKeychainId') || ''
  const interactionType = watch('interactionType')

  const [search, setSearch] = useAutocompleteTextInput('')

  const { data: keychains, isFetching: isFetchingProducerKeychains } = useQuery({
    ...KeychainQueries.getKeychainsList({
      q: search,
      offset: 0,
      limit: 50,
    }),
  })

  const { data: eservices, isFetching: isFetchingEservices } = useQuery({
    ...KeychainQueries.getSingle(producerKeychainId),
    enabled: Boolean(producerKeychainId),
  })

  const { data: publicKeys, isFetching: isFetchingPublicKey } = useQuery({
    ...KeychainQueries.getProducerKeychainKeysList({
      producerKeychainId,
      offset: 0,
      limit: 50,
    }),
    enabled: Boolean(producerKeychainId),
  })

  const options = (keychains?.results ?? []).map((k) => ({
    label: k.name,
    value: k.id,
  }))

  useEffect(() => {
    if (producerKeychainId && publicKeys?.keys && publicKeys.keys.length === 1) {
      setValue('publicKeyId', publicKeys.keys[0].keyId)
    }
  }, [publicKeys?.keys, producerKeychainId, setValue])

  useEffect(() => {
    if (!producerKeychainId) {
      setSearch('')
    }
  }, [producerKeychainId, setSearch])

  const hasEservices = Boolean(eservices?.eservices?.length)
  const hasPublicKeys = Boolean(publicKeys?.keys?.length)

  const isEservicesDisabled =
    !producerKeychainId || isFetchingProducerKeychains || isFetchingEservices || !hasEservices

  const isPublicKeysDisabled =
    !producerKeychainId || isFetchingProducerKeychains || isFetchingPublicKey || !hasPublicKeys

  return (
    <>
      <FormControl fullWidth>
        <RHFAutocompleteSingle
          name="producerKeychainId"
          rules={{ required: true }}
          label={t('generalForm.producerKeychain.label')}
          onInputChange={(_, value) => setSearch(value)}
          options={options}
          loading={isFetchingProducerKeychains}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <RHFSelect
          name="eserviceId"
          label={t('generalForm.eservice.label')}
          options={(eservices?.eservices ?? []).map((e) => ({
            label: e.name,
            value: e.id,
          }))}
          rules={{ required: true }}
          disabled={isEservicesDisabled}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <RHFSelect
          name="publicKeyId"
          label={t('generalForm.keySelectInput.label')}
          options={(publicKeys?.keys ?? []).map((k) => ({
            label: k.name,
            value: k.keyId,
          }))}
          rules={{ required: true }}
          disabled={isPublicKeysDisabled}
        />
      </FormControl>

      {interactionType === INTERACTION_TYPE.ASYNC && <VoucherInstructionsAsyncExchangeSelect />}

      <VoucherInstructionsGeneralFormAlertProducer
        producerKeychain={eservices}
        producerKeychainId={producerKeychainId}
        isFetchingPublicKey={isFetchingPublicKey}
        isFetchingEservices={isFetchingEservices}
        publicKeys={publicKeys?.keys}
        eservices={eservices?.eservices}
      />
    </>
  )
}
