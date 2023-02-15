import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import { Pagination } from '@/components/shared/Pagination'
import { EServiceGetCatalogListQueryFilters } from '@/api/eservice/eservice.api.types'
import EServiceCatalogFilters from './components/EServiceCatalogFilters'
import { useListingParams } from '@/hooks/useListingParams'
import { EServiceState } from '@/types/eservice.types'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })

  const {
    params: _params,
    paginationProps,
    getTotalPageCount,
    ...filtersMethods
  } = useListingParams<EServiceGetCatalogListQueryFilters>({
    paginationOptions: {
      limit: 15,
    },
    filterParams: {
      q: '',
      producersIds: [],
    },
  })

  // Only e-service published or suspended can be shown in the catalog
  const states: Array<EServiceState> = ['PUBLISHED', 'SUSPENDED']
  const params = { ..._params, states }

  const { data } = EServiceQueries.useGetCatalogList(params, {
    suspense: false,
    keepPreviousData: true,
  })

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
  const { data, isFetching } = EServiceQueries.useGetCatalogList(params, { suspense: false })

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />
  return <EServiceCatalogGrid eservices={data?.results} />
}

export default ConsumerEServiceCatalogPage
