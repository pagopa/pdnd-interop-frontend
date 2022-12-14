import React from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceTable, EServiceTableSkeleton } from './components'
import { PageContainer } from '@/components/layout/containers'
import { useNavigateRouter } from '@/router'
import { TopSideActions } from '@/components/layout/containers/PageContainer'
import { EServiceQueries } from '@/api/eservice'
import usePagination from '@/hooks/usePagination'
import { Pagination } from '@/components/shared/Pagination'

const ProviderEServiceListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList' })
  const { t: tCommon } = useTranslation('common')
  const { navigate } = useNavigateRouter()
  const { props, params, getTotalPageCount } = usePagination({
    limit: 20,
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
      <EServiceTableWrapper params={params} />
      <Pagination {...props} totalPages={getTotalPageCount(data?.pagination.totalCount)} />
    </PageContainer>
  )
}

const EServiceTableWrapper: React.FC<{ params: { limit: number; offset: number } }> = ({
  params,
}) => {
  const { data, isFetching } = EServiceQueries.useGetProviderList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <EServiceTableSkeleton />
  return <EServiceTable eservices={data?.results ?? []} />
}

export default ProviderEServiceListPage
