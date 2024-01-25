import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { CatalogEService, CompactPurposeEService } from '@/api/api.generatedTypes'

type DialogClonePurposeEServiceAutocompleteProps = {
  preselectedEservice: CompactPurposeEService
}

export const DialogClonePurposeEServiceAutocomplete: React.FC<
  DialogClonePurposeEServiceAutocompleteProps
> = ({ preselectedEservice }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogClonePurpose',
  })
  const selectedEServiceRef = React.useRef<CatalogEService | CompactPurposeEService | undefined>(
    preselectedEservice
  )
  const hasSetFirstEService = React.useRef(true)

  const { setValue, watch } = useFormContext()
  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput(preselectedEservice.name)

  function formatAutocompleteOptionLabel(eservice: CatalogEService | CompactPurposeEService) {
    return `${eservice.name} ${t('eserviceField.eserviceProvider')} ${eservice.producer.name}`
  }

  const selectedEServiceId = watch('eserviceId')

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
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
      mode: 'DELIVER',
      limit: 50,
      offset: 0,
    },
    {
      suspense: false,
      onSuccess(eservices) {
        if (!selectedEServiceId && !hasSetFirstEService.current && eservices.results.length > 0) {
          setValue('eserviceId', eservices.results[0].id)
          selectedEServiceRef.current = eservices.results[0]
          hasSetFirstEService.current = true
        }
      },
    }
  )

  const eservices = data?.results ?? []
  const autocompleteOptions = (eservices ?? []).map((eservice) => ({
    label: formatAutocompleteOptionLabel(eservice),
    value: eservice.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isInitialLoading}
      name="eserviceId"
      label={t('eserviceField.label')}
      options={autocompleteOptions}
      onValueChange={(value) => {
        selectedEServiceRef.current = eservices.find((eservice) => eservice.id === value?.value)
      }}
      onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
    />
  )
}
