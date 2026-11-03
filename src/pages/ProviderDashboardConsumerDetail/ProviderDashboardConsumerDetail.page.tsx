import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import { MIPagination } from '@pagopa/mui-italia'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ProducerQueries } from '@/api/producer'
import type { ConsumerEServicesSortBy, ProducerDashboardConsumer } from '@/api/api.generatedTypes'
import { PageContainer } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { Link, useParams } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
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

  const exportAction: ActionItemButton[] = [
    {
      action: () => undefined,
      label: t('export'),
      icon: FileDownloadOutlinedIcon,
      color: 'primary',
      variant: 'outlined',
    },
  ]

  const headLabels = [
    t('columns.eservice'),
    t('columns.agreementState'),
    t('columns.activePurposesCount'),
    t('columns.approvedDailyCalls'),
    t('columns.actions'),
  ]

  const summaryTotal = (() => {
    if (isError) return t('unavailable')
    if (!data) return <Skeleton width={80} />
    return data.eservicesCount
  })()

  return (
    <PageContainer
      isLoading={isPending}
      title={consumer?.name ?? t('fallbackTitle')}
      description={t('description')}
      topSideActions={exportAction}
    >
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
              <Table
                headLabels={headLabels}
                isEmpty={!isPending && data?.results.length === 0}
                noDataLabel={t('empty')}
              >
                {isPending
                  ? Array.from({ length: 5 }, (_, index) => (
                      <TableRow
                        key={index}
                        cellData={[
                          <Skeleton key="eservice" width={200} />,
                          <Skeleton key="agreement" width={80} />,
                          <Skeleton key="purposes" width={60} />,
                          <Skeleton key="calls" width={80} />,
                        ]}
                      >
                        <Skeleton width={120} />
                      </TableRow>
                    ))
                  : data?.results.map(
                      ({
                        eservice,
                        descriptorId,
                        version,
                        agreement,
                        activePurposesCount,
                        approvedDailyCalls,
                      }) => (
                        <TableRow
                          key={`${eservice.id}-${descriptorId}`}
                          cellData={[
                            <Stack key="eservice" spacing={0.25}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {eservice.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t('version', { version })}
                              </Typography>
                            </Stack>,
                            <StatusChip
                              key="agreement"
                              for="agreementState"
                              state={agreement.state}
                            />,
                            String(activePurposesCount),
                            formatThousands(approvedDailyCalls),
                          ]}
                        >
                          <Link
                            as="button"
                            variant="outlined"
                            size="small"
                            to="PROVIDE_ESERVICE_MANAGE"
                            params={{ eserviceId: eservice.id, descriptorId }}
                            aria-label={t('goToEServiceDetail', { name: eservice.name, version })}
                          >
                            {t('goToEService')}
                          </Link>
                        </TableRow>
                      )
                    )}
              </Table>
              {data && data.pagination.totalCount > 0 && (
                <Box mt={3}>
                  <MIPagination
                    page={paginationProps.page}
                    itemsPerPageOptions={paginationProps.itemsPerPageOptions}
                    count={getTotalPageCount(data.pagination.totalCount)}
                    onChange={(_: React.ChangeEvent<unknown>, page: number) =>
                      paginationProps.onPageChange(page)
                    }
                  />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </PageContainer>
  )
}
