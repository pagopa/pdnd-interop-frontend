import ArrowForward from '@mui/icons-material/ArrowForward'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { MIButton, MIIconButton, MITable, type MITableColumn } from '@pagopa/mui-italia'
import { useId } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { ProducerQueries } from '@/api/producer'
import type { ProducerEServiceMonitoringSaturationItem } from '@/api/api.generatedTypes'
import { SaturationDonut } from '@/components/shared/SaturationDonut/SaturationDonut'
import { routes, useNavigate } from '@/router'
import { formatThousands } from '@/utils/format.utils'
import { MONITORING_CONSUMERS_PREVIEW_PARAMS } from './monitoring.constants'

type ProviderEServiceMonitoringConsumersTableProps = {
  eserviceId: string
  descriptorId: string
}

/** Top five consumers of the selected version by expected threshold consumption. */
export function ProviderEServiceMonitoringConsumersTable({
  eserviceId,
  descriptorId,
}: Readonly<ProviderEServiceMonitoringConsumersTableProps>) {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.monitoring.consumers' })
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()
  const viewAllDescriptionId = useId()
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    ProducerQueries.getEServiceMonitoringSaturation({
      eserviceId,
      descriptorId,
      ...MONITORING_CONSUMERS_PREVIEW_PARAMS,
    })
  )

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
    <>
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
          getRowId={(row) => row.consumer.id}
          desktopTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
          mobileTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
        />
        {!isPending && data?.results.length === 0 && <Typography>{t('empty')}</Typography>}
      </Box>
      {/* No per-version consumer list route exists yet: disabled with a visible explanation. */}
      <Stack spacing={0.5} alignItems="flex-start" sx={{ mt: 2 }}>
        <MIButton
          type="button"
          variant="text"
          color="primary"
          endIcon={<ArrowForward />}
          disabled
          aria-describedby={viewAllDescriptionId}
        >
          {t('viewAll')}
        </MIButton>
        <Typography id={viewAllDescriptionId} variant="caption" color="text.secondary">
          {t('viewAllUnavailable')}
        </Typography>
      </Stack>
    </>
  )
}
