import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, Box, Button, Typography } from '@mui/material'
import {
  MIIconButton,
  MITable,
  type MIPaginationProps,
  type MITableColumn,
} from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import type {
  ProducerEServiceMonitoringSaturation,
  ProducerEServiceMonitoringSaturationItem,
  SaturationSortBy,
} from '@/api/api.generatedTypes'
import { SaturationDonut } from '@/components/shared/SaturationDonut/SaturationDonut'
import { routes, useNavigate } from '@/router'
import { formatThousands } from '@/utils/format.utils'

type ProviderEServiceMonitoringConsumersTableProps = {
  eserviceId: string
  descriptorId: string
  consumersData?: ProducerEServiceMonitoringSaturation
  pagination?: MIPaginationProps
  isLoading?: boolean
  isFetching?: boolean
  isError?: boolean
  onRetry?: () => void
  queryParams?: {
    offset?: number
    limit?: number
    q?: string
    sortBy?: SaturationSortBy
  }
}

/** Top five consumers of the selected version by expected threshold consumption. */
export function ProviderEServiceMonitoringConsumersTable({
  eserviceId,
  descriptorId,
  consumersData,
  pagination,
  isLoading,
  isFetching,
  isError,
  onRetry,
}: Readonly<ProviderEServiceMonitoringConsumersTableProps>) {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.monitoring.consumers' })
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()

  const consumers = consumersData?.results ?? []
  const isEmpty = !isLoading && (!consumersData || consumers.length === 0)

  const canViewConsumer = routes.PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL.authLevels.some(
    (role) => currentRoles.includes(role)
  )

  const columns: MITableColumn<ProducerEServiceMonitoringSaturationItem>[] = [
    {
      id: 'consumer',
      header: t('columns.consumer'),
      renderCell: (row) => (
        <Typography component="span" variant="body2" fontWeight={600}>
          {row.consumer.name}
        </Typography>
      ),
    },
    {
      id: 'purposes',
      header: t('columns.purposes'),
      renderCell: (row) => formatThousands(row.activePurposesCount),
    },
    {
      id: 'percentage',
      header: t('columns.percentage'),
      renderCell: (row) => (
        <SaturationDonut
          percentage={row.percentage}
          label={t('percentage', { value: formatThousands(row.percentage) })}
        />
      ),
    },
    {
      id: 'calls',
      header: t('columns.calls'),
      renderCell: (row) =>
        t('dailyCalls', {
          approved: formatThousands(row.approvedDailyCalls),
          total: formatThousands(row.dailyCallsPerConsumer),
        }),
    },
    {
      id: 'callsToApprove',
      header: t('columns.callsToApprove'),
      renderCell: (row) => formatThousands(row.waitingForApprovalDailyCalls),
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      renderCell: (row) =>
        canViewConsumer ? (
          <MIIconButton
            aria-label={t('viewConsumerAriaLabel', { name: row.consumer.name })}
            onClick={() =>
              navigate('PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL', {
                params: { eserviceId, descriptorId, consumerId: row.consumer.id },
              })
            }
          >
            <ChevronRightIcon />
          </MIIconButton>
        ) : null,
    },
  ]

  if (isError) {
    return (
      <Alert
        severity="error"
        sx={{ mt: 3 }}
        action={
          <Button color="inherit" size="small" onClick={onRetry} disabled={isFetching}>
            {t('retry')}
          </Button>
        }
      >
        {t('loadError')}
      </Alert>
    )
  }

  if (isEmpty) {
    return <Typography>{t('empty')}</Typography>
  }

  return (
    <>
      <Box
        sx={{ mt: 3 }}
        aria-busy={isFetching}
        role={isLoading ? 'status' : undefined}
        aria-label={isLoading ? t('loading') : undefined}
      >
        <MITable
          columns={columns}
          rows={consumers}
          isLoading={isLoading}
          getRowId={(row) => row.consumer.id}
          pagination={pagination}
          desktopTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
          mobileTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
        />
      </Box>
    </>
  )
}
