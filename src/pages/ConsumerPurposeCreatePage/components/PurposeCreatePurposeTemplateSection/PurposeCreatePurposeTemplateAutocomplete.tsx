import type {
  CatalogPurposeTemplate,
  GetCatalogPurposeTemplatesParams,
  TenantKind,
} from '@/api/api.generatedTypes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useFormContext, useWatch } from 'react-hook-form'

type PurposeCreatePurposeTemplateAutocompleteProps = {
  eserviceId: string
  tenantKind?: TenantKind
  handlesPersonalData?: boolean
}

export const PurposeCreatePurposeTemplateAutocomplete: React.FC<
  PurposeCreatePurposeTemplateAutocompleteProps
> = ({ eserviceId, tenantKind, handlesPersonalData }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'create.purposeTemplateField.usePurposeTemplateSwitch.selectPurposeTemplate',
  })
  const selectedPurposeTemplateRef = React.useRef<CatalogPurposeTemplate | undefined>(undefined)

  const [purposeTemplateAutocompleteTextInput, setPurposeTemplateAutocompleteTextInput] =
    useAutocompleteTextInput()

  const { control } = useFormContext()
  const showOnlyLinkedPurposeTemplates = useWatch({
    control,
    name: 'showOnlyLinkedPurposeTemplates',
    defaultValue: false,
  })

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected eservice name.
   */
  function getQ() {
    let result = purposeTemplateAutocompleteTextInput

    if (
      selectedPurposeTemplateRef.current &&
      purposeTemplateAutocompleteTextInput === selectedPurposeTemplateRef.current.purposeTitle
    ) {
      result = ''
    }

    return result
  }
  const queryParams: GetCatalogPurposeTemplatesParams = {
    q: getQ(),
    limit: 50,
    offset: 0,
    targetTenantKind: tenantKind,
    handlesPersonalData,
    eserviceIds: [eserviceId],
  }

  const { data: purposeTemplates = [], isLoading: isLoadingPurposeTemplates } = useQuery({
    ...PurposeTemplateQueries.getCatalogPurposeTemplates(queryParams),
    select: (p) => p.results ?? [],
  })

  const autocompleteOptions = purposeTemplates.map((purposeTemplate) => ({
    label: `${purposeTemplate.purposeTitle} - ${purposeTemplate.creator.name}`,
    value: purposeTemplate.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isLoadingPurposeTemplates}
      name="purposeTemplateId"
      label={t('autocompleteLabel')}
      options={autocompleteOptions}
      onValueChange={(value) => {
        selectedPurposeTemplateRef.current = purposeTemplates.find(
          (purposeTemplate) => purposeTemplate.id === value?.value
        )
      }}
      onInputChange={(_, value) => setPurposeTemplateAutocompleteTextInput(value)}
      rules={{ required: true }}
    />
  )
}
