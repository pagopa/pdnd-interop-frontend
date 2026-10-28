import { Box, Grid, Skeleton, Stack, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
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
  | 'PROVIDE_DASHBOARD_CONSUMERS'

function DashboardTableSkeleton({ label, columns }: { label: string; columns: number }) {
  return (
    <Box role="img" aria-label={label} sx={{ width: '100%', height: { xs: 240, md: 320 }, mt: 3 }}>
      <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-between' }}>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'grid',
              gridTemplateColumns: `minmax(0, 1.4fr) repeat(${columns - 1}, minmax(0, 1fr))`,
              gap: 2,
            }}
          >
            {Array.from({ length: columns }, (_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                aria-hidden="true"
                variant="rectangular"
                height={rowIndex === 0 ? 24 : 18}
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default function ProviderDashboardPage() {
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
  const purposesAwaitingApprovalAction = linkAction(
    'PROVIDE_PURPOSE_LIST',
    t('actions.purposesAwaitingApproval')
  )
  const purposesReceivedAction = linkAction('PROVIDE_PURPOSE_LIST', t('actions.purposesReceived'))
  const consumersAction = linkAction('PROVIDE_DASHBOARD_CONSUMERS', t('actions.consumers'))
  const statuses = [
    { id: 'active', label: t('statuses.active'), count: 15, color: theme.palette.success.dark },
    {
      id: 'suspended',
      label: t('statuses.suspended'),
      count: 3,
      color: theme.palette.error.dark,
    },
    {
      id: 'archiving',
      label: t('statuses.archiving'),
      count: 2,
      color: theme.palette.primary.main,
    },
    {
      id: 'suspendedArchiving',
      label: t('statuses.suspendedArchiving'),
      count: 0,
      color: theme.palette.info.main,
    },
  ]
  const metrics = [
    {
      id: 'activeAgreementAndPurpose',
      value: 10000,
      label: t('metrics.activeAgreementAndPurpose'),
    },
    {
      id: 'activeAgreementWithoutActivePurpose',
      value: 2000,
      label: t('metrics.activeAgreementWithoutActivePurpose'),
    },
    {
      id: 'activePurposeWithSuspendedAgreement',
      value: 200,
      label: t('metrics.activePurposeWithSuspendedAgreement'),
    },
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
      heading: t('headings.pendingAgreements'),
      content: { kind: 'metric', metric: { value: 10, label: t('units.requests') } },
      action: agreementsAction,
    },
    {
      id: 'purposes',
      heading: t('headings.purposesAwaitingApproval'),
      content: { kind: 'metric', metric: { value: 24, label: t('units.purposes') } },
      action: purposesAwaitingApprovalAction,
    },
    {
      id: 'consumers',
      heading: t('headings.consumers'),
      content: { kind: 'metric', metric: { value: 12200, label: t('units.consumers') } },
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
        metric: { value: 3.5, label: t('units.purposesPerEservice') },
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
          <DashboardTableSkeleton label={t('sections.thresholds.placeholder')} columns={5} />
        </SectionContainer>
        <SectionContainer
          title={t('sections.archiving.title')}
          description={t('sections.archiving.description')}
          aria-labelledby="dashboard-archiving-title"
          titleTypographyProps={{ id: 'dashboard-archiving-title' }}
        >
          <DashboardTableSkeleton label={t('sections.archiving.placeholder')} columns={4} />
        </SectionContainer>
      </Box>
    </PageContainer>
  )
}
