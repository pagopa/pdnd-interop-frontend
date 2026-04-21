import React, { useEffect } from 'react'
import { FormControl } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { RHFAutocompleteSingle, RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { KeychainQueries } from '@/api/keychain'
import { useTranslation } from 'react-i18next'
import { VoucherInstructionsGeneralFormAlertProducer } from '../alerts/VoucherInstructionsGeneralFormAlertProducer'

interface VoucherProducerSimulationSectionForm {
  producerKeychainId: string | null
  eserviceId: string | null
  publicKeyId: string | null
}

export const VoucherProducerSimulationSection: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { watch } = useFormContext<VoucherProducerSimulationSectionForm>()

  const producerKeychainId = watch('producerKeychainId') || ''

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

  const { data: keys, isFetching: isFetchingPublicKey } = useQuery({
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
    if (!producerKeychainId) {
      setSearch('')
    }
  }, [producerKeychainId, search, setSearch])

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
          disabled={!producerKeychainId || isFetchingProducerKeychains}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <RHFSelect
          name="publicKeyId"
          label={t('generalForm.keySelectInput.label')}
          options={(keys?.keys ?? []).map((k) => ({
            label: k.name,
            value: k.keyId,
          }))}
          rules={{ required: true }}
          disabled={
            !eservices || isFetchingProducerKeychains || isFetchingEservices || isFetchingPublicKey
          }
        />
      </FormControl>

      <VoucherInstructionsGeneralFormAlertProducer
        producerKeychain={eservices}
        producerKeychainId={producerKeychainId}
        isFetchingPublicKey={isFetchingPublicKey}
        isFetchingEservices={isFetchingEservices}
        keys={keys?.keys}
        eservices={eservices?.eservices}
      />
    </>
  )
}
