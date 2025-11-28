import { EServiceQueries } from '@/api/eservice'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import type { GetCatalogPurposeTemplatesParams } from '@/api/api.generatedTypes'
import {
  ConsumerLinkedPurposeTemplatesTable,
  ConsumerLinkedPurposeTemplatesTableSkeleton,
} from './ConsumerLinkedPurposeTemplatesTable'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useParams } from '@/router'

const ConsumerLinkedPurposeTemplatesTab: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.linkedPurposeTemplatesTab' })
  const { eserviceId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const [creatorsAutocompleteInput, setCreatorsAutocompleteInput] = useAutocompleteTextInput()

  const { data: creatorsOptions = [] } = useQuery({
    ...EServiceQueries.getProducers({ offset: 0, limit: 50, q: creatorsAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetCatalogPurposeTemplatesParams, 'limit' | 'offset' | 'eserviceIds'>
  >([
    { name: 'q', label: t('filters.purposeTemplateNameField.label'), type: 'freetext' },
    {
      name: 'creatorIds',
      label: t('filters.creatorNameField.label'),
      type: 'autocomplete-multiple',
      options: creatorsOptions,
      onTextInputChange: setCreatorsAutocompleteInput,
    },
    {
      name: 'targetTenantKind',
      label: t('filters.targetTenantKindField.label'),
      type: 'autocomplete-single',
      options: [
        { label: t('filters.targetTenantKindField.values.labelPA'), value: 'PA' },
        { label: t('filters.targetTenantKindField.values.labelNotPA'), value: 'PRIVATE' },
      ],
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  // Ensure eserviceId is always present in query params
  const queryParams: GetCatalogPurposeTemplatesParams = {
    ...paginationParams,
    ...filtersParams,
    eserviceIds: [eserviceId],
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...PurposeTemplateQueries.getCatalogPurposeTemplates(queryParams),
    enabled: Boolean(eserviceId),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  const descriptionLabel = t('description')
    .split('\n')
    .map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ))

  return (
    <>
      <SectionContainer
        title={t('title')}
        description={descriptionLabel}
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        <Filters {...filtersHandlers} />
        <ConsumerLinkedPurposeTemplatesTableWrapper params={queryParams} />
        <Pagination {...paginationProps} totalPages={totalPageCount} />
      </SectionContainer>
    </>
  )
}

const ConsumerLinkedPurposeTemplatesTableWrapper: React.FC<{
  params: GetCatalogPurposeTemplatesParams
}> = ({ params }) => {
  const { data, isFetching } = useQuery(PurposeTemplateQueries.getCatalogPurposeTemplates(params))

  if (!data && isFetching) return <ConsumerLinkedPurposeTemplatesTableSkeleton />
  return <ConsumerLinkedPurposeTemplatesTable purposeTemplates={data?.results ?? []} />
}

export default ConsumerLinkedPurposeTemplatesTab
