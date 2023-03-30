import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')

  const { watch, setValue } = useFormContext()
  const selectedEService = watch('eserviceId')
  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  const { data, isInitialLoading } = EServiceQueries.useGetCatalogList(
    {
      q: eserviceAutocompleteTextInput,
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    },
    {
      suspense: false,
      onSuccess(eservices) {
        if (!selectedEService && eservices.results.length > 0) {
          setValue('eserviceId', eservices.results[0].id)
        }
      },
    }
  )

  const eservices = data?.results ?? []

  const autocompleteOptions = (eservices ?? []).map((eservice) => ({
    label: `${eservice.name} ${t('edit.eserviceProvider')} ${eservice.producer.name}`,
    value: eservice.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isInitialLoading}
      name="eserviceId"
      label={t('create.eserviceField.label')}
      options={autocompleteOptions}
      onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
    />
  )
}
