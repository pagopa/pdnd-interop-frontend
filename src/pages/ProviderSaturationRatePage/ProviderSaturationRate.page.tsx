import { PageContainer } from '@/components/layout/containers/PageContainer'
import { ProviderDashboardSaturationTable } from '@/pages/ProviderDashboardPage/components/ProviderDashboardSaturationTable'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import type { ProducerDashboardSaturation, SaturationSortBy } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { useFilters } from '@/hooks/useFilters'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import type { MIPaginationProps } from '@pagopa/mui-italia'
import { useSorting } from '@/hooks/useSorting'
import { usePagination } from '@/hooks/usePagination'
import { Stack } from '@mui/system'
import { Skeleton } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProducerQueries } from '@/api/producer'

const sortByOptions: SaturationSortBy[] = [
  'PERCENTAGE_ASC',
  'PERCENTAGE_DESC',
  'NAME_ASC',
  'NAME_DESC',
]

const DEFAULT_SORT_BY: SaturationSortBy = 'PERCENTAGE_ASC'

type SaturationSummaryKey = keyof ProducerDashboardSaturation['summary']

const ProviderSaturationRatePage: React.FC = () => {
  const { t } = useTranslation('dashboard', { keyPrefix: 'providerSaturationRatePage' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()

  const { filters, ...filtersHandlers } = useFilters<{ q: string }>([
    {
      name: 'q',
      label: t('filters.label'),
      type: 'freetext',
    },
  ])

  const sortByLabels: Record<SaturationSortBy, string> = {
    PERCENTAGE_ASC: t('sorting.percentageAtAsc'),
    PERCENTAGE_DESC: t('sorting.percentageAtDesc'),
    NAME_ASC: t('sorting.nameAsc'),
    NAME_DESC: t('sorting.nameDesc'),
  }

  const sorting = useSorting(
    sortByOptions.map((sortBy) => ({
      value: sortBy,
      label: sortByLabels[sortBy],
    })),
    DEFAULT_SORT_BY
  )

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    ...ProducerQueries.getDashboardSaturation({
      ...paginationParams,
      q: filters.q || undefined,
      sortBy: sorting.sortBy as SaturationSortBy,
    }),
    placeholderData: keepPreviousData,
    // Handled inline below with an explicit retry instead of the route-level error boundary.
    throwOnError: false,
  })

  const tablePagination: MIPaginationProps | undefined =
    data && data.pagination.totalCount > 0
      ? {
          page: paginationProps.page,
          onChange: (_, page) => paginationProps.onPageChange(page),
          count: getTotalPageCount(data.pagination.totalCount),
          itemsPerPageOptions: paginationProps.itemsPerPageOptions,
        }
      : undefined

  const renderSummary = (key: SaturationSummaryKey) => {
    if (isError) return t('unavailable')
    if (!data) return <Skeleton width={80} aria-hidden="true" />
    return String(data.summary[key])
  }

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      dashboardFlow
      titleAction={
        <MIButton onClick={() => {}} variant="outlined" startIcon={<UploadFileIcon />}>
          {tCommon('export')}
        </MIButton>
      }
    >
      <Stack spacing={2} sx={{ pt: 3, pb: 6 }}>
        <InformationContainer
          label={t('eserviceOverThreshold')}
          content={renderSummary('overThreshold')}
        />
        <InformationContainer
          label={t('eserviceNearThreshold')}
          content={renderSummary('nearThreshold')}
        />
        <InformationContainer label={t('totalEservices')} content={renderSummary('total')} />
      </Stack>
      <FiltersSection
        filters={filters}
        {...filtersHandlers}
        sorting={{
          ...sorting,
          onSortingChange: (value) => {
            sorting.onSortingChange(value)
            paginationProps.onPageChange(1)
          },
        }}
        showResults={false}
        submitButtonVariant="outlined"
      />
      <ProviderDashboardSaturationTable
        saturationItems={data?.results ?? []}
        pagination={tablePagination}
        isLoading={isPending}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
      />
    </PageContainer>
  )
}

export default ProviderSaturationRatePage
