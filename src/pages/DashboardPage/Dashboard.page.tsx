import { Grid, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { PageContainer } from '@/components/layout/containers'
import {
  CardDashboard,
  type CardDashboardAction,
  type CardDashboardProps,
} from '@/components/shared/CardDashboard/CardDashboard'
import { routes, useNavigate } from '@/router'

type DashboardDestination =
  | 'PROVIDE_ESERVICE_LIST'
  | 'PROVIDE_AGREEMENT_LIST'
  | 'PROVIDE_PURPOSE_LIST'

export default function DashboardPage() {
  const { t } = useTranslation('pages', { keyPrefix: 'dashboard' })
  const theme = useTheme()
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()

  const linkAction = (
    destination: DashboardDestination,
    text: string
  ): CardDashboardAction | undefined =>
    routes[destination].authLevels.some((role) => currentRoles.includes(role))
      ? { type: 'link', text, action: () => navigate(destination) }
      : undefined

  const eservicesAction = linkAction('PROVIDE_ESERVICE_LIST', t('actions.eservices'))
  const agreementsAction = linkAction('PROVIDE_AGREEMENT_LIST', t('actions.agreements'))
  const purposesAction = linkAction('PROVIDE_PURPOSE_LIST', t('actions.purposes'))
  const canCreate = routes.PROVIDE_ESERVICE_CREATE.authLevels.some((role) =>
    currentRoles.includes(role)
  )
  const statuses = [
    { id: 'active', label: t('statuses.active'), count: 15, color: theme.palette.success.main },
    {
      id: 'suspended',
      label: t('statuses.suspended'),
      count: 3,
      color: theme.palette.warning.main,
    },
    { id: 'archiving', label: t('statuses.archiving'), count: 2, color: theme.palette.info.main },
    {
      id: 'suspendedArchiving',
      label: t('statuses.suspendedArchiving'),
      count: 0,
      color: theme.palette.error.main,
    },
  ]
  const metrics = [
    { id: 'accepted', value: 10000, label: t('requests.accepted') },
    { id: 'pending', value: 2000, label: t('requests.pending') },
    { id: 'rejected', value: 200, label: t('requests.rejected') },
  ]
  const cards: (CardDashboardProps & { id: string })[] = [
    {
      id: 'eservices',
      heading: t('headings.eservices'),
      content: { kind: 'status', statuses, totalLabel: t('units.eservices') },
      action: eservicesAction,
    },
    {
      id: 'pendingRequests',
      heading: t('headings.pendingRequests'),
      content: { kind: 'metric', metric: { value: 10, label: t('units.requests') } },
      action: agreementsAction,
    },
    {
      id: 'purposes',
      heading: t('headings.purposes'),
      content: { kind: 'metric', metric: { value: 24, label: t('units.purposes') } },
      action: purposesAction,
    },
    {
      id: 'consumers',
      heading: t('headings.consumers'),
      content: { kind: 'metric', metric: { value: 12200, label: t('units.consumers') } },
      action: agreementsAction,
    },
    {
      id: 'requests',
      heading: t('headings.requests'),
      content: { kind: 'metrics', metrics },
      action: agreementsAction,
    },
    {
      id: 'average',
      heading: t('headings.average'),
      content: { kind: 'metric', metric: { value: 3.5, label: t('units.days') } },
      action: agreementsAction,
    },
    {
      id: 'consumption',
      heading: t('headings.consumption'),
      subtitle: t('consumptionSubtitle'),
      content: { kind: 'consumption', used: 38500, limit: 50000, unitLabel: t('units.calls') },
      action: purposesAction,
    },
    {
      id: 'noEservices',
      heading: t('headings.eservices'),
      content: { kind: 'empty', message: t('empty.eservices') },
      action: canCreate
        ? {
            type: 'primary',
            text: t('actions.create'),
            action: () => navigate('PROVIDE_ESERVICE_CREATE'),
          }
        : undefined,
    },
    {
      id: 'noPendingRequests',
      heading: t('headings.pendingRequests'),
      content: { kind: 'empty', message: t('empty.pendingRequests'), icon: 'success' },
      action: agreementsAction,
    },
    {
      id: 'zeroStatuses',
      heading: t('headings.eservices'),
      content: {
        kind: 'status',
        statuses: statuses.map((status) => ({ ...status, count: 0 })),
        totalLabel: t('units.eservices'),
      },
      action: eservicesAction,
    },
    {
      id: 'zeroMetrics',
      heading: t('headings.requests'),
      content: { kind: 'metrics', metrics: metrics.map((metric) => ({ ...metric, value: 0 })) },
      action: agreementsAction,
    },
    {
      id: 'fractionalAverage',
      heading: t('headings.average'),
      content: { kind: 'metric', metric: { value: 0.9, label: t('units.days') } },
      action: agreementsAction,
    },
  ]

  return (
    <PageContainer title={t('title')}>
      <Grid container spacing={3} sx={{ mt: 0 }}>
        {cards.map(({ id, ...card }) => (
          <Grid item xs={12} sm={6} lg={4} key={id}>
            <CardDashboard {...card} />
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  )
}
