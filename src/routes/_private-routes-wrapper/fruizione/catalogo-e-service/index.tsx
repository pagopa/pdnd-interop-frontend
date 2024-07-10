import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { getCatalogListQueryOptions, getProducersQueryOptions } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'
import {
  useAutocompleteTextInput,
  Pagination,
  usePagination,
  useFilters,
  Filters,
} from '@pagopa/interop-fe-commons'
import { PageContainer } from '@/components/layout/containers'
import { z } from 'zod'
import type { EServiceDescriptorState, GetEServicesCatalogParams } from '@/api/api.generatedTypes'
import {
  EServiceCatalogGrid,
  EServiceCatalogGridSkeleton,
} from '@/pages/ConsumerEServiceCatalogPage/components'

const PAGINATION_LIMIT = 12
// Only e-service published or suspended can be shown in the catalog
const CATALOG_ESERVICES_STATES: Array<EServiceDescriptorState> = ['PUBLISHED', 'SUSPENDED']

export const Route = createFileRoute('/_private-routes-wrapper/fruizione/catalogo-e-service/')({
  staticData: {
    authLevels: ['admin', 'support', 'security', 'api'],
    routeKey: 'SUBSCRIBE_CATALOG_LIST',
  },
  validateSearch: (search) =>
    z
      .object({
        offset: z.number().int().optional(),
        q: z.string().optional(),
        producersIds: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
      })
      .parse(search),
  loaderDeps: (d) => d.search,
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.ensureQueryData(
      getCatalogListQueryOptions({
        ...deps,
        producersIds: deps.producersIds?.map((p) => p.value),
        offset: deps.offset || 0,
        limit: PAGINATION_LIMIT,
        states: CATALOG_ESERVICES_STATES,
      })
    )
  },
  component: React.memo(ConsumerEServiceCatalogPage),
})

function ConsumerEServiceCatalogPage() {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list.filters' })

  const [producersAutocompleteInput, setProducersAutocompleteInput] = useAutocompleteTextInput()

  const { data: producers } = useQuery({
    ...getProducersQueryOptions({ offset: 0, limit: 50, q: producersAutocompleteInput }),
    placeholderData: (p) => p,
  })

  const producersOptions =
    producers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({
    limit: PAGINATION_LIMIT,
  })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetEServicesCatalogParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: tEservice('nameField.label'), type: 'freetext' },
    {
      name: 'producersIds',
      label: tEservice('providerField.label'),
      type: 'autocomplete-multiple',
      options: producersOptions,
      onTextInputChange: setProducersAutocompleteInput,
    },
  ])

  const { data, isFetching } = useQuery(
    getCatalogListQueryOptions({
      states: CATALOG_ESERVICES_STATES,
      ...filtersParams,
      ...paginationParams,
    })
  )

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      breadcrumbPaths={['/erogazione']}
    >
      <Filters {...filtersHandlers} />
      {!data && isFetching ? (
        <EServiceCatalogGridSkeleton />
      ) : (
        <EServiceCatalogGrid eservices={data?.results} />
      )}
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      />
    </PageContainer>
  )
}
