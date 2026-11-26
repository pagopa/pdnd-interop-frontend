import { Box, Grid, useTheme } from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { MIButton } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { ProducerQueries } from '@/api/producer'
import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import {
  CardDashboard,
  type CardDashboardAction,
  type CardDashboardProps,
} from '@/components/shared/CardDashboard/CardDashboard'
import { routes, useNavigate } from '@/router'
import { ProviderDashboardSaturationTable } from './components/ProviderDashboardSaturationTable'
import { ProviderDashboardArchivingTable } from './components/ProviderDashboardArchivingTable'
import { usePagination } from '@/hooks/usePagination'
import type { UserProductRole } from '@/types/party.types'

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
  const { data: consumers } = useSuspenseQuery({
    ...ProducerQueries.getDashboardConsumers({ offset: 0, limit: 1 }),
    refetchInterval: 60_000,
  })
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({
    limit: 5,
    limitOptions: [5, 10, 15],
  })
  const saturation = useQuery({
    ...ProducerQueries.getDashboardSaturation({
      ...paginationParams,
      sortBy: 'PERCENTAGE_DESC',
    }),
    placeholderData: keepPreviousData,
    throwOnError: false,
  })
  const saturationPagination =
    saturation.data && saturation.data.pagination.totalCount > 0
      ? {
          page: paginationProps.page,
          onChange: (_: React.ChangeEvent<unknown>, page: number) =>
            paginationProps.onPageChange(page),
          count: getTotalPageCount(saturation.data.pagination.totalCount),
          itemsPerPageOptions: paginationProps.itemsPerPageOptions,
        }
      : undefined

  const linkAction = (
    destination: DashboardDestination,
    text: string
  ): CardDashboardAction | undefined =>
    routes[destination].authLevels.some((role: UserProductRole) => currentRoles.includes(role))
      ? { type: 'link', text, action: () => navigate(destination) }
      : undefined

  const eservicesAction = linkAction('PROVIDE_ESERVICE_LIST', t('actions.eservices'))
  const createEserviceAction: CardDashboardAction | undefined =
    routes.PROVIDE_ESERVICE_CREATE.authLevels.some((role: UserProductRole) =>
      currentRoles.includes(role)
    )
      ? {
          type: 'primary',
          text: t('empty.createEservice'),
          action: () => navigate('PROVIDE_ESERVICE_CREATE'),
        }
      : undefined
  const agreementsAction = linkAction('PROVIDE_AGREEMENT_LIST', t('actions.agreements'))
  const purposesAwaitingApprovalAction = linkAction(
    'PROVIDE_PURPOSE_LIST',
    t('actions.purposesAwaitingApproval')
  )
  const purposesReceivedAction = linkAction('PROVIDE_PURPOSE_LIST', t('actions.purposesReceived'))
  const activeAgreementsAction = linkAction(
    'PROVIDE_DASHBOARD_CONSUMERS',
    t('actions.activeAgreements')
  )
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
      content:
        dashboard.eservices.total === 0
          ? { kind: 'empty', message: t('empty.eservices') }
          : {
              kind: 'status',
              statuses,
              total: dashboard.eservices.total,
              totalLabel: t('units.eservices'),
            },
      action: dashboard.eservices.total === 0 ? createEserviceAction : eservicesAction,
    },
    {
      id: 'pendingRequests',
      heading: t('headings.pendingAgreements'),
      content:
        dashboard.pendingAgreements === 0
          ? { kind: 'empty', message: t('empty.pendingAgreements'), icon: 'success' }
          : {
              kind: 'metric',
              metric: { value: dashboard.pendingAgreements, label: t('units.requests') },
            },
      action: dashboard.pendingAgreements === 0 ? undefined : agreementsAction,
    },
    {
      id: 'purposes',
      heading: t('headings.purposesAwaitingApproval'),
      content:
        dashboard.waitingForApprovalPurposes === 0
          ? { kind: 'empty', message: t('empty.purposesAwaitingApproval'), icon: 'success' }
          : {
              kind: 'metric',
              metric: { value: dashboard.waitingForApprovalPurposes, label: t('units.purposes') },
            },
      action:
        dashboard.waitingForApprovalPurposes === 0 ? undefined : purposesAwaitingApprovalAction,
    },
    {
      id: 'activeAgreements',
      heading:
        consumers.totalConsumers === 0
          ? t('empty.consumersHeading')
          : t('headings.activeAgreements'),
      content:
        consumers.totalConsumers === 0
          ? { kind: 'empty', message: t('empty.consumers') }
          : {
              kind: 'metric',
              metric: { value: dashboard.activeAgreements, label: t('units.activeAgreements') },
            },
      action: consumers.totalConsumers === 0 ? undefined : activeAgreementsAction,
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
      action: dashboard.averageActivePurposesPerEService === 0 ? undefined : purposesReceivedAction,
    },
  ]

  return (
    <PageContainer dashboardFlow title={t('title')} description={t('description')}>
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
          <ProviderDashboardSaturationTable
            dashboard
            saturationItems={saturation.data?.results ?? []}
            pagination={saturationPagination}
            isLoading={saturation.isPending}
            isFetching={saturation.isFetching}
            isError={saturation.isError}
            onRetry={() => saturation.refetch()}
          />
          {routes.PROVIDE_SATURATION_RATE.authLevels.some((role: UserProductRole) =>
            currentRoles.includes(role)
          ) && (
            <Box sx={{ mt: 2 }}>
              <MIButton
                type="button"
                variant="text"
                color="primary"
                endIcon={<ArrowForward />}
                onClick={() => navigate('PROVIDE_SATURATION_RATE')}
              >
                {t('sections.thresholds.viewAll')}
              </MIButton>
            </Box>
          )}
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
