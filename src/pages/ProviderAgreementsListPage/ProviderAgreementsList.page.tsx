import { AgreementQueries } from '@/api/agreement'
import type {
  GetListAgreementQueryFilters,
  GetListAgreementQueryParams,
} from '@/api/agreement/agreement.api.types'
import { PageContainer } from '@/components/layout/containers'
import { Filters } from '@/components/shared/Filters'
import { Pagination } from '@/components/shared/Pagination'
import { useFilters } from '@/hooks/useFilters'
import { useJwt } from '@/hooks/useJwt'
import { usePagination } from '@/hooks/usePagination'
import type { AgreementState } from '@/types/agreement.types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderAgreementsTable, ProviderAgreementsTableSkeleton } from './components'

const ProviderAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerAgreementsList' })
  const { t: tAgreement } = useTranslation('agreement', { keyPrefix: 'list.filters.statusField' })

  const { jwt } = useJwt()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<GetListAgreementQueryFilters>([
    {
      name: 'states',
      label: tAgreement('label'),
      type: 'multiple',
      options: [
        { label: tAgreement('optionLabels.ARCHIVED'), value: 'ARCHIVED' },
        { label: tAgreement('optionLabels.ACTIVE'), value: 'ACTIVE' },
        { label: tAgreement('optionLabels.PENDING'), value: 'PENDING' },
        { label: tAgreement('optionLabels.REJECTED'), value: 'REJECTED' },
        { label: tAgreement('optionLabels.SUSPENDED'), value: 'SUSPENDED' },
      ],
    },
  ])

  const states: Array<AgreementState> =
    !filtersParams.states || filtersParams.states?.length === 0
      ? ['ACTIVE', 'ARCHIVED', 'PENDING', 'SUSPENDED', 'REJECTED']
      : filtersParams.states

  const params = {
    ...filtersParams,
    ...paginationParams,
    producersIds: [jwt?.organizationId] as Array<string>,
    states,
  }
  const { data } = AgreementQueries.useGetList(params, { suspense: false, keepPreviousData: true })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
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
