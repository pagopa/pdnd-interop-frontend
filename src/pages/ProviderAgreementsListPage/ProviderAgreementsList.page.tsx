import { AgreementQueries } from '@/api/agreement'
import {
  GetListAgreementQueryFilters,
  GetListAgreementQueryParams,
} from '@/api/agreement/agreement.api.types'
import { PageContainer } from '@/components/layout/containers'
import { Pagination } from '@/components/shared/Pagination'
import { useJwt } from '@/hooks/useJwt'
import { useListingParams } from '@/hooks/useListingParams'
import { AgreementState } from '@/types/agreement.types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderAgreementsTable, ProviderAgreementsTableSkeleton } from './components'
import { ProviderAgreementsTableFilters } from './components/ProviderAgreementsTableFilters'

const ProviderAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerAgreementsList' })
  const { jwt } = useJwt()

  const {
    params: _params,
    paginationProps,
    getTotalPageCount,
    ...filtersMethods
  } = useListingParams<GetListAgreementQueryFilters>({
    paginationOptions: {
      limit: 10,
    },
    filterParams: {
      eservicesIds: [],
      consumersIds: [],
      states: [],
    },
  })

  const states: Array<AgreementState> =
    !_params.states || _params.states?.length === 0
      ? ['ACTIVE', 'ARCHIVED', 'PENDING', 'SUSPENDED', 'REJECTED']
      : _params.states

  const params = { ..._params, producersIds: [jwt?.organizationId] as Array<string>, states }
  const { data } = AgreementQueries.useGetList(params, { suspense: false, keepPreviousData: true })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <ProviderAgreementsTableFilters {...filtersMethods} />
      <ProviderAgreementsTableWrapper params={params} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const ProviderAgreementsTableWrapper: React.FC<{ params: GetListAgreementQueryParams }> = ({
  params,
}) => {
  const { data, isFetching } = AgreementQueries.useGetList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <ProviderAgreementsTableSkeleton />
  return <ProviderAgreementsTable agreements={data?.results ?? []} />
}

export default ProviderAgreementsListPage
