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
  const { t: tAgreement } = useTranslation('agreement', { keyPrefix: 'list.filters' })
  const [producersAutocompleteInput, setProducersAutocompleteInput] = React.useState('')

  const { jwt } = useJwt()

  const { data: producers } = AgreementQueries.useGetProducers(
    { offset: 0, limit: 50, q: producersAutocompleteInput },
    { suspense: false, keepPreviousData: true }
  )

  const producersOptions =
    producers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<GetListAgreementQueryFilters>([
    {
      name: 'states',
      label: tAgreement('statusField.label'),
      type: 'multiple',
      options: [
        { label: tAgreement('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
        { label: tAgreement('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
        {
          label: tAgreement('statusField.optionLabels.MISSING_CERTIFIED_ATTRIBUTES'),
          value: 'MISSING_CERTIFIED_ATTRIBUTES',
        },
        { label: tAgreement('statusField.optionLabels.PENDING'), value: 'PENDING' },
        { label: tAgreement('statusField.optionLabels.DRAFT'), value: 'DRAFT' },
        { label: tAgreement('statusField.optionLabels.REJECTED'), value: 'REJECTED' },
        { label: tAgreement('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
      ],
    },
    {
      name: 'producersIds',
      label: tAgreement('providerField.label'),
      type: 'multiple',
      options: producersOptions,
      setAutocompleteInput: setProducersAutocompleteInput,
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
