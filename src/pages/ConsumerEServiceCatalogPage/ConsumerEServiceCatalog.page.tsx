import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import { Pagination } from '@/components/shared/Pagination'
import { EServiceGetCatalogListQueryFilters } from '@/api/eservice/eservice.api.types'
import EServiceCatalogFilters from './components/EServiceCatalogFilters'
import { useListingParams } from '@/hooks/useListingParams'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })

  const { params, paginationProps, getTotalPageCount, ...filtersMethods } =
    useListingParams<EServiceGetCatalogListQueryFilters>({
      paginationOptions: {
        limit: 15,
      },
      filterParams: {
        q: '',
        producersIds: [],
      },
    })

  const { data } = EServiceQueries.useGetCatalogList(
    {
      states: ['PUBLISHED'],
      ...params,
    },
    { suspense: false, keepPreviousData: true }
  )

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <EServiceCatalogFilters {...filtersMethods} />
      <EServiceCatalogWrapper params={params} />
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
