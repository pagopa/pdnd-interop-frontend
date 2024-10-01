import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { CatalogEService, CompactPurposeEService } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'

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

  const formatAutocompleteOptionLabel = React.useCallback(
    (eservice: CatalogEService | CompactPurposeEService) => {
      return `${eservice.name} ${t('eserviceField.eserviceProvider')} ${eservice.producer.name}`
    },
    [t]
  )

  const { setValue, watch } = useFormContext()
  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput(formatAutocompleteOptionLabel(preselectedEservice))

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

  const { data, isLoading } = useQuery(
    EServiceQueries.getCatalogList({
      q: getQ(),
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      mode: 'DELIVER',
      limit: 50,
      offset: 0,
    })
  )

  React.useEffect(() => {
    if (!selectedEServiceId && !hasSetFirstEService.current && data && data?.results.length > 0) {
      setValue('eserviceId', data.results[0].id)
      setEserviceAutocompleteTextInput(formatAutocompleteOptionLabel(data.results[0]))
      selectedEServiceRef.current = data.results[0]
      hasSetFirstEService.current = true
    }
  }, [
    data,
    selectedEServiceId,
    setValue,
    setEserviceAutocompleteTextInput,
    formatAutocompleteOptionLabel,
  ])

  const eservices = data?.results ?? []
  const autocompleteOptions = (eservices ?? []).map((eservice) => ({
    label: formatAutocompleteOptionLabel(eservice),
    value: eservice.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isLoading}
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
