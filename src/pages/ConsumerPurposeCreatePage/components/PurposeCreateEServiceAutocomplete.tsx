import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { CatalogEService, CompactEService } from '@/api/api.generatedTypes'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { AuthHooks } from '@/api/auth'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const selectedEServiceRef = React.useRef<CatalogEService | CompactEService | undefined>(undefined)
  const hasSetFirstEService = React.useRef(false)

  const { jwt } = AuthHooks.useJwt()

  const { setValue, watch } = useFormContext<PurposeCreateFormValues>()
  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  const formatAutocompleteOptionLabel = React.useCallback(
    (eservice: CatalogEService | CompactEService) => {
      return `${eservice.name} ${t('edit.eserviceProvider')} ${eservice.producer.name}`
    },
    [t]
  )

  const selectedEServiceId = watch('eservice')?.id
  const selectedConsumerId = watch('consumerId')

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

  const { data: eservices = [], isLoading: isEServiceLoading } = useQuery({
    ...EServiceQueries.getCatalogList({
      q: getQ(),
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    }),
    enabled: selectedConsumerId === jwt?.organizationId,
    select: (e) => e.results,
  })

  const { data: delegatedEServices = [], isLoading: isDelegatedEServiceLoading } = useQuery({
    ...DelegationQueries.getConsumerDelegatedEservices({
      q: getQ(),
      delegatorId: selectedConsumerId,
      limit: 50,
      offset: 0,
    }),
    enabled: selectedConsumerId !== jwt?.organizationId,
    select: (e) => e.results,
  })

  const eservicesList = selectedConsumerId === jwt?.organizationId ? eservices : delegatedEServices

  React.useEffect(() => {
    if (!selectedEServiceId && !hasSetFirstEService.current && eservicesList.length > 0) {
      setValue('eservice', eservicesList[0])
      setEserviceAutocompleteTextInput(formatAutocompleteOptionLabel(eservicesList[0]))
      selectedEServiceRef.current = eservicesList[0]
      hasSetFirstEService.current = true
    }
  }, [
    selectedEServiceId,
    setValue,
    formatAutocompleteOptionLabel,
    setEserviceAutocompleteTextInput,
    eservicesList,
  ])

  const autocompleteOptions = (eservicesList ?? []).map((eservice) => ({
    label: formatAutocompleteOptionLabel(eservice),
    value: eservice,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isEServiceLoading || isDelegatedEServiceLoading}
      name="eservice"
      label={t('create.eserviceField.label')}
      infoLabel={t('create.eserviceField.infoLabel')}
      options={autocompleteOptions}
      onValueChange={(value) => {
        selectedEServiceRef.current = eservicesList.find(
          (eservice) => eservice.id === value?.value.id
        )
      }}
      onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
    />
  )
}
