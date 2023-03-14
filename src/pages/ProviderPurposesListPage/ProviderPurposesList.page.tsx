import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import type {
  PurposeGetListQueryFilters,
  PurposeGetListUrlParams,
} from '@/api/purpose/purpose.api.types'
import { PageContainer } from '@/components/layout/containers'
import { Pagination } from '@/components/shared/Pagination'
import { useJwt } from '@/hooks/useJwt'
import { useTranslation } from 'react-i18next'
import { ProviderPurposesTable, ProviderPurposesTableSkeleton } from './components'
import { useFilters } from '@/hooks/useFilters'
import { EServiceQueries } from '@/api/eservice'
import { usePagination } from '@/hooks/usePagination'
import { Filters } from '@/components/shared/Filters'

const ProviderPurposesListPage: React.FC = () => {
  const { jwt } = useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerPurposesList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list.filters' })

  const [eserviceAutocompleteText, setEServiceAutocompleteInputChange] = React.useState('')
  const [consumersAutocompleteText, setConsumersAutocompleteInputChange] = React.useState('')

  const { data: consumers } = EServiceQueries.useGetConsumers(
    { offset: 0, limit: 50, q: consumersAutocompleteText },
    { suspense: false, keepPreviousData: true }
  )

  const { data: eservices } = EServiceQueries.useGetProviderList(
    { q: eserviceAutocompleteText, limit: 50, offset: 0 },
    { suspense: false, keepPreviousData: true }
  )

  const eservicesOptions =
    eservices?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const consumersOptions =
    consumers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<PurposeGetListQueryFilters>([
    { name: 'q', label: tPurpose('nameField.label'), type: 'single' },
    {
      name: 'eservicesIds',
      label: tPurpose('eserviceField.label'),
      type: 'multiple',
      options: eservicesOptions,
      setAutocompleteInput: setEServiceAutocompleteInputChange,
    },
    {
      name: 'consumersIds',
      label: tPurpose('consumerField.label'),
      type: 'multiple',
      options: consumersOptions,
      setAutocompleteInput: setConsumersAutocompleteInputChange,
    },
    {
      name: 'states',
      label: tPurpose('statusField.label'),
      type: 'multiple',
      options: [
        { label: tPurpose('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
        {
          label: tPurpose('statusField.optionLabels.WAITING_FOR_APPROVAL'),
          value: 'WAITING_FOR_APPROVAL',
        },
        { label: tPurpose('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
      ],
    },
  ])

  const params = {
    ...filtersParams,
    ...paginationParams,
    producersIds: [jwt?.organizationId] as Array<string>,
  }

  const { data } = PurposeQueries.useGetList(params, {
    suspense: false,
    keepPreviousData: true,
    enabled: !!jwt?.organizationId,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
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
