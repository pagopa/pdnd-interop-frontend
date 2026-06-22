import type { CatalogEServiceTemplate, DelegationKind } from '@/api/api.generatedTypes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'

type DelegationCreateEServiceFromTemplateAutocompleteProps = {
  delegationKind: DelegationKind
  handleTemplateNameAutocompleteChange: (eserviceTemplateName: string) => void
}

export const DelegationCreateEServiceFromTemplateAutocomplete: React.FC<
  DelegationCreateEServiceFromTemplateAutocompleteProps
> = ({ delegationKind, handleTemplateNameAutocompleteChange }) => {
  const { t } = useTranslation('party')
  const selectedEServiceTemplateRef = React.useRef<CatalogEServiceTemplate | undefined>(undefined)

  const [eserviceTemplateAutocompleteTextInput, setEserviceTemplateAutocompleteTextInput] =
    useAutocompleteTextInput()

  const formatAutocompleteOptionLabel = React.useCallback(
    (eserviceTemplate: CatalogEServiceTemplate) => {
      return match(delegationKind)
        .with('DELEGATED_CONSUMER', () => {
          if (!('producer' in eserviceTemplate)) return eserviceTemplate.name
          return `${eserviceTemplate.name} ${t(
            'delegations.create.eserviceField.eserviceNameLabel'
          )} ${eserviceTemplate.producer}`
        })
        .with('DELEGATED_PRODUCER', () => {
          return eserviceTemplate.name
        })
        .exhaustive()
    },
    [delegationKind, t]
  )

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected eservice name.
   */
  function getQ() {
    let result = eserviceTemplateAutocompleteTextInput

    if (
      selectedEServiceTemplateRef.current &&
      eserviceTemplateAutocompleteTextInput ===
        formatAutocompleteOptionLabel(selectedEServiceTemplateRef.current)
    ) {
      result = ''
    }

    return result
  }

  const { data: catalogEservicesTemplates = [], isLoading: isLoadingCatalogEservicesTemplates } =
    useQuery({
      ...EServiceTemplateQueries.getProviderEServiceTemplatesCatalogList({
        q: getQ(),
        limit: 50,
        offset: 0,
        personalData: 'DEFINED',
      }),
      select: (d) => d.results ?? [],
    })

  const autocompleteOptions = catalogEservicesTemplates.map((eserviceTemplate) => ({
    label: formatAutocompleteOptionLabel(eserviceTemplate),
    value: eserviceTemplate.id,
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
      onInputChange={(_, value) => setEserviceTemplateAutocompleteTextInput(value)}
      rules={{ required: true }}
    />
  )
}
