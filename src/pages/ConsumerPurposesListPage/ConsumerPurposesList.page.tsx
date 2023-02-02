import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import {
  PurposeGetListQueryFilters,
  PurposeGetListUrlParams,
} from '@/api/purpose/purpose.api.types'
import { PageContainer } from '@/components/layout/containers'
import { TopSideActions } from '@/components/layout/containers/PageContainer'
import { Pagination } from '@/components/shared/Pagination'
import { useJwt } from '@/hooks/useJwt'
import { useListingParams } from '@/hooks/useListingParams'
import { useNavigateRouter } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposesTable, ConsumerPurposesTableSkeleton } from './components'
import { ConsumerPurposesTableFilters } from './components/ConsumerPurposesTableFilters'

const ConsumerPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposesList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = useJwt()
  const { navigate } = useNavigateRouter()

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
      producersIds: [],
      states: [],
    },
  })

  const params = { ..._params, consumersIds: [jwt?.organizationId] as Array<string> }

  const { data } = PurposeQueries.useGetList(params, {
    suspense: false,
    keepPreviousData: true,
    enabled: !!jwt?.organizationId,
  })

  const { data: activeEServices } = EServiceQueries.useGetListFlat(
    {
      callerId: jwt?.organizationId,
      consumerId: jwt?.organizationId,
      agreementStates: ['ACTIVE'],
      state: 'PUBLISHED',
    },
    { suspense: false }
  )

  const hasNotActiveEService = activeEServices?.length === 0 ?? true

  const topSideActions: TopSideActions = {
    infoTooltip:
      !activeEServices && hasNotActiveEService ? tPurpose('cantCreatePurposeTooltip') : undefined,
    buttons: [
      {
        action: () => navigate('SUBSCRIBE_PURPOSE_CREATE'),
        label: tCommon('createNewBtn'),
        variant: 'contained',
        disabled: hasNotActiveEService,
      },
    ],
  }

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={topSideActions}
    >
      <ConsumerPurposesTableFilters {...filtersMethods} />
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

  if (!data && isFetching) return <ConsumerPurposesTableSkeleton />
  return <ConsumerPurposesTable purposes={data?.results ?? []} />
}

export default ConsumerPurposesListPage
