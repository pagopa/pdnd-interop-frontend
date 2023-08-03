import { AgreementQueries } from '@/api/agreement'
import type { GetAgreementsParams } from '@/api/api.generatedTypes'
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
import {
  ConsumerAgreementsTable,
  ConsumerAgreementsTableSkeleton,
} from './components/ConsumerAgreementsTable'
import { AuthHooks } from '@/api/auth'

const ConsumerAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerAgreementsList' })
  const { t: tAgreement } = useTranslation('agreement', { keyPrefix: 'list.filters' })
  const [producersAutocompleteInput, setProducersAutocompleteInput] = useAutocompleteTextInput()
  const [eservicesAutocompleteInput, setEServicesAutocompleteInput] = useAutocompleteTextInput()

  const { jwt } = AuthHooks.useJwt()

  const { data: producers } = AgreementQueries.useGetProducers(
    { offset: 0, limit: 50, q: producersAutocompleteInput },
    { suspense: false, keepPreviousData: true }
  )

  const { data: eservices } = AgreementQueries.useGetConsumerEServiceList(
    { offset: 0, limit: 50, q: eservicesAutocompleteInput },
    { suspense: false, keepPreviousData: true }
  )

  const producersOptions =
    producers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const eservicesOptions =
    eservices?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

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
      name: 'producersIds',
      label: tAgreement('providerField.label'),
      type: 'autocomplete-multiple',
      options: producersOptions,
      onTextInputChange: setProducersAutocompleteInput,
    },
    {
      name: 'states',
      label: tAgreement('statusField.label'),
      type: 'autocomplete-multiple',
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

const ConsumerAgreementsTableWrapper: React.FC<{ params: GetAgreementsParams }> = ({ params }) => {
  const { data, isFetching } = AgreementQueries.useGetList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <ConsumerAgreementsTableSkeleton />
  return <ConsumerAgreementsTable agreements={data?.results ?? []} />
}

export default ConsumerAgreementsListPage
