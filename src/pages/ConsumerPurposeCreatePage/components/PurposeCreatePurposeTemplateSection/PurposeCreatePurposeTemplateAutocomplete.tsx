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
import { ButtonNaked } from '@pagopa/mui-italia'
import { Link } from '@/router'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Stack } from '@mui/system'

type PurposeCreatePurposeTemplateAutocompleteProps = {
  eserviceId: string
  tenantKind?: TenantKind
  handlesPersonalData?: boolean
  purposeTemplateId?: string
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
    eserviceIds: showOnlyLinkedPurposeTemplates ? [eserviceId] : [],
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
    <Stack>
      <RHFAutocompleteSingle
        sx={{ mb: 2 }}
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
      {selectedPurposeTemplateRef.current && (
        <ButtonNaked
          component={Link}
          to="NOT_FOUND" //TODO: replace with purpose template details route when available
          color="primary"
          target="_blank"
          params={undefined}
          endIcon={<OpenInNewIcon />}
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        >
          {t('viewPurposeTemplateBtn')}
        </ButtonNaked>
      )}
    </Stack>
  )
}
