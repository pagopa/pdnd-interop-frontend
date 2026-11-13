import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import { useId } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { ProducerQueries } from '@/api/producer'
import type { ProducerEServiceMonitoring } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import type {
  CardDashboardAction,
  CardDashboardStatus,
} from '@/components/shared/CardDashboard/CardDashboard'
import { routes, useNavigate, useParams } from '@/router'
import { MonitoringCardsGrid, type MonitoringCard } from './MonitoringCardsGrid'
import { MonitoringSectionHeader } from './MonitoringSectionHeader'
import { ProviderEServiceMonitoringArchivingTable } from './ProviderEServiceMonitoringArchivingTable'
import { ProviderEServiceMonitoringConsumersTable } from './ProviderEServiceMonitoringConsumersTable'

/**
 * "Monitoraggio" tab of the classic provider e-service details page. Every block owns its query
 * and its loading / error / empty state; query keys include the selected e-service/descriptor.
 */
export function ProviderEServiceMonitoringTab() {
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { t, i18n } = useTranslation('eservice', { keyPrefix: 'read.monitoring' })
  const theme = useTheme()
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()
  const exportDescriptionId = useId()
  const consumersTitleId = useId()
  const archivingTitleId = useId()
  const consumptionTitleId = useId()
  const versionsTitleId = useId()
  const locale = i18n.language === 'en' ? 'en-US' : 'it-IT'

  const monitoringQuery = useQuery(
    ProducerQueries.getEServiceMonitoring({ eserviceId, descriptorId })
  )
  const monitoring = monitoringQuery.data

  const canViewAgreements = routes.PROVIDE_AGREEMENT_LIST.authLevels.some((role) =>
    currentRoles.includes(role)
  )

  const unavailablePurposesAction = (text: string): CardDashboardAction => ({
    type: 'link',
    text,
    disabled: true,
    disabledReason: t('consumption.purposesActionUnavailable'),
  })

  const buildConsumptionCards = (data: ProducerEServiceMonitoring): MonitoringCard[] => [
    {
      id: 'consumption',
      heading: t('consumption.consumptionCard.heading'),
      locale,
      content: {
        kind: 'consumption',
        used: data.approvedDailyCalls,
        limit: data.dailyCallsTotal,
        percentage: data.percentage,
        unitLabel: t('consumption.consumptionCard.unit'),
      },
    },
    {
      id: 'newPurposes',
      heading: t('consumption.newPurposesCard.heading'),
      locale,
      content: {
        kind: 'metric',
        metric: {
          value: data.waitingForApprovalNewPurposes,
          label: t('consumption.newPurposesCard.unit'),
        },
      },
      action: unavailablePurposesAction(t('consumption.newPurposesCard.action')),
    },
    {
      id: 'quotaChanges',
      heading: t('consumption.quotaChangesCard.heading'),
      locale,
      content: {
        kind: 'metric',
        metric: {
          value: data.waitingForApprovalQuotaChanges,
          label: t('consumption.quotaChangesCard.unit'),
        },
      },
      action: unavailablePurposesAction(t('consumption.quotaChangesCard.action')),
    },
  ]

  const versionColors = [
    theme.palette.primary.main,
    theme.colors.turquoise[600],
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.dark,
  ]

  const buildVersionsCards = (data: ProducerEServiceMonitoring): MonitoringCard[] => {
    const { consumersByVersion, consumersByKind } = data
    const statuses: CardDashboardStatus[] = consumersByVersion.versions.map((item, index) => ({
      id: item.descriptorId,
      label: t('versions.byVersionCard.version', { version: item.version }),
      count: item.consumersCount,
      color: versionColors[index % versionColors.length],
    }))
    if (consumersByVersion.olderVersionsConsumersCount !== undefined) {
      statuses.push({
        id: 'olderVersions',
        label: t('versions.byVersionCard.olderVersions'),
        count: consumersByVersion.olderVersionsConsumersCount,
        color: theme.palette.grey[500],
      })
    }

    return [
      {
        id: 'byVersion',
        heading: t('versions.byVersionCard.heading'),
        locale,
        content: {
          kind: 'status',
          statuses,
          total: consumersByVersion.total,
          totalLabel: t('versions.byVersionCard.totalLabel'),
        },
        footer:
          consumersByVersion.medianUpgradeDays !== undefined
            ? t('versions.byVersionCard.medianUpgradeDays', {
                count: consumersByVersion.medianUpgradeDays,
              })
            : undefined,
      },
      {
        id: 'byKind',
        heading: t('versions.byKindCard.heading'),
        locale,
        content: {
          kind: 'metrics',
          metrics: [
            { id: 'pa', value: consumersByKind.pa, label: t('versions.byKindCard.pa') },
            {
              id: 'gspScp',
              value: consumersByKind.gspScp,
              label: t('versions.byKindCard.gspScp'),
            },
            {
              id: 'private',
              value: consumersByKind.private,
              label: t('versions.byKindCard.private'),
            },
          ],
        },
        footer: t('versions.byKindCard.total', {
          total: new Intl.NumberFormat(locale).format(consumersByKind.total),
        }),
      },
      {
        id: 'pendingAgreements',
        heading: t('versions.pendingAgreementsCard.heading'),
        locale,
        content: {
          kind: 'metric',
          metric: {
            value: data.pendingAgreements,
            label: t('versions.pendingAgreementsCard.unit'),
          },
        },
        action: canViewAgreements
          ? {
              type: 'link',
              text: t('versions.pendingAgreementsCard.action'),
              action: () =>
                navigate('PROVIDE_AGREEMENT_LIST', {
                  urlParams: { eservicesIds: eserviceId, states: 'PENDING' },
                }),
            }
          : undefined,
      },
    ]
  }

  const cardsGridState = {
    isPending: monitoringQuery.isPending,
    isError: monitoringQuery.isError,
    isFetching: monitoringQuery.isFetching,
    onRetry: () => void monitoringQuery.refetch(),
  }

  return (
    <Box>
      <Box component="section" aria-labelledby={consumptionTitleId}>
        <MonitoringSectionHeader
          id={consumptionTitleId}
          title={t('consumption.title')}
          description={t('consumption.description')}
          action={
            // No export implementation exists yet: disabled with a visible explanation.
            <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
              <MIButton
                type="button"
                variant="outlined"
                size="small"
                startIcon={<FileDownloadOutlinedIcon />}
                disabled
                aria-describedby={exportDescriptionId}
              >
                {t('consumption.export')}
              </MIButton>
              <Typography id={exportDescriptionId} variant="caption" color="text.secondary">
                {t('consumption.exportUnavailable')}
              </Typography>
            </Stack>
          }
        />
        <MonitoringCardsGrid
          cards={monitoring ? buildConsumptionCards(monitoring) : undefined}
          {...cardsGridState}
        />
        <SectionContainer
          title={t('consumers.title')}
          description={t('consumers.description')}
          aria-labelledby={consumersTitleId}
          titleTypographyProps={{ id: consumersTitleId }}
        >
          <ProviderEServiceMonitoringConsumersTable
            eserviceId={eserviceId}
            descriptorId={descriptorId}
          />
        </SectionContainer>
      </Box>
      <Box component="section" aria-labelledby={versionsTitleId} sx={{ mt: 6 }}>
        <MonitoringSectionHeader
          id={versionsTitleId}
          title={t('versions.title')}
          description={t('versions.description')}
        />
        <MonitoringCardsGrid
          cards={monitoring ? buildVersionsCards(monitoring) : undefined}
          {...cardsGridState}
        />
        <SectionContainer
          title={t('archiving.title')}
          description={t('archiving.description')}
          aria-labelledby={archivingTitleId}
          titleTypographyProps={{ id: archivingTitleId }}
        >
          <ProviderEServiceMonitoringArchivingTable
            eserviceId={eserviceId}
            descriptorId={descriptorId}
          />
        </SectionContainer>
      </Box>
    </Box>
  )
}
