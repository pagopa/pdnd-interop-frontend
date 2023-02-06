import React from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceTable, EServiceTableSkeleton } from './components'
import { PageContainer } from '@/components/layout/containers'
import { useNavigateRouter } from '@/router'
import { TopSideActions } from '@/components/layout/containers/PageContainer'
import { EServiceQueries } from '@/api/eservice'
import { Pagination } from '@/components/shared/Pagination'
import {
  EServiceGetProviderListQueryFilters,
  EServiceGetProviderListUrlParams,
} from '@/api/eservice/eservice.api.types'
import EServiceTableFilters from './components/EServiceTableFilters'
import { useListingParams } from '@/hooks/useListingParams'

const ProviderEServiceListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList' })
  const { t: tCommon } = useTranslation('common')
  const { navigate } = useNavigateRouter()

  const { params, paginationProps, getTotalPageCount, ...filtersMethods } =
    useListingParams<EServiceGetProviderListQueryFilters>({
      paginationOptions: {
        limit: 10,
      },
      filterParams: {
        q: '',
        consumersIds: [],
      },
    })

  const { data } = EServiceQueries.useGetProviderList(params, {
    suspense: false,
    keepPreviousData: true,
  })

  const topSideActions: TopSideActions = {
    buttons: [
      {
        action: () => {
          navigate('PROVIDE_ESERVICE_CREATE')
        },
        label: tCommon('createNewBtn'),
        variant: 'contained',
      },
    ],
  }

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={topSideActions}
    >
      <EServiceTableFilters {...filtersMethods} />
      <EServiceTableWrapper params={params} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const EServiceTableWrapper: React.FC<{ params: EServiceGetProviderListUrlParams }> = ({
  params,
}) => {
  const { data, isFetching } = EServiceQueries.useGetProviderList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <EServiceTableSkeleton />
  return <EServiceTable eservices={data?.results ?? []} />
}

export default ProviderEServiceListPage
