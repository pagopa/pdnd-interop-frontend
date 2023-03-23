import React from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceTable, EServiceTableSkeleton } from './components'
import { PageContainer } from '@/components/layout/containers'
import { useNavigateRouter } from '@/router'
import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import { EServiceQueries } from '@/api/eservice'
import type {
  EServiceGetProviderListQueryFilters,
  EServiceGetProviderListUrlParams,
} from '@/api/eservice/eservice.api.types'
import { useJwt } from '@/hooks/useJwt'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'

const ProviderEServiceListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList' })
  const { t: tCommon } = useTranslation('common')
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list.filters' })
  const { navigate } = useNavigateRouter()
  const { isAdmin } = useJwt()
  const [consumersAutocompleteInput, setConsumersAutocompleteInput] = useAutocompleteTextInput('')

  const { data: consumers } = EServiceQueries.useGetConsumers(
    { offset: 0, limit: 50, q: consumersAutocompleteInput },
    { suspense: false, keepPreviousData: true }
  )

  const consumersOptions =
    consumers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<EServiceGetProviderListQueryFilters>([
    { name: 'q', label: tEservice('nameField.label'), type: 'freetext' },
    {
      name: 'consumersIds',
      label: tEservice('consumerField.label'),
      type: 'autocomplete-multiple',
      options: consumersOptions,
      onTextInputChange: setConsumersAutocompleteInput,
    },
  ])

  const queryParams = { ...paginationParams, ...filtersParams }

  const { data } = EServiceQueries.useGetProviderList(queryParams, {
    suspense: false,
    keepPreviousData: true,
  })

  const topSideActions: TopSideActions = {
    buttons: [
      {
        action: () => {
          navigate('PROVIDE_ESERVICE_CREATE')
        },
        label: tCommon('createNewBtn'),
        variant: 'contained',
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
      <EServiceTableWrapper params={queryParams} />
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}

const EServiceTableWrapper: React.FC<{ params: EServiceGetProviderListUrlParams }> = ({
  params,
}) => {
  const { data, isFetching } = EServiceQueries.useGetProviderList(params, {
    suspense: false,
  })

  if (!data && isFetching) return <EServiceTableSkeleton />
  return <EServiceTable eservices={data?.results ?? []} />
}

export default ProviderEServiceListPage
