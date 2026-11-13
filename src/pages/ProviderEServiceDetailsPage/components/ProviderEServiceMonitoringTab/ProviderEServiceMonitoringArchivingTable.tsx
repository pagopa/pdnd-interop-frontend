import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material'
import { MIIconButton, MITable, type MITableColumn } from '@pagopa/mui-italia'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { ProducerQueries } from '@/api/producer'
import type { MonitoringArchivingRow } from '@/api/api.generatedTypes'
import { routes, useNavigate } from '@/router'
import { formatDateStringNumeric, formatThousands } from '@/utils/format.utils'
import { PROVIDER_ESERVICE_MONITORING_TAB } from './monitoring.constants'
import { getArchivingRelativeDate } from './monitoring.utils'
import { MonitoringUnavailableIconAction } from './MonitoringUnavailableIconAction'

type ProviderEServiceMonitoringArchivingTableProps = {
  eserviceId: string
  descriptorId: string
}

/** Versions of the e-service being archived, preserving backend order. */
export function ProviderEServiceMonitoringArchivingTable({
  eserviceId,
  descriptorId,
}: Readonly<ProviderEServiceMonitoringArchivingTableProps>) {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.monitoring.archiving' })
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    ProducerQueries.getEServiceMonitoringArchiving({ eserviceId })
  )

  const canOpenVersion = routes.PROVIDE_ESERVICE_MANAGE.authLevels.some((role) =>
    currentRoles.includes(role)
  )

  const getVersionLabel = (row: MonitoringArchivingRow) =>
    row.version ? t('version', { version: row.version }) : t('wholeEService')

  const getRelativeLabel = (archivableOn: string) => {
    const relative = getArchivingRelativeDate(archivableOn)
    if (!relative) return undefined
    if (relative.kind === 'inDays') return t('relative.inDays', { count: relative.count })
    return t(`relative.${relative.kind}`)
  }

  const renderAction = (row: MonitoringArchivingRow) => {
    if (!canOpenVersion) return null
    const label = t('viewVersionAriaLabel', { version: row.version ?? getVersionLabel(row) })
    if (!row.descriptorId) {
      return <MonitoringUnavailableIconAction label={label} reason={t('noVersion')} />
    }
    if (row.descriptorId === descriptorId) {
      return <MonitoringUnavailableIconAction label={label} reason={t('currentVersion')} />
    }
    const targetDescriptorId = row.descriptorId
    return (
      <MIIconButton
        aria-label={label}
        onClick={() =>
          navigate('PROVIDE_ESERVICE_MANAGE', {
            params: { eserviceId: row.eservice.id, descriptorId: targetDescriptorId },
            urlParams: { tab: PROVIDER_ESERVICE_MONITORING_TAB },
          })
        }
      >
        <ChevronRightIcon />
      </MIIconButton>
    )
  }

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
      renderCell: (row) => {
        const relativeLabel = getRelativeLabel(row.archivableOn)
        return (
          <Stack
            component="span"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <Typography component="span" variant="body2">
              {formatDateStringNumeric(row.archivableOn)}
            </Typography>
            {relativeLabel && <Chip component="span" size="small" label={relativeLabel} />}
          </Stack>
        )
      },
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      renderCell: renderAction,
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
