import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import { useDrawerState } from '@/hooks/useDrawerState'
import { getConsumersQueryOptions, getProviderListQueryOptions } from '@/api/eservice'
import type { GetProducerEServicesParams } from '@/api/api.generatedTypes'
import type { ActionItemButton } from '@/types/common.types'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { ProviderEServiceImportVersionDrawer } from '@/pages/ProviderEServiceListPage/components/ProviderEServiceImportVersionDrawer'
import { EServiceTable, EServiceTableSkeleton } from '@/pages/ProviderEServiceListPage/components'
import { PageContainer } from '@/components/layout/containers'
import { z } from 'zod'
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser'

const PAGINATION_LIMIT = 50

export const Route = createFileRoute('/_private-routes/erogazione/e-service/')({
  staticData: {
    authLevels: ['admin', 'support', 'api'],
    routeKey: 'PROVIDE_ESERVICE_LIST',
  },
  validateSearch: (search) =>
    z
      .object({
        offset: z.number().int().optional(),
        q: z.string().optional(),
        consumersIds: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
      })
      .parse(search),
  loaderDeps: (d) => d.search,
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.ensureQueryData(
      getProviderListQueryOptions({
        ...deps,
        consumersIds: deps.consumersIds?.map((p) => p.value),
        offset: deps.offset || 0,
        limit: PAGINATION_LIMIT,
      })
    )
  },
  component: React.memo(ProviderEServiceListPage),
})

function ProviderEServiceListPage() {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList' })
  const { t: tCommon } = useTranslation('common')
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list.filters' })
  const navigate = useNavigate()
  const { isAdmin, isOperatorAPI } = useAuthenticatedUser()
  const [consumersAutocompleteInput, setConsumersAutocompleteInput] = useAutocompleteTextInput('')

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { data: consumers } = useQuery({
    ...getConsumersQueryOptions({ offset: 0, limit: 50, q: consumersAutocompleteInput }),
    placeholderData: (p) => p,
  })

  const consumersOptions =
    consumers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetProducerEServicesParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: tEservice('nameField.label'), type: 'freetext' },
    {
      name: 'consumersIds',
      label: tEservice('consumerField.label'),
      type: 'autocomplete-multiple',
      options: consumersOptions,
      onTextInputChange: setConsumersAutocompleteInput,
    },
  ])

  const { data, isFetching } = useQuery(
    getProviderListQueryOptions({
      ...filtersParams,
      ...paginationParams,
    })
  )

  const topSideActions: Array<ActionItemButton> = [
    {
      action: openDrawer,
      label: tCommon('actions.import'),
      variant: 'outlined',
      icon: UploadFileIcon,
    },
    {
      action: () => navigate({ to: '/erogazione/e-service/crea' }),
      label: tCommon('createNewBtn'),
      variant: 'contained',
      icon: PlusOneIcon,
    },
  ]

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={isAdmin || isOperatorAPI ? topSideActions : undefined}
      breadcrumbPaths={['/erogazione']}
    >
      <Filters {...filtersHandlers} />
      {!data && isFetching ? (
        <EServiceTableSkeleton />
      ) : (
        <EServiceTable eservices={data?.results ?? []} />
      )}
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
      <ProviderEServiceImportVersionDrawer isOpen={isOpen} onClose={closeDrawer} />
    </PageContainer>
  )
}
