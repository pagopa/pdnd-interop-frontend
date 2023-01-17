import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import usePagination from '@/hooks/usePagination'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import { Pagination } from '@/components/shared/Pagination'
import { useQueryFilters } from '@/hooks/useQueryFilters'
import { EServiceGetCatalogListQueryFilters } from '@/api/eservice/eservice.api.types'
import EServiceCatalogFilters from './components/EServiceCatalogFilters'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })
  const {
    props,
    params: paginationParams,
    getTotalPageCount,
  } = usePagination({
    limit: 15,
  })

  const { queryFilters, filtersFormMethods, enableFilters, clearFilters } =
    useQueryFilters<EServiceGetCatalogListQueryFilters>({
      q: '',
      producersIds: [],
    })

  const params = { ...queryFilters, ...paginationParams }

  const { data } = EServiceQueries.useGetCatalogList(
    {
      states: ['PUBLISHED'],
      ...params,
    },
    { suspense: false, keepPreviousData: true }
  )

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <EServiceCatalogFilters
        filtersFormMethods={filtersFormMethods}
        enableFilters={enableFilters}
        clearFilters={clearFilters}
      />
      <EServiceCatalogWrapper params={params} />
      <Pagination {...props} totalPages={getTotalPageCount(data?.pagination.totalCount)} />
    </PageContainer>
  )
}

const EServiceCatalogWrapper: React.FC<{ params: { limit: number; offset: number } }> = ({
  params,
}) => {
  const { data, isFetching } = EServiceQueries.useGetCatalogList(
    {
      states: ['PUBLISHED'],
      ...params,
    },
    { suspense: false }
  )

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />
  return <EServiceCatalogGrid eservices={data?.results} />
}

export default ConsumerEServiceCatalogPage
