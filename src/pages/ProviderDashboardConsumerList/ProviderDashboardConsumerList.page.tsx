import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Alert, Box, Button, Skeleton, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import { MIPagination } from '@pagopa/mui-italia'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProducerQueries } from '@/api/producer'
import type { ProducerConsumersSortBy } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/layout/containers'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useNavigate } from '@/router'
import type { ActionItemButton } from '@/types/common.types'

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
  const headLabels = [
    t('columns.consumer'),
    t('columns.eservicesCount'),
    t('columns.activePurposesCount'),
    t('columns.actions'),
  ]
  const summaryTotal = data ? data.totalConsumers : <Skeleton width={80} />

  const exportAction: ActionItemButton[] = [
    {
      action: () => undefined,
      label: t('export'),
      icon: FileDownloadOutlinedIcon,
      color: 'primary',
      variant: 'outlined',
    },
  ]

  return (
    <PageContainer title={t('title')} description={t('description')} topSideActions={exportAction}>
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
                      <Skeleton key="name" width={200} />,
                      <Skeleton key="eservices" width={60} />,
                      <Skeleton key="purposes" width={60} />,
                    ]}
                  >
                    <Skeleton width={120} />
                  </TableRow>
                ))
              : data?.results.map(({ consumer, eservicesCount, activePurposesCount }) => (
                  <TableRow
                    key={consumer.id}
                    cellData={[consumer.name, String(eservicesCount), String(activePurposesCount)]}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      aria-label={t('goToConsumerDetail', { name: consumer.name })}
                      onClick={() =>
                        navigate('PROVIDE_DASHBOARD_CONSUMER_DETAIL', {
                          params: { consumerId: consumer.id },
                        })
                      }
                    >
                      {t('goToDetail')}
                    </Button>
                  </TableRow>
                ))}
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
    </PageContainer>
  )
}
