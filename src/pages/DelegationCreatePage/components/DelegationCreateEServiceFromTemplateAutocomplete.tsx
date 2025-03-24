import type {
  CatalogEService,
  CatalogEServiceTemplate,
  DelegationKind,
  ProducerEService,
} from '@/api/api.generatedTypes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { TemplateQueries } from '@/api/template'

type DelegationCreateEServiceFromTemplateAutocompleteProps = {
  delegationKind: DelegationKind
  handleTemplateNameAutocompleteChange: (eserviceTemplateName: string) => void
}

export const DelegationCreateEServiceFromTemplateAutocomplete: React.FC<
  DelegationCreateEServiceFromTemplateAutocompleteProps
> = ({ delegationKind, handleTemplateNameAutocompleteChange }) => {
  const { t } = useTranslation('party')
  const selectedEServiceRef = React.useRef<CatalogEService | ProducerEService | undefined>(
    undefined
  )

  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  const formatAutocompleteOptionLabel = React.useCallback(
    (eservice: CatalogEService | ProducerEService | CatalogEServiceTemplate) => {
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

  const { data: catalogEservicesTemplates = [], isLoading: isLoadingCatalogEservicesTemplates } =
    useQuery({
      ...TemplateQueries.getProviderTemplatesCatalogList({
        q: getQ(),
        limit: 50,
        offset: 0,
      }),
      select: (d) => d.results ?? [],
    })

  const autocompleteOptions = catalogEservicesTemplates.map((eservice) => ({
    label: formatAutocompleteOptionLabel(eservice),
    value: eservice.id,
  }))

  const delegationKindTKey = delegationKind === 'DELEGATED_CONSUMER' ? 'consumer' : 'producer'

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isLoadingCatalogEservicesTemplates}
      name="eserviceId"
      label={t('delegations.create.eserviceField.labelFromTemplate')}
      infoLabel={t(
        `delegations.create.eserviceField.infoLabelAutocompleteFromTemplate.${delegationKindTKey}`
      )}
      options={autocompleteOptions}
      onValueChange={(value) => {
        value && handleTemplateNameAutocompleteChange(value?.label)
      }}
      onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
      rules={{ required: true }}
    />
  )
}
