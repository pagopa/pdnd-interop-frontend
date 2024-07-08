import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { getCatalogListQueryOptions, getProducersQueryOptions } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { PageContainer } from '@/components/layout/containers'
import { z } from 'zod'
import type { EServiceDescriptorState } from '@/api/api.generatedTypes'
import {
  EServiceCatalogGrid,
  EServiceCatalogGridSkeleton,
} from '@/pages/ConsumerEServiceCatalogPage/components'

const PAGINATION_LIMIT = 12
const CATALOG_ESERVICES_STATES: Array<EServiceDescriptorState> = ['PUBLISHED', 'SUSPENDED']

export const Route = createFileRoute(
  '/_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/catalogo-e-service/'
)({
  staticData: {
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security', 'api'],
  },
  validateSearch: (search) =>
    z
      .object({
        offset: z.number().int().optional(),
        q: z.string().optional(),
        producersIds: z.array(z.string()).optional(),
      })
      .parse(search),
  loaderDeps: (d) => d.search,
  loader: ({ context: { queryClient }, deps }) => {
    void queryClient.ensureQueryData(
      getCatalogListQueryOptions({
        ...deps,
        offset: deps.offset || 0,
        limit: PAGINATION_LIMIT,
        states: CATALOG_ESERVICES_STATES,
      })
    )
  },
  component: ConsumerEServiceCatalogPage,
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

  // const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 12 })
  // const { filtersParams, ...filtersHandlers } = useFilters<
  //   Omit<GetEServicesCatalogParams, 'limit' | 'offset'>
  // >([
  //   { name: 'q', label: tEservice('nameField.label'), type: 'freetext' },
  //   {
  //     name: 'producersIds',
  //     label: tEservice('providerField.label'),
  //     type: 'autocomplete-multiple',
  //     options: producersOptions,
  //     onTextInputChange: setProducersAutocompleteInput,
  //   },
  // ])

  const { q, offset, producersIds } = Route.useSearch()

  const { data, isFetching } = useQuery(
    getCatalogListQueryOptions({
      // Only e-service published or suspended can be shown in the catalog
      states: CATALOG_ESERVICES_STATES,
      q,
      offset: offset || 0,
      producersIds,
      limit: PAGINATION_LIMIT,
    })
  )

  return (
    <PageContainer title={t('title')} description={t('description')}>
      {/* <Filters {...filtersHandlers} /> */}
      {!data && isFetching ? (
        <EServiceCatalogGridSkeleton />
      ) : (
        <EServiceCatalogGrid eservices={data?.results} />
      )}
      {/* <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(data?.pagination.totalCount)}
      /> */}
    </PageContainer>
  )
}
