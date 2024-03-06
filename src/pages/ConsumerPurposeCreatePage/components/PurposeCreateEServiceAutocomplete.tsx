import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { CatalogEService } from '@/api/api.generatedTypes'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const selectedEServiceRef = React.useRef<CatalogEService | undefined>(undefined)
  const hasSetFirstEService = React.useRef(false)

  const { setValue, watch } = useFormContext<PurposeCreateFormValues>()
  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  function formatAutocompleteOptionLabel(eservice: CatalogEService) {
    return `${eservice.name} ${t('edit.eserviceProvider')} ${eservice.producer.name}`
  }

  const selectedEServiceId = watch('eservice')?.id

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected eservice name.
   */
  function getQ() {
    let result = eserviceAutocompleteTextInput

    if (
      selectedEServiceRef.current &&
      eserviceAutocompleteTextInput === formatAutocompleteOptionLabel(selectedEServiceRef.current)
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
        if (!selectedEServiceId && !hasSetFirstEService.current && eservices.results.length > 0) {
          setValue('eservice', eservices.results[0])
          setEserviceAutocompleteTextInput(formatAutocompleteOptionLabel(eservices.results[0]))
          selectedEServiceRef.current = eservices.results[0]
          hasSetFirstEService.current = true
        }
      },
    }
  )

  const eservices = data?.results ?? []
  const autocompleteOptions = (eservices ?? []).map((eservice) => ({
    label: formatAutocompleteOptionLabel(eservice),
    value: eservice,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isInitialLoading}
      name="eservice"
      label={t('create.eserviceField.label')}
      options={autocompleteOptions}
      onValueChange={(value) => {
        selectedEServiceRef.current = eservices.find((eservice) => eservice.id === value?.value.id)
      }}
      onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
    />
  )
}
