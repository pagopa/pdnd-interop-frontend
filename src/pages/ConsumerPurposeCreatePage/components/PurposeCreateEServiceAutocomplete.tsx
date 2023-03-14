import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useJwt } from '@/hooks/useJwt'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { jwt } = useJwt()

  const { watch, setValue } = useFormContext()
  const selectedEService = watch('eserviceId')

  // This must be replaced by the EServiceQueries.useGetCatalogList
  // waiting for agreementStates implementation.
  const { data: eservices = [], isInitialLoading } = EServiceQueries.useGetListFlat(
    {
      callerId: jwt?.organizationId,
      consumerId: jwt?.organizationId,
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      state: 'PUBLISHED',
    },
    {
      suspense: false,
      onSuccess(eservices) {
        if (!selectedEService && eservices.length > 0) {
          setValue('eserviceId', eservices[0].id)
        }
      },
    }
  )

  const autocompleteOptions = (eservices ?? []).map((eservice) => ({
    label: `${eservice.name} ${t('edit.eserviceProvider')} ${eservice.producerName}`,
    value: eservice.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isInitialLoading}
      name="eserviceId"
      label={t('create.eserviceField.label')}
      options={autocompleteOptions}
    />
  )
}
