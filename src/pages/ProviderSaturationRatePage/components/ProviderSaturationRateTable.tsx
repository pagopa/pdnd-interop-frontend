import { useNavigate } from '@/router'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { MIIconButton, type MIPaginationProps, type MITableColumn } from '@pagopa/mui-italia'
import { MITable } from '@pagopa/mui-italia/components/MITable'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslation } from 'react-i18next'
import type { ProducerDashboardSaturationItem } from '@/api/api.generatedTypes'
import { PieChart } from '@mui/x-charts/PieChart'

type SaturationRateTableColumn = MITableColumn<ProducerDashboardSaturationItem> & {
  isAction?: boolean
}
interface SaturationRateTableProps {
  saturationItems: Array<ProducerDashboardSaturationItem>
  pagination?: MIPaginationProps
}

const ProviderSaturationRateTable: React.FC<SaturationRateTableProps> = ({
  saturationItems,
  pagination,
}) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const { t } = useTranslation('dashboard', { keyPrefix: 'providerSaturationRatePage.table' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const columns: Array<SaturationRateTableColumn> = [
    {
      id: 'eservice',
      header: t('headlabels.eserviceAndVersion'),
      renderCell: (item) => (
        <Stack direction="column" spacing={1}>
          <Typography variant="body2" component="span">
            {item.eservice.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="span">
            {t('eserviceVersion', { version: item.version })}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'purposes',
      header: t('headlabels.purposesNumber'),
      renderCell: (item) => (
        <Typography variant="body2" component="span">
          {item.activePurposesCount}
        </Typography>
      ),
    },
    {
      id: 'percentage',
      header: t('headlabels.percentageRate'),
      renderCell: (item) => {
        const percentage = Math.min(100, Math.max(0, item.percentage))
        const color =
          item.percentage >= 90
            ? theme.colors.error[600]
            : item.percentage >= 70
              ? theme.colors.warning[500]
              : theme.colors.success[500]

        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box aria-hidden="true" sx={{ width: 20, height: 20, flexShrink: 0 }}>
              <PieChart
                width={20}
                height={20}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                series={[
                  {
                    data: [
                      { id: 'used', value: percentage, color },
                      { id: 'remaining', value: 100 - percentage, color: theme.palette.grey[200] },
                    ],
                    innerRadius: 6.4,
                    outerRadius: 10,
                  },
                ]}
                slotProps={{ legend: { hidden: true } }}
                sx={{ '& .MuiPieArc-root': { stroke: 'none' } }}
                tooltip={{ trigger: 'none' }}
                skipAnimation
              />
            </Box>
            <Typography variant="body2" component="span">
              {item.percentage}%
            </Typography>
          </Stack>
        )
      },
    },
    {
      id: 'approved_calls',
      header: t('headlabels.approvedCalls'),
      renderCell: (item) => (
        <Typography variant="body2" component="span">
          {item.approvedDailyCalls} / {item.dailyCallsTotal}
        </Typography>
      ),
    },
    {
      id: 'calls_to_approve',
      header: t('headlabels.callsToApprove'),
      renderCell: (item) => (
        <Typography variant="body2" component="span">
          {item.waitingForApprovalDailyCalls}
        </Typography>
      ),
    },
    {
      id: 'go_to_eservice',
      header: '',
      isAction: true,
      renderCell: (item) => {
        return (
          <MIIconButton
            aria-label={tCommon('inspectEService')}
            onClick={() =>
              navigate('PROVIDE_ESERVICE_SUMMARY', {
                params: {
                  eserviceId: item.eservice.id,
                  descriptorId: item.descriptorId,
                },
                urlParams: { tab: 'tracking' }, // TODO: check name of the correct tab when implemented
              })
            }
          >
            <ChevronRightIcon />
          </MIIconButton>
        )
      },
    },
  ]

  return (
    <MITable
      columns={columns}
      rows={saturationItems}
      pagination={pagination}
      getRowId={(item) => item.descriptorId}
    />
  )
}

export default ProviderSaturationRateTable
