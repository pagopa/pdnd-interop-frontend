import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import { useJwt } from '@/hooks/useJwt'
import { useNavigate } from '@/router'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposesTable, ConsumerPurposesTableSkeleton } from './components'
import type { GetConsumerPurposesParams } from '@/api/api.generatedTypes'

const ConsumerPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposesList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common')
  const { jwt, isAdmin } = useJwt()
  const navigate = useNavigate()

  const [eserviceAutocompleteText, setEServiceAutocompleteInputChange] =
    useAutocompleteTextInput('')
  const [producersAutocompleteText, setProducersAutocompleteInputChange] =
    useAutocompleteTextInput('')

  const { data: producers } = EServiceQueries.useGetProducers(
    { offset: 0, limit: 50, q: producersAutocompleteText },
    // PIN-3646 - Temporarly avoid fetching producers if the autocomplete text is less than 3 chars
    { suspense: false, keepPreviousData: true, enabled: producersAutocompleteText.length > 2 }
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
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetConsumerPurposesParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: tPurpose('filters.nameField.label'), type: 'freetext' },
    {
      name: 'eservicesIds',
      label: tPurpose('filters.eserviceField.label'),
      type: 'autocomplete-multiple',
      options: eservicesOptions,
      onTextInputChange: setEServiceAutocompleteInputChange,
    },
    {
      name: 'producersIds',
      label: tPurpose('filters.providerField.label'),
      type: 'autocomplete-multiple',
      options: providersOptions,
      onTextInputChange: setProducersAutocompleteInputChange,
    },
    {
      name: 'states',
      label: tPurpose('filters.statusField.label'),
      type: 'autocomplete-multiple',
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

  const { data } = PurposeQueries.useGetConsumersList(params, {
    suspense: false,
    keepPreviousData: true,
    enabled: !!jwt?.organizationId,
  })

  const { data: activeEServices } = EServiceQueries.useGetCatalogList(
    {
      agreementStates: ['ACTIVE'],
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    },
    { suspense: false }
  )

  const hasNotActiveEService = activeEServices?.results.length === 0 ?? true

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
      topSideActions={isAdmin ? topSideActions : undefined}
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

const PurposesTableWrapper: React.FC<{ params: GetConsumerPurposesParams }> = ({ params }) => {
  const { jwt } = useJwt()

  const { data, isFetching } = PurposeQueries.useGetConsumersList(params, {
    suspense: false,
    enabled: !!jwt?.organizationId,
  })

  if (!data && isFetching) return <ConsumerPurposesTableSkeleton />
  return <ConsumerPurposesTable purposes={data?.results ?? []} />
}

export default ConsumerPurposesListPage
