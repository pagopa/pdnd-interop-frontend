import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ProducerQueries } from '@/api/producer'
import { formatDateStringNumeric, formatThousands } from '@/utils/format.utils'
import { DashboardEServiceAction } from './DashboardEServiceAction'

const SKELETON_ROWS = 5

/**
 * Rows are rendered exactly in backend order (ascending archiving date), all of them.
 * `descriptorId` and `version` are independently optional in the generated contract:
 * navigation depends on `descriptorId` alone, the caption on `version` alone, and the
 * "whole e-service" label is used only when both are absent.
 */
export function ProviderDashboardArchivingTable() {
  const { t } = useTranslation('pages', { keyPrefix: 'dashboard.sections.archiving' })
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    ProducerQueries.getDashboardArchiving()
  )

  const headLabels = [
    t('columns.eservice'),
    t('columns.consumers'),
    t('columns.archivableOn'),
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
                <Skeleton key="consumers" width={60} />,
                <Skeleton key="date" width={100} />,
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
        {rows.map((row, index) => {
          const { descriptorId, version } = row
          const isWholeEService = !descriptorId && !version
          return (
            <TableRow
              key={`${row.eservice.id}-${descriptorId ?? 'eservice'}-${index}`}
              cellData={[
                <Stack key="eservice" spacing={0.5}>
                  <Typography variant="body2" fontWeight={600}>
                    {row.eservice.name}
                  </Typography>
                  {(version || isWholeEService) && (
                    <Typography variant="caption" color="text.secondary">
                      {version ? t('version', { version }) : t('wholeEService')}
                    </Typography>
                  )}
                </Stack>,
                formatThousands(row.consumersCount),
                formatDateStringNumeric(row.archivableOn),
              ]}
            >
              <DashboardEServiceAction
                eserviceId={row.eservice.id}
                descriptorId={descriptorId}
                versionLabel={t('viewVersion')}
                versionAriaLabel={
                  version
                    ? t('viewVersionAriaLabel', { version, name: row.eservice.name })
                    : t('viewUnnumberedVersionAriaLabel', { name: row.eservice.name })
                }
                listLabel={t('viewEServices')}
                listAriaLabel={t('viewEServicesAriaLabel', { name: row.eservice.name })}
              />
            </TableRow>
          )
        })}
      </Table>
    </Box>
  )
}
