import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import type {
  PurposeGetListQueryFilters,
  PurposeGetListUrlParams,
} from '@/api/purpose/purpose.api.types'
import { PageContainer } from '@/components/layout/containers'
import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import { Filters } from '@/components/shared/Filters'
import { Pagination } from '@/components/shared/Pagination'
import { useFilters } from '@/hooks/useFilters'
import { useJwt } from '@/hooks/useJwt'
import { usePagination } from '@/hooks/usePagination'
import { useNavigateRouter } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposesTable, ConsumerPurposesTableSkeleton } from './components'

const ConsumerPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposesList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = useJwt()
  const { navigate } = useNavigateRouter()

  const [eserviceAutocompleteText, setEServiceAutocompleteInputChange] = React.useState('')
  const [producersAutocompleteText, setProducersAutocompleteInputChange] = React.useState('')

  const { data: producers } = EServiceQueries.useGetProducers(
    { offset: 0, limit: 50, q: producersAutocompleteText },
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

  const providersOptions =
    producers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<PurposeGetListQueryFilters>([
    { name: 'q', label: tPurpose('filters.nameField.label'), type: 'single' },
    {
      name: 'eservicesIds',
      label: tPurpose('filters.eserviceField.label'),
      type: 'multiple',
      options: eservicesOptions,
      setAutocompleteInput: setEServiceAutocompleteInputChange,
    },
    {
      name: 'producersIds',
      label: tPurpose('filters.providerField.label'),
      type: 'multiple',
      options: providersOptions,
      setAutocompleteInput: setProducersAutocompleteInputChange,
    },
    {
      name: 'states',
      label: tPurpose('filters.statusField.label'),
      type: 'multiple',
      options: [
        { label: tPurpose('filters.statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
        {
          label: tPurpose('filters.statusField.optionLabels.WAITING_FOR_APPROVAL'),
          value: 'WAITING_FOR_APPROVAL',
        },
        { label: tPurpose('filters.statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
      ],
    },
  ])

  const params = {
    ...filtersParams,
    ...paginationParams,
    consumersIds: [jwt?.organizationId] as Array<string>,
  }

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

  if (!data && isFetching) return <ConsumerPurposesTableSkeleton />
  return <ConsumerPurposesTable purposes={data?.results ?? []} />
}

export default ConsumerPurposesListPage
