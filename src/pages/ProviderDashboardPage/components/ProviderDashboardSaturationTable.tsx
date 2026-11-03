import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ProducerQueries } from '@/api/producer'
import type { GetProducerDashboardSaturationParams } from '@/api/api.generatedTypes'
import { formatThousands } from '@/utils/format.utils'
import { DashboardEServiceAction } from './DashboardEServiceAction'

/** Top five e-service versions by projected consumption. Summary/pagination are not used. */
export const DASHBOARD_SATURATION_PARAMS: GetProducerDashboardSaturationParams = {
  offset: 0,
  limit: 5,
  sortBy: 'PERCENTAGE_DESC',
}

const SKELETON_ROWS = 5

export function ProviderDashboardSaturationTable() {
  const { t } = useTranslation('pages', { keyPrefix: 'dashboard.sections.thresholds' })
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    ProducerQueries.getDashboardSaturation(DASHBOARD_SATURATION_PARAMS)
  )

  const headLabels = [
    t('columns.eservice'),
    t('columns.activePurposes'),
    t('columns.dailyCalls'),
    t('columns.percentage'),
    t('columns.actions'),
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

  if (isPending) {
    return (
      <Box role="status" aria-label={t('loading')} aria-busy="true" sx={{ mt: 3 }}>
        <Table headLabels={headLabels}>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <TableRow
              key={index}
              cellData={[
                <Skeleton key="eservice" width={200} />,
                <Skeleton key="purposes" width={60} />,
                <Skeleton key="calls" width={120} />,
                <Skeleton key="percentage" width={80} />,
              ]}
            >
              <Skeleton width={120} />
            </TableRow>
          ))}
        </Table>
      </Box>
    )
  }

  const rows = data.results

  return (
    <Box sx={{ mt: 3 }} aria-busy={isFetching}>
      <Table headLabels={headLabels} isEmpty={rows.length === 0} noDataLabel={t('empty')}>
        {rows.map((row) => (
          <TableRow
            key={`${row.eservice.id}-${row.descriptorId}`}
            cellData={[
              <Stack key="eservice" spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {row.eservice.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('version', { version: row.version })}
                </Typography>
              </Stack>,
              formatThousands(row.activePurposesCount),
              t('dailyCalls', {
                approved: formatThousands(row.approvedDailyCalls),
                total: formatThousands(row.dailyCallsTotal),
              }),
              <Stack key="percentage" spacing={0.5}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={row.percentage >= 100 ? 'error.dark' : 'text.primary'}
                >
                  {t('percentage', { value: formatThousands(row.percentage) })}
                </Typography>
                {row.waitingForApprovalDailyCalls > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {t('pendingCalls', {
                      value: formatThousands(row.waitingForApprovalDailyCalls),
                    })}
                  </Typography>
                )}
              </Stack>,
            ]}
          >
            <DashboardEServiceAction
              eserviceId={row.eservice.id}
              descriptorId={row.descriptorId}
              versionLabel={t('viewVersion')}
              versionAriaLabel={t('viewVersionAriaLabel', {
                version: row.version,
                name: row.eservice.name,
              })}
            />
          </TableRow>
        ))}
      </Table>
    </Box>
  )
}
