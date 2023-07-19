import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import type { EServiceDescriptorState, GetEServicesCatalogParams } from '@/api/api.generatedTypes'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list.filters' })

  const [producersAutocompleteInput, setProducersAutocompleteInput] = useAutocompleteTextInput()

  const { data: producers } = EServiceQueries.useGetProducers(
    // PIN-3646 - Temporary avoid passing an empty string as a query parameter
    { offset: 0, limit: 50, q: producersAutocompleteInput },
    // PIN-3646 - Temporarly avoid fetching producers if the autocomplete text is less than 3 chars
    { suspense: false, keepPreviousData: true, enabled: producersAutocompleteInput.length > 2 }
  )

  const producersOptions =
    producers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 12 })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetEServicesCatalogParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: tEservice('nameField.label'), type: 'freetext' },
    {
      name: 'producersIds',
      label: tEservice('providerField.label'),
      type: 'autocomplete-multiple',
      options: producersOptions,
      onTextInputChange: setProducersAutocompleteInput,
    },
  ])

  // Only e-service published or suspended can be shown in the catalog
  const states: Array<EServiceDescriptorState> = ['PUBLISHED', 'SUSPENDED']
  const queryParams = { ...paginationParams, ...filtersParams, states }

  const { data } = EServiceQueries.useGetCatalogList(queryParams, {
    suspense: false,
    keepPreviousData: true,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
      <EServiceCatalogWrapper params={queryParams} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const EServiceCatalogWrapper: React.FC<{ params: { limit: number; offset: number } }> = ({
  params,
}) => {
  const { data, isFetching } = EServiceQueries.useGetCatalogList(params, { suspense: false })

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />
  return <EServiceCatalogGrid eservices={data?.results} />
}

export default ConsumerEServiceCatalogPage
