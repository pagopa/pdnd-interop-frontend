import { AgreementQueries } from '@/api/agreement'
import type { AgreementState, GetProducerAgreementsParams } from '@/api/api.generatedTypes'
import { PageContainer } from '@/components/layout/containers'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderAgreementsTable, ProviderAgreementsTableSkeleton } from './components'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const ProviderAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerAgreementsList' })
  const { t: tAgreement } = useTranslation('agreement', { keyPrefix: 'list.filters' })

  const [consumersAutocompleteInput, setConsumersAutocompleteInput] = useAutocompleteTextInput()
  const [eservicesAutocompleteInput, setEServicesAutocompleteInput] = useAutocompleteTextInput()

  const { data: consumersOptions = [] } = useQuery({
    ...AgreementQueries.getConsumers({ offset: 0, limit: 50, q: consumersAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { data: eservicesOptions = [] } = useQuery({
    ...AgreementQueries.getProducerEServiceList({
      offset: 0,
      limit: 50,
      q: eservicesAutocompleteInput,
    }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetProducerAgreementsParams, 'limit' | 'offset'>
  >([
    {
      name: 'eservicesIds',
      label: tAgreement('eserviceField.label'),
      type: 'autocomplete-multiple',
      options: eservicesOptions,
      onTextInputChange: setEServicesAutocompleteInput,
    },
    {
      name: 'consumersIds',
      label: tAgreement('consumerField.label'),
      type: 'autocomplete-multiple',
      options: consumersOptions,
      onTextInputChange: setConsumersAutocompleteInput,
    },
    {
      name: 'states',
      label: tAgreement('statusField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: tAgreement('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
        { label: tAgreement('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
        { label: tAgreement('statusField.optionLabels.PENDING'), value: 'PENDING' },
        { label: tAgreement('statusField.optionLabels.REJECTED'), value: 'REJECTED' },
        { label: tAgreement('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
      ],
    },
  ])

  const states: Array<AgreementState> =
    !filtersParams.states || filtersParams.states?.length === 0
      ? ['ACTIVE', 'ARCHIVED', 'PENDING', 'SUSPENDED', 'REJECTED']
      : filtersParams.states

  const params: GetProducerAgreementsParams = {
    ...filtersParams,
    ...paginationParams,
    states,
  }
  const { data } = useQuery({
    ...AgreementQueries.getProducerAgreementsList(params),
    placeholderData: keepPreviousData,
  })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
      <ProviderAgreementsTableWrapper params={params} />
      <Pagination
        {...paginationProps}
        rowPerPageOptions={{
          onLimitChange: paginationProps.onLimitChange,
          limit: paginationParams.limit,
        }}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const ProviderAgreementsTableWrapper: React.FC<{ params: GetProducerAgreementsParams }> = ({
  params,
}) => {
  const { data, isFetching } = useQuery(AgreementQueries.getProducerAgreementsList(params))

  if (!data && isFetching) return <ProviderAgreementsTableSkeleton />
  return <ProviderAgreementsTable agreements={data?.results ?? []} />
}

export default ProviderAgreementsListPage
