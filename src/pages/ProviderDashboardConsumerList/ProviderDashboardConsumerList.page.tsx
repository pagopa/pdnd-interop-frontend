import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import { MIButton, MIIconButton, MITable, type MITableColumn } from '@pagopa/mui-italia'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProducerQueries } from '@/api/producer'
import type {
  ProducerConsumersSortBy,
  ProducerDashboardConsumerItem,
} from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/layout/containers'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useNavigate } from '@/router'

const sortByOptions: ProducerConsumersSortBy[] = [
  'NAME_ASC',
  'NAME_DESC',
  'ESERVICES_COUNT_DESC',
  'ESERVICES_COUNT_ASC',
]

export default function ProviderDashboardConsumerList() {
  const { t } = useTranslation('pages', { keyPrefix: 'providerDashboardConsumerList' })
  const navigate = useNavigate()
  const filtersHandlers = useFilters<{ q: string }>([
    { name: 'q', label: t('searchPlaceholder'), type: 'freetext' },
  ])
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()
  const sorting = useSorting(
    sortByOptions.map((value) => ({ value, label: t(`sorting.${value}`) })),
    'NAME_ASC'
  )
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    ...ProducerQueries.getDashboardConsumers({
      ...paginationParams,
      q: filtersHandlers.filters.q || undefined,
      sortBy: sorting.sortBy as ProducerConsumersSortBy,
    }),
    placeholderData: keepPreviousData,
  })
  const columns: MITableColumn<ProducerDashboardConsumerItem>[] = [
    { id: 'consumer', header: t('columns.consumer'), renderCell: (row) => row.consumer.name },
    {
      id: 'eservices',
      header: t('columns.eservicesCount'),
      renderCell: (row) => String(row.eservicesCount),
    },
    {
      id: 'purposes',
      header: t('columns.activePurposesCount'),
      renderCell: (row) => String(row.activePurposesCount),
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      renderCell: ({ consumer }) => (
        <MIIconButton
          aria-label={t('goToConsumerDetail', { name: consumer.name })}
          onClick={() =>
            navigate('PROVIDE_DASHBOARD_CONSUMER_DETAIL', { params: { consumerId: consumer.id } })
          }
        >
          <ChevronRightIcon />
        </MIIconButton>
      ),
    },
  ]
  const summaryTotal = data ? data.totalConsumers : <Skeleton width={80} />

  return (
    <PageContainer dashboardFlow title={t('title')} description={t('description')}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ minHeight: 40, mb: 1 }}
      >
        <MIButton
          onClick={() => undefined}
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<FileDownloadOutlinedIcon />}
        >
          {t('export')}
        </MIButton>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
          alignItems: 'center',
          columnGap: 1,
          rowGap: 0.5,
          mt: 3,
        }}
      >
        <Typography component="span" variant="body1">
          {t('summary')}
        </Typography>
        <Typography component="span" variant="h4" sx={{ fontWeight: 700 }}>
          {isError ? t('unavailable') : summaryTotal}
        </Typography>
      </Box>

      <FiltersSection
        {...filtersHandlers}
        results={data?.pagination.totalCount}
        showResults={Boolean(data) && !isError}
        submitButtonVariant="outlined"
        sorting={{
          ...sorting,
          onSortingChange: (value) => {
            sorting.onSortingChange(value)
            paginationProps.onPageChange(1)
          },
        }}
      />

      {isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>{t('retry')}</Button>}>
          {t('loadError')}
        </Alert>
      ) : (
        <Box aria-busy={isFetching}>
          <MITable
            columns={columns}
            rows={data?.results ?? []}
            isLoading={isPending}
            getRowId={(row) => row.consumer.id}
            desktopTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
            mobileTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
            pagination={
              data && data.pagination.totalCount > 0
                ? {
                    page: paginationProps.page,
                    itemsPerPageOptions: paginationProps.itemsPerPageOptions,
                    count: getTotalPageCount(data.pagination.totalCount),
                    onChange: (_, page) => paginationProps.onPageChange(page),
                  }
                : undefined
            }
          />
          {!isPending && data?.results.length === 0 && (
            <Typography role="status">{t('empty')}</Typography>
          )}
        </Box>
      )}
    </PageContainer>
  )
}
