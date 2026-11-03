import { Box, Grid, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { ProducerQueries } from '@/api/producer'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import {
  CardDashboard,
  type CardDashboardAction,
  type CardDashboardProps,
} from '@/components/shared/CardDashboard/CardDashboard'
import { routes, useNavigate } from '@/router'
import { ProviderDashboardSaturationTable } from './components/ProviderDashboardSaturationTable'
import { ProviderDashboardArchivingTable } from './components/ProviderDashboardArchivingTable'

type DashboardDestination =
  | 'PROVIDE_ESERVICE_LIST'
  | 'PROVIDE_AGREEMENT_LIST'
  | 'PROVIDE_PURPOSE_LIST'
  | 'PROVIDE_DASHBOARD_CONSUMERS'

export default function ProviderDashboardPage() {
  const { t } = useTranslation('pages', { keyPrefix: 'dashboard' })
  const theme = useTheme()
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()
  const { data: dashboard } = useSuspenseQuery(ProducerQueries.getDashboard())

  const linkAction = (
    destination: DashboardDestination,
    text: string
  ): CardDashboardAction | undefined =>
    routes[destination].authLevels.some((role) => currentRoles.includes(role))
      ? { type: 'link', text, action: () => navigate(destination) }
      : undefined

  const eservicesAction = linkAction('PROVIDE_ESERVICE_LIST', t('actions.eservices'))
  const agreementsAction = linkAction('PROVIDE_AGREEMENT_LIST', t('actions.agreements'))
  const purposesAwaitingApprovalAction = linkAction(
    'PROVIDE_PURPOSE_LIST',
    t('actions.purposesAwaitingApproval')
  )
  const purposesReceivedAction = linkAction('PROVIDE_PURPOSE_LIST', t('actions.purposesReceived'))
  const consumersAction = linkAction('PROVIDE_DASHBOARD_CONSUMERS', t('actions.consumers'))
  const statuses = [
    {
      id: 'active',
      label: t('statuses.active'),
      count: dashboard.eservices.published,
      color: theme.colors.turquoise[600],
    },
    {
      id: 'suspended',
      label: t('statuses.suspended'),
      count: dashboard.eservices.suspended,
      color: theme.palette.error.dark,
    },
    {
      id: 'archiving',
      label: t('statuses.archiving'),
      count: dashboard.eservices.archiving,
      color: theme.palette.primary.main,
    },
    {
      id: 'suspendedArchiving',
      label: t('statuses.suspendedArchiving'),
      count: dashboard.eservices.archivingSuspended,
      color: theme.palette.info.main,
    },
  ]
  const metrics = [
    {
      id: 'activeAgreementAndPurpose',
      value: dashboard.alignment.aligned,
      label: t('metrics.activeAgreementAndPurpose'),
    },
    {
      id: 'activeAgreementWithoutActivePurpose',
      value: dashboard.alignment.agreementWithoutPurposes,
      label: t('metrics.activeAgreementWithoutActivePurpose'),
    },
    {
      id: 'activePurposeWithSuspendedAgreement',
      value: dashboard.alignment.purposesWithoutAgreement,
      label: t('metrics.activePurposeWithSuspendedAgreement'),
    },
  ]
  const cards: (CardDashboardProps & { id: string })[] = [
    {
      id: 'eservices',
      heading: t('headings.eservices'),
      content: {
        kind: 'status',
        statuses,
        total: dashboard.eservices.total,
        totalLabel: t('units.eservices'),
      },
      action: eservicesAction,
    },
    {
      id: 'pendingRequests',
      heading: t('headings.pendingAgreements'),
      content: {
        kind: 'metric',
        metric: { value: dashboard.pendingAgreements, label: t('units.requests') },
      },
      action: agreementsAction,
    },
    {
      id: 'purposes',
      heading: t('headings.purposesAwaitingApproval'),
      content: {
        kind: 'metric',
        metric: { value: dashboard.waitingForApprovalPurposes, label: t('units.purposes') },
      },
      action: purposesAwaitingApprovalAction,
    },
    {
      id: 'consumers',
      heading: t('headings.consumers'),
      content: {
        kind: 'metric',
        metric: { value: dashboard.activeAgreements, label: t('units.consumers') },
      },
      action: consumersAction,
    },
    {
      id: 'agreementsAndPurposes',
      heading: t('headings.agreementsAndPurposes'),
      content: { kind: 'metrics', metrics },
    },
    {
      id: 'average',
      heading: t('headings.average'),
      content: {
        kind: 'metric',
        metric: {
          value: dashboard.averageActivePurposesPerEService,
          label: t('units.purposesPerEservice'),
        },
      },
      action: purposesReceivedAction,
    },
  ]

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Grid container spacing={3} sx={{ mt: 0 }}>
        {cards.map(({ id, ...card }) => (
          <Grid item xs={12} sm={6} lg={4} key={id}>
            <CardDashboard {...card} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <SectionContainer
          sx={{ mt: 0 }}
          title={t('sections.thresholds.title')}
          description={t('sections.thresholds.description')}
          aria-labelledby="dashboard-thresholds-title"
          titleTypographyProps={{ id: 'dashboard-thresholds-title' }}
        >
          <ProviderDashboardSaturationTable />
        </SectionContainer>
        <SectionContainer
          title={t('sections.archiving.title')}
          description={t('sections.archiving.description')}
          aria-labelledby="dashboard-archiving-title"
          titleTypographyProps={{ id: 'dashboard-archiving-title' }}
        >
          <ProviderDashboardArchivingTable />
        </SectionContainer>
      </Box>
    </PageContainer>
  )
}
