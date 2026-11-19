import { AgreementQueries } from '@/api/agreement'
import { Filters, useAutocompleteTextInput, useFilters } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerAgreementsTable } from './components/ConsumerAgreementsTable'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GetConsumerAgreementsParams } from '@/api/api.generatedTypes'
import { usePagination } from '@/hooks/usePagination'
import { NewPageContainer } from '@/components/layout/containers/NewPageContainer'

const ConsumerAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerAgreementsList' })
  const { t: tAgreement } = useTranslation('agreement', { keyPrefix: 'list.filters' })
  const [producersAutocompleteInput, setProducersAutocompleteInput] = useAutocompleteTextInput()
  const [eservicesAutocompleteInput, setEServicesAutocompleteInput] = useAutocompleteTextInput()

  const { data: producersOptions = [] } = useQuery({
    ...AgreementQueries.getProducers({
      offset: 0,
      limit: 50,
      q: producersAutocompleteInput,
    }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { data: eservicesOptions = [] } = useQuery({
    ...AgreementQueries.getConsumerEServiceList({
      offset: 0,
      limit: 50,
      q: eservicesAutocompleteInput,
    }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetConsumerAgreementsParams, 'limit' | 'offset'>
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

  const params: GetConsumerAgreementsParams = {
    ...paginationParams,
    ...filtersParams,
  }

  const { data, isFetching } = useQuery(AgreementQueries.getConsumerAgreementsList(params))

  return (
    <NewPageContainer title={t('title')} description={t('description')}>
      <Filters {...filtersHandlers} />
      <ConsumerAgreementsTable
        agreements={data?.results ?? []}
        isLoading={!data && isFetching}
        pagination={{
          page: paginationProps.page,
          itemsPerPageOptions: paginationProps.itemsPerPageOptions,
          count: getTotalPageCount(data?.pagination.totalCount),
          onChange: (_, page) => paginationProps.onPageChange(page),
        }}
      />
    </NewPageContainer>
  )
}

export default ConsumerAgreementsListPage
