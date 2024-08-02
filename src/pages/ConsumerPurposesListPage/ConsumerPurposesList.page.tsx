import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
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
import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const ConsumerPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposesList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common')
  const { jwt, isAdmin } = AuthHooks.useJwt()
  const navigate = useNavigate()

  const [eserviceAutocompleteText, setEServiceAutocompleteInputChange] =
    useAutocompleteTextInput('')
  const [producersAutocompleteText, setProducersAutocompleteInputChange] =
    useAutocompleteTextInput('')

  const { data: producersOptions = [] } = useQuery({
    ...EServiceQueries.getProducers({ offset: 0, limit: 50, q: producersAutocompleteText }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { data: eservicesOptions = [] } = useQuery({
    ...EServiceQueries.getCatalogList({ offset: 0, limit: 50, q: eserviceAutocompleteText }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

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
      options: producersOptions,
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
        { label: tPurpose('filters.statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
        { label: tPurpose('filters.statusField.optionLabels.REJECTED'), value: 'REJECTED' },
      ],
    },
  ])

  const params = {
    ...filtersParams,
    ...paginationParams,
    consumersIds: [jwt?.organizationId] as Array<string>,
  }

  const { data: hasActiveEService } = useQuery({
    ...EServiceQueries.getCatalogList({
      agreementStates: ['ACTIVE'],
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    }),
    select: (activeEServices) => activeEServices.results.length > 0,
  })

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () => navigate('SUBSCRIBE_PURPOSE_CREATE'),
      label: tCommon('createNewBtn'),
      icon: PlusOneIcon,
      variant: 'contained',
      disabled: !hasActiveEService,
      tooltip: !hasActiveEService ? tPurpose('cantCreatePurposeTooltip') : undefined,
    },
  ]

  const { data: totalPages = 0 } = useQuery({
    ...PurposeQueries.getConsumersList(params),
    placeholderData: keepPreviousData,
    enabled: Boolean(jwt?.organizationId),
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={isAdmin ? topSideActions : undefined}
    >
      <Filters {...filtersHandlers} />
      <PurposesTableWrapper params={params} />
      <Pagination {...paginationProps} totalPages={totalPages} />
    </PageContainer>
  )
}

const PurposesTableWrapper: React.FC<{ params: GetConsumerPurposesParams }> = ({ params }) => {
  const { jwt } = AuthHooks.useJwt()

  const { data, isFetching } = useQuery({
    ...PurposeQueries.getConsumersList(params),
    enabled: Boolean(jwt?.organizationId),
  })

  if (!data && isFetching) return <ConsumerPurposesTableSkeleton />
  return <ConsumerPurposesTable purposes={data?.results ?? []} />
}

export default ConsumerPurposesListPage
