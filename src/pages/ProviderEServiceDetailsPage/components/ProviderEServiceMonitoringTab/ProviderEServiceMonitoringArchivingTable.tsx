import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, Box, Button, Typography } from '@mui/material'
import { MIIconButton, MITable, type MITableColumn } from '@pagopa/mui-italia'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ProducerQueries } from '@/api/producer'
import type { MonitoringArchivingRow } from '@/api/api.generatedTypes'
import { ArchivingDateCell } from '@/components/shared/ArchivingDateCell'
import { formatThousands } from '@/utils/format.utils'

type ProviderEServiceMonitoringArchivingTableProps = {
  eserviceId: string
}

/** Versions of the e-service being archived, preserving backend order. */
export function ProviderEServiceMonitoringArchivingTable({
  eserviceId,
}: Readonly<ProviderEServiceMonitoringArchivingTableProps>) {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.monitoring.archiving' })
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    ProducerQueries.getEServiceMonitoringArchiving({ eserviceId })
  )

  const getVersionLabel = (row: MonitoringArchivingRow) =>
    row.version ? t('version', { version: row.version }) : t('wholeEService')

  const columns: MITableColumn<MonitoringArchivingRow>[] = [
    {
      id: 'version',
      header: t('columns.version'),
      renderCell: (row) => (
        <Typography component="span" variant="body2" fontWeight={600}>
          {getVersionLabel(row)}
        </Typography>
      ),
    },
    {
      id: 'consumers',
      header: t('columns.consumers'),
      renderCell: (row) => formatThousands(row.consumersCount),
    },
    {
      id: 'archivableOn',
      header: t('columns.archivableOn'),
      renderCell: (row) => <ArchivingDateCell archivableOn={row.archivableOn} />,
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      // TODO: Link the chevron to the consumer list for the selected version.
      renderCell: (row) => (
        <MIIconButton
          aria-label={t('viewConsumersAriaLabel', { version: getVersionLabel(row) })}
          disabled
        >
          <ChevronRightIcon />
        </MIIconButton>
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
        getRowId={(row, index) => `${row.descriptorId ?? 'eservice'}-${index}`}
        desktopTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
        mobileTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
      />
      {!isPending && data?.results.length === 0 && <Typography>{t('empty')}</Typography>}
    </Box>
  )
}
