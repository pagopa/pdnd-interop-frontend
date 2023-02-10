import { AgreementQueries } from '@/api/agreement'
import {
  GetListAgreementQueryFilters,
  GetListAgreementQueryParams,
} from '@/api/agreement/agreement.api.types'
import { PageContainer } from '@/components/layout/containers'
import { Pagination } from '@/components/shared/Pagination'
import { useJwt } from '@/hooks/useJwt'
import { useListingParams } from '@/hooks/useListingParams'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConsumerAgreementsTable,
  ConsumerAgreementsTableSkeleton,
} from './components/ConsumerAgreementsTable'
import { ConsumerAgreementsTableFilters } from './components/ConsumerAgreementsTableFilters'

const ConsumerAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerAgreementsList' })
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
    filterParams: { eservicesIds: [], producersIds: [], states: [] },
  })

  const params = { ..._params, consumersIds: [jwt?.organizationId] as Array<string> }

  const { data } = AgreementQueries.useGetList(params, { suspense: false, keepPreviousData: true })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <ConsumerAgreementsTableFilters {...filtersMethods} />
      <ConsumerAgreementsTableWrapper params={params} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const ConsumerAgreementsTableWrapper: React.FC<{ params: GetListAgreementQueryParams }> = ({
  params,
}) => {
  const { data, isFetching } = AgreementQueries.useGetList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <ConsumerAgreementsTableSkeleton />
  return <ConsumerAgreementsTable agreements={data?.results ?? []} />
}

export default ConsumerAgreementsListPage
