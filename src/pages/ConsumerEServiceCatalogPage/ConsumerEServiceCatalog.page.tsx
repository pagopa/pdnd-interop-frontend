import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import usePagination from '@/hooks/usePagination'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import { Pagination } from '@/components/shared/Pagination'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })
  const { props, params, getTotalPageCount } = usePagination({
    limit: 15,
  })

  const { data, isFetching } = EServiceQueries.useGetCatalogList(
    {
      states: ['PUBLISHED'],
      ...params,
    },
    { suspense: false, keepPreviousData: true }
  )
  return (
    <PageContainer title={t('title')} description={t('description')}>
      {isFetching && <EServiceCatalogGridSkeleton />}
      {!isFetching && <EServiceCatalogGrid eservices={data?.results} />}
      <Pagination {...props} totalPages={getTotalPageCount(data?.pagination.totalCount)} />
    </PageContainer>
  )
}

export default ConsumerEServiceCatalogPage
