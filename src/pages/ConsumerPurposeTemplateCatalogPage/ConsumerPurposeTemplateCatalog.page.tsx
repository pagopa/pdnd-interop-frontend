import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import type {
  CatalogEService,
  CatalogPurposeTemplate,
  GetCatalogPurposeTemplatesParams,
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

  const { data: templateCreatorsOptions = [] } = useQuery({
    ...PurposeTemplateQueries.getCatalogPurposeTemplates({
      offset: 0,
      limit: 50,
      q: purposeTemplateCreatorsAutocompleteInput
        ? purposeTemplateCreatorsAutocompleteInput
        : undefined,
    }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((purposeTemplate: CatalogPurposeTemplate) => ({
        label: purposeTemplate.creator.name,
        value: purposeTemplate.creator.id,
      })),
  })

  const { data: eservicesOptions = [] } = useQuery({
    ...EServiceQueries.getCatalogList({
      q: eservicesAutocompleteInput,
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((eservice: CatalogEService) => ({
        label: eservice.name,
        value: eservice.id,
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

  const queryParams: GetCatalogPurposeTemplatesParams = { ...paginationParams, ...filtersParams }

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

const PurposeTemplateCatalogWrapper: React.FC<{ params: GetCatalogPurposeTemplatesParams }> = ({
  params,
}) => {
  const { data, isFetching } = useQuery(PurposeTemplateQueries.getCatalogPurposeTemplates(params))

  if (!data && isFetching) return <PurposeTemplateCatalogGridSkeleton />
  return <PurposeTemplateCatalogGrid purposeTemplates={data?.results} />
}

export default ConsumerPurposeTemplateCatalogPage
