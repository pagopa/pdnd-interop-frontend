import { EServiceQueries } from '@/api/eservice'
import { usePagination } from '@/hooks/usePagination'
import { Box } from '@mui/material'
import { MIPagination } from '@pagopa/mui-italia'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'
import type { CatalogFilterPayload } from '@/api/api.generatedTypes'
import EmptyStateBanner from './components/EmptyStateBanner'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

type FeaturedTabProps = {
  onGoToCatalog: () => void
}

type EmptyStateKey = 'eservices.error' | 'eservices.noResults' | 'useCases' | 'eservicesAndUseCases'

const FeaturedTab: React.FC<FeaturedTabProps> = ({ onGoToCatalog }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'featuredList' })
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({
    limit: 6,
    limitOptions: [6],
  })

  // Only e-service published or suspended can be shown in the catalog
  // const states: Array<EServiceDescriptorState> = ['PUBLISHED', 'SUSPENDED']
  const query: CatalogFilterPayload = {
    ...paginationParams,
    availableForRequester: true,
    subscribedByRequester: false,
    sortBy: 'CREATED_AT_DESC',
    // TODO remove raccolte
  }

  const { data, isError } = useQuery({
    ...EServiceQueries.queryCatalogList(query),
    placeholderData: keepPreviousData,
  })

  const totalPageCount =
    getTotalPageCount(data?.pagination.totalCount) <= 2
      ? getTotalPageCount(data?.pagination.totalCount)
      : 2

  const eservicesEmptyState =
    isError && !data ? 'error' : data && data.results.length === 0 ? 'noResults' : undefined

  const useCasesEmptyState = isError // TODO

  const emptyState = match([eservicesEmptyState, useCasesEmptyState] as const)
    .returnType<EmptyStateKey | undefined>()
    .with([P.not(undefined), true], () => 'eservicesAndUseCases')
    .with(['error', false], () => 'eservices.error')
    .with(['noResults', false], () => 'eservices.noResults')
    .with([undefined, true], () => 'useCases')
    .with([undefined, false], () => undefined)
    .exhaustive()

  return (
    <>
      {emptyState && (
        <EmptyStateBanner
          title={t(`emptyStateBanner.${emptyState}.title`)}
          description={t(`emptyStateBanner.${emptyState}.description`)}
          onGoToCatalog={onGoToCatalog}
        />
      )}

      {!eservicesEmptyState && <EServiceCatalogWrapper params={query} />}

      {data && data.pagination.totalCount !== 0 && (
        <Box mt={3}>
          <MIPagination
            page={paginationProps.page}
            count={totalPageCount}
            onChange={(_, page) => paginationProps.onPageChange(page)}
          />
        </Box>
      )}
    </>
  )
}

const EServiceCatalogWrapper: React.FC<{ params: CatalogFilterPayload }> = ({ params }) => {
  const { data, isFetching } = useQuery(EServiceQueries.queryCatalogList(params))

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />
  return <EServiceCatalogGrid eservices={data?.results} />
}

export default FeaturedTab
