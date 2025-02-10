import type { CatalogEService, DelegationKind, ProducerEService } from '@/api/api.generatedTypes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { EServiceQueries } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'

type DelegationCreateEServiceAutocompleteProps = {
  delegationKind: DelegationKind
}

export const DelegationCreateEServiceAutocomplete: React.FC<
  DelegationCreateEServiceAutocompleteProps
> = ({ delegationKind }) => {
  const { t } = useTranslation('party')
  const selectedEServiceRef = React.useRef<CatalogEService | ProducerEService | undefined>(
    undefined
  )

  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  const formatAutocompleteOptionLabel = React.useCallback(
    (eservice: CatalogEService | ProducerEService) => {
      return match(delegationKind)
        .with('DELEGATED_CONSUMER', () => {
          if (!('producer' in eservice)) return eservice.name
          return `${eservice.name} ${t('delegations.create.eserviceField.eserviceNameLabel')} ${
            eservice.producer.name
          }`
        })
        .with('DELEGATED_PRODUCER', () => {
          return eservice.name
        })
        .exhaustive()
    },
    [delegationKind, t]
  )

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

  const { data: producerEservice = [], isLoading: isLoadingProducerEservices } = useQuery({
    ...EServiceQueries.getProviderList({
      q: getQ(),
      limit: 50,
      offset: 0,
      delegated: false,
    }),
    enabled: delegationKind === 'DELEGATED_PRODUCER',
    select: (d) => d.results ?? [],
  })

  const { data: catalogEservices = [], isLoading: isLoadingCatalogEservices } = useQuery({
    ...EServiceQueries.getCatalogList({
      q: getQ(),
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
      isConsumerDelegable: true,
    }),
    enabled: delegationKind === 'DELEGATED_CONSUMER',
    select: (d) => d.results ?? [],
  })

  const eservices = delegationKind === 'DELEGATED_CONSUMER' ? catalogEservices : producerEservice

  const autocompleteOptions = eservices.map((eservice) => ({
    label: formatAutocompleteOptionLabel(eservice),
    value: eservice.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isLoadingCatalogEservices || isLoadingProducerEservices}
      name="eserviceId"
      label={t('delegations.create.eserviceField.label')}
      infoLabel={t('delegations.create.eserviceField.infoLabelAutocomplete')}
      options={autocompleteOptions}
      onValueChange={(value) => {
        selectedEServiceRef.current = eservices.find((eservice) => eservice.id === value?.value)
      }}
      onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
      rules={{ required: true }}
    />
  )
}
