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
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConsumerAgreementsTable,
  ConsumerAgreementsTableSkeleton,
} from './components/ConsumerAgreementsTable'

const ConsumerAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerAgreementsList' })
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
        {
          label: tAgreement('optionLabels.MISSING_CERTIFIED_ATTRIBUTES'),
          value: 'MISSING_CERTIFIED_ATTRIBUTES',
        },
        { label: tAgreement('optionLabels.PENDING'), value: 'PENDING' },
        { label: tAgreement('optionLabels.DRAFT'), value: 'DRAFT' },
        { label: tAgreement('optionLabels.REJECTED'), value: 'REJECTED' },
        { label: tAgreement('optionLabels.SUSPENDED'), value: 'SUSPENDED' },
      ],
    },
  ])

  const params = {
    ...paginationParams,
    ...filtersParams,
    consumersIds: [jwt?.organizationId] as Array<string>,
  }

  const { data } = AgreementQueries.useGetList(params, { suspense: false, keepPreviousData: true })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
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
