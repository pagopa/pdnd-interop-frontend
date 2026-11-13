import type { GetCatalogPurposeTemplatesParams, TargetTenantKind } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { SectionContainer } from '@/components/layout/containers'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { useParams } from '@/router'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

const Recipient: TargetTenantKind[] = ['PA', 'PRIVATE']

const PurposeTemplatesTab = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'consumer.detail.purposeTemplates' })

  const { eserviceId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const [creatorsAutocompleteInput, setCreatorsAutocompleteInput] = useAutocompleteTextInput()

  const { data: creators = [] } = useQuery({
    ...EServiceQueries.getProducers({ offset: 0, limit: 50, q: creatorsAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { filters, ...handlers } = useFilters<
    Omit<GetCatalogPurposeTemplatesParams, 'limit' | 'offset' | 'eserviceIds'>
  >([
    {
      name: 'q',
      label: t('filters.name.label'),
      type: 'freetext',
    },
    {
      name: 'creatorIds',
      label: t('filters.creator.label'),
      type: 'autocomplete-multiple',
      options: creators,
      onTextInputChange: setCreatorsAutocompleteInput,
    },
    {
      name: 'targetTenantKind',
      label: t('filters.recipient.label'),
      type: 'autocomplete-single',
      options: Recipient.map((r) => ({ label: t(`filters.recipient.options.${r}`), value: r })),
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({
    limit: 10,
    limitOptions: [10, 24, 36],
  })

  // Ensure eserviceId is always present in query params
  const queryParams: GetCatalogPurposeTemplatesParams = {
    ...paginationParams,
    ...filters,
    eserviceIds: [eserviceId],
  }

  const { data } = useQuery({
    ...PurposeTemplateQueries.getCatalogPurposeTemplates(queryParams),
    enabled: Boolean(eserviceId),
    placeholderData: keepPreviousData,
  })

  return (
    <SectionContainer
      sx={{
        backgroundColor: 'transparent',
      }}
      title={t('title')}
      description={t('description')}
    >
      <FiltersSection filters={filters} {...handlers} results={data?.pagination.totalCount} />
      Purpose Template
    </SectionContainer>
  )
}

export default PurposeTemplatesTab
