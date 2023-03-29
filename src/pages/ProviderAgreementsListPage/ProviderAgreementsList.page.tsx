import { AgreementQueries } from '@/api/agreement'
import type { AgreementState, GetAgreementsParams } from '@/api/api.generatedTypes'
import { PageContainer } from '@/components/layout/containers'
import { useJwt } from '@/hooks/useJwt'
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

const ProviderAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerAgreementsList' })
  const { t: tAgreement } = useTranslation('agreement', { keyPrefix: 'list.filters' })

  const [consumersAutocompleteInput, setConsumersAutocompleteInput] = useAutocompleteTextInput()
  const [eservicesAutocompleteInput, setEServicesAutocompleteInput] = useAutocompleteTextInput()

  const { data: consumers } = AgreementQueries.useGetConsumers(
    { offset: 0, limit: 50, q: consumersAutocompleteInput },
    { suspense: false, keepPreviousData: true }
  )

  const { data: eservices } = AgreementQueries.useGetProducerEServiceList(
    { offset: 0, limit: 50, q: eservicesAutocompleteInput },
    { suspense: false, keepPreviousData: true }
  )

  const consumersOptions =
    consumers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const eservicesOptions =
    eservices?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { jwt } = useJwt()

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetAgreementsParams, 'limit' | 'offset'>
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

const ProviderAgreementsTableWrapper: React.FC<{ params: GetAgreementsParams }> = ({ params }) => {
  const { data, isFetching } = AgreementQueries.useGetList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <ProviderAgreementsTableSkeleton />
  return <ProviderAgreementsTable agreements={data?.results ?? []} />
}

export default ProviderAgreementsListPage
