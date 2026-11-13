import { Alert, Box, Button, Typography } from '@mui/material'
import { MITable, type MITableColumn } from '@pagopa/mui-italia'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ProducerQueries } from '@/api/producer'
import type { MonitoringArchivingRow } from '@/api/api.generatedTypes'
import { formatDateStringNumeric, formatThousands } from '@/utils/format.utils'
import { DashboardEServiceAction } from './DashboardEServiceAction'

/** Preserve backend order and independently optional descriptor and version fields. */
export function ProviderDashboardArchivingTable() {
  const { t } = useTranslation('pages', { keyPrefix: 'dashboard.sections.archiving' })
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    ProducerQueries.getDashboardArchiving()
  )

  const columns: MITableColumn<MonitoringArchivingRow>[] = [
    {
      id: 'eservice',
      header: t('columns.eservice'),
      renderCell: (row) => (
        <Typography component="span" variant="body2" fontWeight={600}>
          {row.eservice.name}
        </Typography>
      ),
    },
    {
      id: 'version',
      header: t('columns.version'),
      renderCell: (row) =>
        row.version
          ? t('version', { version: row.version })
          : !row.descriptorId
            ? t('wholeEService')
            : '',
    },
    {
      id: 'consumers',
      header: t('columns.consumers'),
      renderCell: (row) => formatThousands(row.consumersCount),
    },
    {
      id: 'archivableOn',
      header: t('columns.archivableOn'),
      renderCell: (row) => formatDateStringNumeric(row.archivableOn),
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      renderCell: (row) => (
        <DashboardEServiceAction
          eserviceId={row.eservice.id}
          descriptorId={row.descriptorId}
          versionAriaLabel={
            row.version
              ? t('viewVersionAriaLabel', { version: row.version, name: row.eservice.name })
              : t('viewUnnumberedVersionAriaLabel', { name: row.eservice.name })
          }
          listLabel={t('viewEServices')}
          listAriaLabel={t('viewEServicesAriaLabel', { name: row.eservice.name })}
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
        getRowId={(row, index) => `${row.eservice.id}-${row.descriptorId ?? 'eservice'}-${index}`}
        desktopTableProps={{ 'aria-label': t('columns.eservice'), 'aria-busy': isFetching }}
        mobileTableProps={{ 'aria-label': t('columns.eservice'), 'aria-busy': isFetching }}
      />
      {!isPending && data?.results.length === 0 && <Typography>{t('empty')}</Typography>}
    </Box>
  )
}
