import { PurposeQueries } from '@/api/purpose'
import { PurposeGetListUrlParams } from '@/api/purpose/purpose.api.types'
import { PageContainer } from '@/components/layout/containers'
import { Pagination } from '@/components/shared/Pagination'
import { useJwt } from '@/hooks/useJwt'
import usePagination from '@/hooks/usePagination'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderPurposesTable, ProviderPurposesTableSkeleton } from './components'

const ProviderPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerPurposesList' })
  const { jwt } = useJwt()

  const {
    props,
    params: paginationParams,
    getTotalPageCount,
  } = usePagination({
    limit: 20,
  })

  const params = { ...paginationParams, producersIds: [jwt?.organizationId] as Array<string> }
  const { data } = PurposeQueries.useGetList(params, {
    suspense: false,
    keepPreviousData: true,
    enabled: !!jwt?.organizationId,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <PurposesTableWrapper params={params} />
      <Pagination {...props} totalPages={getTotalPageCount(data?.pagination.totalCount)} />
    </PageContainer>
  )
}

const PurposesTableWrapper: React.FC<{ params: PurposeGetListUrlParams }> = ({ params }) => {
  const { jwt } = useJwt()

  const { data, isFetching } = PurposeQueries.useGetList(params, {
    suspense: false,
    enabled: !!jwt?.organizationId,
  })

  if (!data && isFetching) return <ProviderPurposesTableSkeleton />
  return <ProviderPurposesTable purposes={data?.results ?? []} />
}

export default ProviderPurposesListPage
