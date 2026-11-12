import { useNavigate } from '@/router'
import { Stack, Typography } from '@mui/material'
import { MIIconButton, type MIPaginationProps, type MITableColumn } from '@pagopa/mui-italia'
import { MITable } from '@pagopa/mui-italia/components/MITable'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslation } from 'react-i18next'
import type { ProducerDashboardSaturationItem } from '@/api/api.generatedTypes'
import { SaturationDonut } from '@/components/shared/SaturationDonut/SaturationDonut'

interface SaturationRateTableProps {
  saturationItems: Array<ProducerDashboardSaturationItem>
  pagination?: MIPaginationProps
  /** Initial load: renders MITable skeleton rows. */
  isLoading?: boolean
  /** Background refetch (e.g. page/filter change while previous rows stay visible). */
  isFetching?: boolean
}

const ProviderSaturationRateTable: React.FC<SaturationRateTableProps> = ({
  saturationItems,
  pagination,
  isLoading = false,
  isFetching = false,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation('dashboard', { keyPrefix: 'providerSaturationRatePage.table' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const columns: Array<MITableColumn<ProducerDashboardSaturationItem>> = [
    {
      id: 'eservice',
      header: t('headlabels.eserviceAndVersion'),
      renderCell: (item) => (
        <Stack component="span" direction="column" spacing={1}>
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
      renderCell: (item) => (
        <SaturationDonut percentage={item.percentage} label={`${item.percentage}%`} />
      ),
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
              navigate('PROVIDE_ESERVICE_MANAGE', {
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
      isLoading={isLoading}
      getRowId={(item) => `${item.eservice.id}-${item.descriptorId}`}
      desktopTableProps={{
        'aria-label': t('headlabels.eserviceAndVersion'),
        'aria-busy': isFetching,
      }}
      mobileTableProps={{
        'aria-label': t('headlabels.eserviceAndVersion'),
        'aria-busy': isFetching,
      }}
    />
  )
}

export default ProviderSaturationRateTable
