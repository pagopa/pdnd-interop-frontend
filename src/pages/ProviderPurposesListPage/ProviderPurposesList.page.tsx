import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ProviderPurposesTable, ProviderPurposesTableSkeleton } from './components'
import { EServiceQueries } from '@/api/eservice'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import type { GetProducerPurposesParams } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'

const ProviderPurposesListPage: React.FC = () => {
  const { jwt } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerPurposesList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list.filters' })

  const [eserviceAutocompleteText, setEServiceAutocompleteInputChange] = useAutocompleteTextInput()
  const [consumersAutocompleteText, setConsumersAutocompleteInputChange] =
    useAutocompleteTextInput()

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
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetProducerPurposesParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: tPurpose('nameField.label'), type: 'freetext' },
    {
      name: 'eservicesIds',
      label: tPurpose('eserviceField.label'),
      type: 'autocomplete-multiple',
      options: eservicesOptions,
      onTextInputChange: setEServiceAutocompleteInputChange,
    },
    {
      name: 'consumersIds',
      label: tPurpose('consumerField.label'),
      type: 'autocomplete-multiple',
      options: consumersOptions,
      onTextInputChange: setConsumersAutocompleteInputChange,
    },
    {
      name: 'states',
      label: tPurpose('statusField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: tPurpose('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
        {
          label: tPurpose('statusField.optionLabels.WAITING_FOR_APPROVAL'),
          value: 'WAITING_FOR_APPROVAL',
        },
        { label: tPurpose('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
        { label: tPurpose('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
      ],
    },
  ])

  const params = {
    ...filtersParams,
    ...paginationParams,
    producersIds: [jwt?.organizationId] as Array<string>,
  }

  const { data } = PurposeQueries.useGetProducersList(params, {
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

const PurposesTableWrapper: React.FC<{ params: GetProducerPurposesParams }> = ({ params }) => {
  const { jwt } = AuthHooks.useJwt()

  const { data, isFetching } = PurposeQueries.useGetProducersList(params, {
    suspense: false,
    enabled: !!jwt?.organizationId,
  })

  if (!data && isFetching) return <ProviderPurposesTableSkeleton />
  return <ProviderPurposesTable purposes={data?.results ?? []} />
}

export default ProviderPurposesListPage
