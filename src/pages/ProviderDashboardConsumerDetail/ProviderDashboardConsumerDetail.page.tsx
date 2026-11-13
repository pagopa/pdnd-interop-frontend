import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, Box, Button, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import { MIButton, MITable, type MITableColumn } from '@pagopa/mui-italia'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ProducerQueries } from '@/api/producer'
import type {
  ConsumerEServicesSortBy,
  ProducerDashboardConsumer,
  ProducerDashboardConsumerEService,
} from '@/api/api.generatedTypes'
import { PageContainer } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useGeneratePath, useParams } from '@/router'
import { Link as RouterLink } from 'react-router-dom'
import { formatThousands } from '@/utils/format.utils'

const sortByOptions: ConsumerEServicesSortBy[] = [
  'NAME_ASC',
  'NAME_DESC',
  'DAILY_CALLS_DESC',
  'DAILY_CALLS_ASC',
]

export default function ProviderDashboardConsumerDetail() {
  const { t } = useTranslation('pages', { keyPrefix: 'providerDashboardConsumerDetail' })
  const { consumerId } = useParams<'PROVIDE_DASHBOARD_CONSUMER_DETAIL'>()
  const generatePath = useGeneratePath()
  const filtersHandlers = useFilters<{ q: string }>([
    { name: 'q', label: t('searchPlaceholder'), type: 'freetext' },
  ])
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()
  const sorting = useSorting(
    sortByOptions.map((value) => ({ value, label: t(`sorting.${value}`) })),
    'NAME_ASC'
  )
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    ...ProducerQueries.getDashboardConsumer({
      consumerId,
      ...paginationParams,
      q: filtersHandlers.filters.q || undefined,
      sortBy: sorting.sortBy as ConsumerEServicesSortBy,
    }),
    // Keep rows only while paging/filtering the same consumer: never show another consumer's data.
    placeholderData: (previous?: ProducerDashboardConsumer) =>
      previous?.consumer?.id === consumerId ? previous : undefined,
  })

  const consumer = isError ? undefined : data?.consumer
  const isNoRelationship = !isError && Boolean(data) && !data?.consumer

  const columns: MITableColumn<ProducerDashboardConsumerEService>[] = [
    {
      id: 'eservice',
      header: t('columns.eservice'),
      renderCell: (row) => (
        <Stack component="span" spacing={0.25}>
          <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
            {row.eservice.name}
          </Typography>
          <Typography component="span" variant="caption" color="text.secondary">
            {t('version', { version: row.version })}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'agreement',
      header: t('columns.agreementState'),
      renderCell: (row) => (
        <StatusChip component="span" for="agreementState" state={row.agreement.state} />
      ),
    },
    {
      id: 'purposes',
      header: t('columns.activePurposesCount'),
      renderCell: (row) => String(row.activePurposesCount),
    },
    {
      id: 'calls',
      header: t('columns.approvedDailyCalls'),
      renderCell: (row) => formatThousands(row.approvedDailyCalls),
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      renderCell: (row) => (
        <IconButton
          component={RouterLink}
          color="inherit"
          to={generatePath('PROVIDE_ESERVICE_MANAGE', {
            eserviceId: row.eservice.id,
            descriptorId: row.descriptorId,
          })}
          aria-label={t('goToEServiceDetail', { name: row.eservice.name, version: row.version })}
        >
          <ChevronRightIcon />
        </IconButton>
      ),
    },
  ]

  const summaryTotal = (() => {
    if (isError) return t('unavailable')
    if (!data) return <Skeleton width={80} />
    return data.eservicesCount
  })()

  return (
    <PageContainer
      dashboardFlow
      isLoading={isPending}
      title={consumer?.name ?? t('fallbackTitle')}
      description={t('description')}
    >
      {!isPending && (
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
      )}
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
          {summaryTotal}
        </Typography>
      </Box>

      {isNoRelationship ? (
        <Alert severity="info" sx={{ mt: 3 }}>
          {t('noRelationship')}
        </Alert>
      ) : (
        <>
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
            <Alert
              severity="error"
              action={<Button onClick={() => refetch()}>{t('retry')}</Button>}
            >
              {t('loadError')}
            </Alert>
          ) : (
            <Box aria-busy={isFetching}>
              <MITable
                columns={columns}
                rows={data?.results ?? []}
                isLoading={isPending}
                getRowId={(row) => `${row.eservice.id}-${row.descriptorId}`}
                desktopTableProps={{
                  'aria-label': consumer?.name ?? t('fallbackTitle'),
                  'aria-busy': isFetching,
                }}
                mobileTableProps={{
                  'aria-label': consumer?.name ?? t('fallbackTitle'),
                  'aria-busy': isFetching,
                }}
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
        </>
      )}
    </PageContainer>
  )
}
