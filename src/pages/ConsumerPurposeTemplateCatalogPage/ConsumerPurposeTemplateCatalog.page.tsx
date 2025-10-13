import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import type { FilterOption } from '@pagopa/interop-fe-commons'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import type {
  GetCatalogPurposeTemplatesParams,
  PurposeTemplateState,
} from '@/api/api.generatedTypes'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import {
  PurposeTemplateCatalogGrid,
  PurposeTemplateCatalogGridSkeleton,
} from './components/PurposeTemplateCatalogGrid'
import { EServiceQueries } from '@/api/eservice'

const ConsumerPurposeTemplateCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposeTemplatesCatalog' })
  const { t: tPurposeTemplate } = useTranslation('purposeTemplate', { keyPrefix: 'list.filters' })

  const [purposeTemplateCreatorsAutocompleteInput, setPurposeTemplateCreatorsAutocompleteInput] =
    useAutocompleteTextInput()

  const [eservicesAutocompleteInput, setEServicesAutocompleteInput] = useAutocompleteTextInput()

  const templateCreatorsOptions: FilterOption[] = [] //TODO: REMOVE THIS AND UNCOMMENT THE FOLLOWING QUERY WHEN THE API WILL BE READY
  /*const { data: templateCreatorsOptions = [] } = []  useQuery({
    ...PurposeTemplateQueries.getTODOAPICALL({
      offset: 0,
      limit: 50,
      q: purposeTemplateCreatorsAutocompleteInput
        ? purposeTemplateCreatorsAutocompleteInput
        : undefined,
    }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })*/

  const { data: eservicesOptions = [] } = useQuery({
    ...EServiceQueries.getCatalogList({
      q: eservicesAutocompleteInput,
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 12 })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetCatalogPurposeTemplatesParams, 'limit' | 'offset'>
  >([
    {
      name: 'q',
      label: tPurposeTemplate('nameField.label'),
      type: 'freetext',
    },
    {
      name: 'creatorIds',
      label: tPurposeTemplate('creatorField.label'),
      type: 'autocomplete-multiple',
      options: templateCreatorsOptions,
      onTextInputChange: setPurposeTemplateCreatorsAutocompleteInput,
    },
    {
      name: 'eserviceIds',
      label: tPurposeTemplate('eserviceField.label'),
      type: 'autocomplete-multiple',
      options: eservicesOptions,
      onTextInputChange: setEServicesAutocompleteInput,
    },
    {
      name: 'targetTenantKind',
      label: tPurposeTemplate('targetTenantKindField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: tPurposeTemplate('targetTenantKindField.values.labelPA'), value: 'PA' },
        { label: tPurposeTemplate('targetTenantKindField.values.labelNotPA'), value: 'PRIVATE' }, //TODO: TO CHECK IF THIS FILTER WORKS IN THE RIGHT WAY
      ],
    },
  ])

  const queryParams = { ...paginationParams, ...filtersParams }

  const { data } = useQuery({
    ...PurposeTemplateQueries.getCatalogPurposeTemplates(queryParams),
    placeholderData: keepPreviousData,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
      <PurposeTemplateCatalogWrapper params={queryParams} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const PurposeTemplateCatalogWrapper: React.FC<{ params: { limit: number; offset: number } }> = ({
  params,
}) => {
  const { data, isFetching } = useQuery(PurposeTemplateQueries.getCatalogPurposeTemplates(params))

  if (!data && isFetching) return <PurposeTemplateCatalogGridSkeleton />
  return <PurposeTemplateCatalogGrid purposeTemplates={data?.results} />
}

export default ConsumerPurposeTemplateCatalogPage
