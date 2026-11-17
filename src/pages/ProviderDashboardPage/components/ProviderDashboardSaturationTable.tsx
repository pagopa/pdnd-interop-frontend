import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { MITable, type MITableColumn } from '@pagopa/mui-italia'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ProducerQueries } from '@/api/producer'
import type {
  GetProducerDashboardSaturationParams,
  ProducerDashboardSaturationItem,
} from '@/api/api.generatedTypes'
import { formatThousands } from '@/utils/format.utils'
import { SaturationDonut } from '@/components/shared/SaturationDonut/SaturationDonut'
import { DashboardEServiceAction } from './DashboardEServiceAction'

/** Top five e-service versions by projected consumption. Summary/pagination are not used. */
export const DASHBOARD_SATURATION_PARAMS: GetProducerDashboardSaturationParams = {
  offset: 0,
  limit: 5,
  sortBy: 'PERCENTAGE_DESC',
}

export function ProviderDashboardSaturationTable() {
  const { t } = useTranslation('pages', { keyPrefix: 'dashboard.sections.thresholds' })
  const { t: tHeaders } = useTranslation('dashboard', {
    keyPrefix: 'providerSaturationRatePage.table.headlabels',
  })
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    ProducerQueries.getDashboardSaturation(DASHBOARD_SATURATION_PARAMS)
  )

  const columns: MITableColumn<ProducerDashboardSaturationItem>[] = [
    {
      id: 'eservice',
      header: tHeaders('eserviceAndVersion'),
      renderCell: (row) => (
        <Stack component="span" spacing={0.5}>
          <Typography component="span" variant="body2" fontWeight={600}>
            {row.eservice.name}
          </Typography>
          <Typography component="span" variant="caption" color="text.secondary">
            {t('version', { version: row.version })}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'purposes',
      header: tHeaders('purposesNumber'),
      renderCell: (row) => formatThousands(row.activePurposesCount),
    },
    {
      id: 'percentage',
      header: tHeaders('percentageRate'),
      renderCell: (row) => (
        <SaturationDonut
          percentage={row.percentage}
          label={t('percentage', { value: formatThousands(row.percentage) })}
        />
      ),
    },
    {
      id: 'calls',
      header: tHeaders('approvedCalls'),
      renderCell: (row) =>
        t('dailyCalls', {
          approved: formatThousands(row.approvedDailyCalls),
          total: formatThousands(row.dailyCallsTotal),
        }),
    },
    {
      id: 'callsToApprove',
      header: tHeaders('callsToApprove'),
      renderCell: (row) => formatThousands(row.waitingForApprovalDailyCalls),
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      renderCell: (row) => (
        <DashboardEServiceAction
          eserviceId={row.eservice.id}
          descriptorId={row.descriptorId}
          versionAriaLabel={t('viewVersionAriaLabel', {
            version: row.version,
            name: row.eservice.name,
          })}
        />
      ),
    },
  ]

  if (isError) {
    return (
      <Alert
        severity="error"
        sx={{ mt: 3 }}
        action={
          <Button color="inherit" size="small" onClick={() => refetch()} disabled={isFetching}>
            {t('retry')}
          </Button>
        }
      >
        {t('loadError')}
      </Alert>
    )
  }

  return (
    <Box
      sx={{ mt: 3 }}
      aria-busy={isFetching}
      role={isPending ? 'status' : undefined}
      aria-label={isPending ? t('loading') : undefined}
    >
      <MITable
        columns={columns}
        rows={data?.results ?? []}
        isLoading={isPending}
        getRowId={(row) => `${row.eservice.id}-${row.descriptorId}`}
        desktopTableProps={{ 'aria-label': t('columns.eservice'), 'aria-busy': isFetching }}
        mobileTableProps={{ 'aria-label': t('columns.eservice'), 'aria-busy': isFetching }}
      />
      {!isPending && data?.results.length === 0 && <Typography>{t('empty')}</Typography>}
    </Box>
  )
}
