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

  const { data } = EServiceQueries.useGetCatalogList(
    {
      states: ['PUBLISHED'],
      ...params,
    },
    { suspense: false, keepPreviousData: true }
  )

  return (
    <PageContainer title={t('title')} description={t('description')}>
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
