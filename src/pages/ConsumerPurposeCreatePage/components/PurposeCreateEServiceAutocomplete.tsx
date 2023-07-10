import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { CatalogEService } from '@/api/api.generatedTypes'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const selectedEServiceRef = React.useRef<CatalogEService | undefined>(undefined)
  const hasSetFirstEService = React.useRef(false)

  const { setValue } = useFormContext()
  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  // function formatAutocompleteOptionLabel(eservice: CatalogEService) {
  //   return `${eservice.name} ${t('edit.eserviceProvider')} ${eservice.producer.name}`
  // }

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
   */
  function getQ() {
    let result = eserviceAutocompleteTextInput

    if (
      selectedEServiceRef.current &&
      eserviceAutocompleteTextInput === selectedEServiceRef.current.name
    ) {
      result = ''
    }

    return result
  }

  const { data, isInitialLoading } = EServiceQueries.useGetCatalogList(
    {
      q: getQ(),
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    },
    {
      suspense: false,
      onSuccess(eservices) {
        if (!hasSetFirstEService.current && eservices.results.length > 0) {
          setValue('eserviceId', eservices.results[0].id)
          selectedEServiceRef.current = eservices.results[0]
          hasSetFirstEService.current = true
        }
      },
    }
  )

  const eservices = data?.results ?? []
  const autocompleteOptions = (eservices ?? []).map((eservice) => ({
    label: eservice.name,
    value: eservice.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isInitialLoading}
      name="eserviceId"
      label={t('create.eserviceField.label')}
      options={autocompleteOptions}
      onValueChange={(value) => {
        selectedEServiceRef.current = eservices.find((eservice) => eservice.id === value?.value)
      }}
      onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
    />
  )
}
