import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import {
  PurposeGetListQueryFilters,
  PurposeGetListUrlParams,
} from '@/api/purpose/purpose.api.types'
import { PageContainer } from '@/components/layout/containers'
import { Pagination } from '@/components/shared/Pagination'
import { useJwt } from '@/hooks/useJwt'
import { useListingParams } from '@/hooks/useListingParams'
import { useTranslation } from 'react-i18next'
import { ProviderPurposesTable, ProviderPurposesTableSkeleton } from './components'
import { ProviderPurposesTableFilters } from './components/ProviderPurposesTableFilters'

const ProviderPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerPurposesList' })
  const { jwt } = useJwt()

  const {
    params: _params,
    paginationProps,
    getTotalPageCount,
    ...filtersMethods
  } = useListingParams<PurposeGetListQueryFilters>({
    paginationOptions: {
      limit: 10,
    },
    filterParams: {
      q: '',
      eservicesIds: [],
      consumersIds: [],
      states: [],
    },
  })

  const params = { ..._params, producersIds: [jwt?.organizationId] as Array<string> }

  const { data } = PurposeQueries.useGetList(params, {
    suspense: false,
    keepPreviousData: true,
    enabled: !!jwt?.organizationId,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <ProviderPurposesTableFilters {...filtersMethods} />
      <PurposesTableWrapper params={params} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
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
