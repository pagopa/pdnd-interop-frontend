import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import { Pagination } from '@/components/shared/Pagination'
import type { EServiceGetCatalogListQueryFilters } from '@/api/eservice/eservice.api.types'
import type { EServiceState } from '@/types/eservice.types'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { Filters } from '@/components/shared/Filters'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list.filters' })

  const [producersAutocompleteInput, setProducersAutocompleteInput] = React.useState('')

  const { data: producers } = EServiceQueries.useGetProducers(
    { offset: 0, limit: 50, q: producersAutocompleteInput },
    { suspense: false, keepPreviousData: true }
  )

  const producersOptions =
    producers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<EServiceGetCatalogListQueryFilters>([
    { name: 'q', label: tEservice('nameField.label'), type: 'single' },
    {
      name: 'producersIds',
      label: tEservice('providerField.label'),
      type: 'multiple',
      options: producersOptions,
      setAutocompleteInput: setProducersAutocompleteInput,
    },
  ])

  // Only e-service published or suspended can be shown in the catalog
  const states: Array<EServiceState> = ['PUBLISHED', 'SUSPENDED']
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
