import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { MIIconButton, type MIPaginationProps, type MITableColumn } from '@pagopa/mui-italia'
import { MITable } from '@pagopa/mui-italia/components/MITable'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import type { ProducerDashboardSaturationItem } from '@/api/api.generatedTypes'
import { SaturationDonut } from '@/components/shared/SaturationDonut/SaturationDonut'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { EmptyTableState } from '@/components/shared/EmptyTableState/EmptyTableState'
import { ErrorIcon } from '@/icons/ErrorIcon'
import { formatThousands } from '@/utils/format.utils'
import { DashboardEServiceAction } from './DashboardEServiceAction'

interface SaturationRateTableProps {
  saturationItems: Array<ProducerDashboardSaturationItem>
  pagination?: MIPaginationProps
  isLoading?: boolean
  isFetching?: boolean
  isError?: boolean
  onRetry?: () => void
  dashboard?: boolean
  tableAriaLabel?: string
  actionHeader?: string
  versionLabel?: (version: string) => string
  percentageLabel?: (value: string) => string
  dailyCallsLabel?: (approved: string, total: string) => string
  renderRowAction?: (item: ProducerDashboardSaturationItem) => React.ReactNode
}

export function ProviderDashboardSaturationTable({
  saturationItems,
  pagination,
  isLoading = false,
  isFetching = false,
  isError = false,
  onRetry,
  dashboard = false,
  tableAriaLabel,
  actionHeader,
  versionLabel,
  percentageLabel,
  dailyCallsLabel,
  renderRowAction,
}: Readonly<SaturationRateTableProps>) {
  const navigate = useNavigate()
  const { t } = useTranslation('dashboard', { keyPrefix: 'providerSaturationRatePage.table' })
  const { t: tPage } = useTranslation('dashboard', { keyPrefix: 'providerSaturationRatePage' })
  const { t: tDashboard } = useTranslation('pages', { keyPrefix: 'dashboard.sections.thresholds' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'table' })
  const statusCopy = dashboard
    ? {
        retry: tDashboard('retry'),
        loadError: tDashboard('loadError'),
        loading: tDashboard('loading'),
      }
    : { retry: tPage('retry'), loadError: tPage('loadError'), loading: tPage('loading') }

  const renderAction = (item: ProducerDashboardSaturationItem) => {
    if (renderRowAction) return renderRowAction(item)
    if (dashboard) {
      return (
        <DashboardEServiceAction
          eserviceId={item.eservice.id}
          descriptorId={item.descriptorId}
          versionAriaLabel={tDashboard('viewVersionAriaLabel', {
            version: item.version,
            name: item.eservice.name,
          })}
        />
      )
    }
    return (
      <MIIconButton
        aria-label={tCommon('inspectEService')}
        onClick={() =>
          navigate('PROVIDE_ESERVICE_MANAGE', {
            params: { eserviceId: item.eservice.id, descriptorId: item.descriptorId },
            urlParams: { tab: 'monitoring' },
          })
        }
      >
        <ChevronRightIcon />
      </MIIconButton>
    )
  }

  const columns: Array<MITableColumn<ProducerDashboardSaturationItem>> = [
    {
      id: 'eservice',
      header: t('headlabels.eserviceAndVersion'),
      renderCell: (item) => (
        <Stack component="span" direction="column" spacing={0.5}>
          <Typography variant="body2" component="span" fontWeight={600}>
            {item.eservice.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="span">
            {versionLabel?.(item.version) ??
              (dashboard
                ? tDashboard('version', { version: item.version })
                : t('eserviceVersion', { version: item.version }))}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'purposes',
      header: t('headlabels.purposesNumber'),
      renderCell: (item) => (
        <Typography variant="body2" component="span">
          {formatThousands(item.activePurposesCount)}
        </Typography>
      ),
    },
    {
      id: 'percentage',
      header: t('headlabels.percentageRate'),
      renderCell: (item) => (
        <SaturationDonut
          percentage={item.percentage}
          label={
            percentageLabel?.(formatThousands(item.percentage)) ??
            (dashboard
              ? tDashboard('percentage', { value: formatThousands(item.percentage) })
              : `${formatThousands(item.percentage)}%`)
          }
        />
      ),
    },
    {
      id: 'approved_calls',
      header: t('headlabels.approvedCalls'),
      renderCell: (item) => (
        <Typography variant="body2" component="span">
          {dailyCallsLabel?.(
            formatThousands(item.approvedDailyCalls),
            formatThousands(item.dailyCallsTotal)
          ) ??
            (dashboard
              ? tDashboard('dailyCalls', {
                  approved: formatThousands(item.approvedDailyCalls),
                  total: formatThousands(item.dailyCallsTotal),
                })
              : `${formatThousands(item.approvedDailyCalls)} / ${formatThousands(item.dailyCallsTotal)}`)}
        </Typography>
      ),
    },
    {
      id: 'calls_to_approve',
      header: t('headlabels.callsToApprove'),
      renderCell: (item) => (
        <Typography variant="body2" component="span">
          {formatThousands(item.waitingForApprovalDailyCalls)}
        </Typography>
      ),
    },
    {
      id: 'go_to_eservice',
      header: actionHeader ?? (dashboard ? tDashboard('columns.actions') : ''),
      isAction: true,
      renderCell: renderAction,
    },
  ]

  if (isError) {
    return (
      <Alert
        severity="error"
        sx={dashboard ? { mt: 3 } : undefined}
        action={
          <Button color="inherit" size="small" onClick={onRetry} disabled={isFetching}>
            {statusCopy.retry}
          </Button>
        }
      >
        {statusCopy.loadError}
      </Alert>
    )
  }

  const isEmpty = !isLoading && saturationItems.length === 0 && !pagination?.count
  const ariaLabel =
    tableAriaLabel ??
    (dashboard ? tDashboard('columns.eservice') : t('headlabels.eserviceAndVersion'))

  return (
    <Box
      sx={dashboard ? { mt: 3 } : undefined}
      aria-busy={isFetching}
      role={isLoading ? 'status' : undefined}
      aria-label={isLoading ? statusCopy.loading : undefined}
    >
      {isEmpty && !dashboard ? (
        <NoItemResults padding={1} borderRadius={0}>
          <Stack role="status" aria-live="polite" alignItems="center" sx={{ p: 1 }} spacing={1}>
            <ErrorIcon />
            <Stack alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  fontWeight: theme.typography.fontWeightMedium,
                  color: theme.colors.neutral.grey[650],
                }}
              >
                {tShared('noResultsTitle')}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.colors.neutral.grey[650] }}>
                {tShared('noResultsDescription')}
              </Typography>
            </Stack>
          </Stack>
        </NoItemResults>
      ) : isEmpty && dashboard ? (
        <EmptyTableState message={tDashboard('empty')} />
      ) : (
        <MITable
          columns={columns}
          rows={saturationItems}
          pagination={pagination}
          isLoading={isLoading}
          getRowId={(item) => `${item.eservice.id}-${item.descriptorId}`}
          desktopTableProps={{ 'aria-label': ariaLabel, 'aria-busy': isFetching }}
          mobileTableProps={{ 'aria-label': ariaLabel, 'aria-busy': isFetching }}
        />
      )}
    </Box>
  )
}
