/**
 * Integration coverage for the consumer e-service detail flow with the real PageContainer,
 * real Breadcrumbs (route hierarchy resolved from the URL), browser history with the real nuqs
 * react-router adapter (as in RoutesWrapper) and
 * both real entry points. Only the producer HTTP services are replaced by the DEV mock fixtures.
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance, type Resource } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {
  GetProducerEServiceMonitoringConsumerPurposesParams,
  ProducerEServiceMonitoringConsumerPurposes,
} from '@/api/api.generatedTypes'
import { ProducerServices } from '@/api/producer'
import axiosInstance from '@/config/axios'
import type * as Env from '@/config/env'
import type * as ProducerServicesModule from '@/api/producer/producer.services'
import { mockUseJwt } from '@/utils/testing.utils'
import ProviderDashboardConsumerEServiceDetail from '../ProviderDashboardConsumerEServiceDetail.page'
import ProviderDashboardConsumerDetail from '@/pages/ProviderDashboardConsumerDetail/ProviderDashboardConsumerDetail.page'
import { ProviderEServiceMonitoringConsumersTable } from '@/pages/ProviderEServiceDetailsPage/components/ProviderEServiceMonitoringTab/ProviderEServiceMonitoringConsumersTable'
import {
  getMockProducerDashboardConsumer,
  mockProducerDashboardConsumerEServices,
  mockProducerDashboardConsumers,
} from '../../../../__mocks__/data/producer.mocks'
import {
  getMockProducerEServiceMonitoringConsumerPurposes,
  getMockProducerEServiceMonitoringSaturation,
} from '../../../../__mocks__/data/producer-monitoring.mocks'
import itPages from '@/static/locales/it/pages.json'
import itCommon from '@/static/locales/it/common.json'
import itFilters from '@/static/locales/it/filters.json'
import itEservice from '@/static/locales/it/eservice.json'
import itShared from '@/static/locales/it/shared-components.json'
import enPages from '@/static/locales/en/pages.json'
import enShared from '@/static/locales/en/shared-components.json'

vi.unmock('react-i18next')
vi.mock('@/config/env', async (importOriginal) => ({
  ...(await importOriginal<typeof Env>()),
  APP_MODE: 'development',
  MOCK_PRODUCER_DASHBOARD: true,
}))
vi.mock('@/api/producer/producer.services', () => ({
  ProducerServices: {
    getEServiceMonitoringConsumerPurposes: vi.fn(),
    getEServiceMonitoringSaturation: vi.fn(),
    getDashboardConsumer: vi.fn(),
  },
}))

const getPurposes = vi.mocked(ProducerServices.getEServiceMonitoringConsumerPurposes)
const getSaturation = vi.mocked(ProducerServices.getEServiceMonitoringSaturation)
const getDashboardConsumer = vi.mocked(ProducerServices.getDashboardConsumer)

const copy = itPages.providerDashboardConsumerEServiceDetail
const routeLabels = itShared.routeLabels

// DEV fixture: first dashboard consumer (Comune di Roma, (no waiting purposes) and its first e-service version.
const FIRST_CONSUMER = mockProducerDashboardConsumers[0].consumer
const resource = mockProducerDashboardConsumerEServices[FIRST_CONSUMER.id][0]
const ESERVICE = resource.eservice
const DESCRIPTOR_ID = resource.descriptorId
const OLDEST_DESCRIPTOR_ID = '20000000-0000-4000-8000-000000000099'
// Saturation fixture: 12000/10000 approved (threshold exceeded) and 9000/10000 (not exceeded),
// both with 1000 daily calls waiting for approval.
const LAZIO = mockProducerDashboardConsumers[1].consumer
const MILANO = mockProducerDashboardConsumers[2].consumer
const UNKNOWN_CONSUMER_ID = '00000000-0000-4000-8000-000000000999'

const dashboardPath = (consumerId: string, descriptorId = DESCRIPTOR_ID) =>
  `/it/erogazione/panoramica/fruitori/${consumerId}/e-service/${ESERVICE.id}/${descriptorId}`
const monitoringPath = (consumerId: string, descriptorId = DESCRIPTOR_ID) =>
  `/it/erogazione/e-service/${ESERVICE.id}/${descriptorId}/monitoraggio/fruitori/${consumerId}`

const mainCalls = () => getPurposes.mock.calls.map(([params]) => params)

const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '/src/static/locales/{it,en}/*.json',
  { eager: true }
)
const localeResources = (language: 'it' | 'en') =>
  Object.fromEntries(
    Object.entries(localeModules)
      .filter(([path]) => path.includes(`/locales/${language}/`))
      .map(([path, mod]) => [path.split('/').pop()!.replace('.json', ''), mod.default])
  )

const Location = () => {
  const location = useLocation()
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>
}

const MonitoringEntryPoint = () => {
  const { eserviceId, descriptorId } = useParams()
  return (
    <ProviderEServiceMonitoringConsumersTable
      eserviceId={eserviceId!}
      descriptorId={descriptorId!}
    />
  )
}

const Destination = ({ name }: { name: string }) => <p>{`Destination ${name}`}</p>

const renderApp = async (initialEntry: string) => {
  const i18n = createInstance()
  const language = initialEntry.startsWith('/en/') ? 'en' : 'it'
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: { [language]: localeResources(language) } as Resource,
  })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, throwOnError: true } },
  })
  const user = userEvent.setup()
  // Real browser history (as in the app): the initial URL simulates a direct link or a reload.
  window.history.replaceState(null, '', initialEntry)
  const result = render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <NuqsAdapter>
              <Location />
              <Routes>
                <Route
                  path="/:language/erogazione/panoramica/fruitori/:consumerId/e-service/:eserviceId/:descriptorId"
                  element={<ProviderDashboardConsumerEServiceDetail origin="dashboard" />}
                />
                <Route
                  path="/:language/erogazione/e-service/:eserviceId/:descriptorId/monitoraggio/fruitori/:consumerId"
                  element={<ProviderDashboardConsumerEServiceDetail origin="monitoring" />}
                />
                <Route
                  path="/:language/erogazione/panoramica/fruitori/:consumerId"
                  element={<ProviderDashboardConsumerDetail />}
                />
                <Route
                  path="/:language/erogazione/e-service/:eserviceId/:descriptorId"
                  element={<MonitoringEntryPoint />}
                />
                <Route
                  path="/:language/erogazione/finalita/:purposeId"
                  element={<Destination name="purpose" />}
                />
                <Route path="*" element={<Destination name="other" />} />
              </Routes>
            </NuqsAdapter>
          </BrowserRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
  return { ...result, user }
}

const location = () => screen.getByTestId('location').textContent

/** Dashboard-origin parents: Erogazione > Panoramica > Lista fruitori > {consumer label}. */
const dashboardParents = (
  consumerId: string,
  consumerLabel: string,
  language: 'it' | 'en' = 'it',
  labels: typeof itShared.routeLabels = routeLabels
) => [
  { label: labels.PROVIDE, href: `/${language}/erogazione` },
  { label: labels.PROVIDE_DASHBOARD, href: `/${language}/erogazione/panoramica` },
  {
    label: labels.PROVIDE_DASHBOARD_CONSUMERS,
    href: `/${language}/erogazione/panoramica/fruitori`,
  },
  { label: consumerLabel, href: `/${language}/erogazione/panoramica/fruitori/${consumerId}` },
]

/** Real breadcrumb trail: every segment but the last is a link, the last one is plain text. */
const getBreadcrumbs = () => {
  const nav = screen
    .getAllByRole('navigation')
    .find((element) => element.classList.contains('MuiBreadcrumbs-root'))!
  const items = within(nav).getAllByRole('listitem')
  return items.map((item) => {
    const link = within(item).queryByRole('link')
    return link
      ? { label: item.textContent, href: link.getAttribute('href') }
      : { label: item.textContent }
  })
}

const stubMobile = () =>
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

const buildPagedResponse = (
  params: GetProducerEServiceMonitoringConsumerPurposesParams,
  total: number
): ProducerEServiceMonitoringConsumerPurposes => {
  const all = Array.from({ length: total }, (_, index) => ({
    purposeId: `paged-${index + 1}`,
    title: `Finalità ${String(index + 1).padStart(2, '0')}`,
    dailyCalls: 100,
    state: (index % 3 === 0 ? 'SUSPENDED' : 'ACTIVE') as 'SUSPENDED' | 'ACTIVE',
    updatedAt: '2026-01-01T00:00:00Z',
  })).filter((purpose) => !params.states?.length || params.states.includes(purpose.state))
  return {
    eservice: ESERVICE,
    version: resource.version,
    otherVersions: [],
    consumer: FIRST_CONSUMER,
    dailyCallsPerConsumer: 10000,
    approvedDailyCalls: 1000,
    percentage: 10,
    waitingForApprovalPurposes: 1,
    results: all.slice(params.offset, params.offset + params.limit),
    pagination: { offset: params.offset, limit: params.limit, totalCount: all.length },
  }
}

describe('ProviderDashboardConsumerEServiceDetail (integration)', () => {
  beforeEach(() => {
    getPurposes.mockReset()
    getSaturation.mockReset()
    getDashboardConsumer.mockReset()
    getPurposes.mockImplementation(async (params) =>
      getMockProducerEServiceMonitoringConsumerPurposes(params)
    )
    getSaturation.mockImplementation(async (params) =>
      getMockProducerEServiceMonitoringSaturation(params)
    )
    getDashboardConsumer.mockImplementation(async (params) =>
      getMockProducerDashboardConsumer(params)
    )
    mockUseJwt({ currentRoles: ['admin'] })
    // nuqs pagination uses `scroll: true`; jsdom does not implement scrollTo.
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  describe('entry points and breadcrumbs', () => {
    it('opens a different dashboard fixture through the real DEV services without a shell request', async () => {
      vi.stubEnv('DEV', true)
      const actual = await vi.importActual<typeof ProducerServicesModule>(
        '@/api/producer/producer.services'
      )
      getDashboardConsumer.mockImplementation(actual.ProducerServices.getDashboardConsumer)
      getPurposes.mockImplementation(actual.ProducerServices.getEServiceMonitoringConsumerPurposes)
      const http = vi.spyOn(axiosInstance, 'get').mockRejectedValue(new Error('Unexpected HTTP'))
      const consumer = mockProducerDashboardConsumers[12].consumer
      // This row is neither the shared first monitoring fixture nor a real descriptor.
      const row = [...mockProducerDashboardConsumerEServices[consumer.id]].sort((a, b) =>
        a.eservice.name.localeCompare(b.eservice.name, 'it')
      )[0]
      const { user } = await renderApp(`/it/erogazione/panoramica/fruitori/${consumer.id}`)
      await user.click(
        await screen.findByRole('link', {
          name: itPages.providerDashboardConsumerDetail.goToEServiceDetail
            .replace('{{name}}', row.eservice.name)
            .replace('{{version}}', row.version),
        })
      )

      expect(location()).toBe(
        `/it/erogazione/panoramica/fruitori/${consumer.id}/e-service/${row.eservice.id}/${row.descriptorId}`
      )
      expect(
        await screen.findByRole('heading', { level: 1, name: row.eservice.name })
      ).toBeVisible()
      await waitFor(() =>
        expect(getBreadcrumbs()).toEqual([
          ...dashboardParents(consumer.id, consumer.name),
          { label: row.eservice.name },
        ])
      )
      expect(http).not.toHaveBeenCalled()
    })

    it('opens from the dashboard consumer detail with a dashboard breadcrumb trail', async () => {
      const { user } = await renderApp(`/it/erogazione/panoramica/fruitori/${FIRST_CONSUMER.id}`)
      await user.click(
        await screen.findByRole('link', {
          name: itPages.providerDashboardConsumerDetail.goToEServiceDetail
            .replace('{{name}}', ESERVICE.name)
            .replace('{{version}}', resource.version),
        })
      )

      expect(location()).toBe(dashboardPath(FIRST_CONSUMER.id))
      expect(
        await screen.findByRole('heading', { level: 1, name: ESERVICE.name })
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(getBreadcrumbs()).toEqual([
          ...dashboardParents(FIRST_CONSUMER.id, FIRST_CONSUMER.name),
          { label: ESERVICE.name },
        ])
      )
      // This fixture has no waiting purposes, even though the table has rows.
      expect(getPurposes).toHaveBeenCalledTimes(1)
      expect(screen.queryByText(copy.waitingApproval.title)).not.toBeInTheDocument()

      // Every restored dashboard parent navigates back to its route.
      await user.click(screen.getByRole('link', { name: FIRST_CONSUMER.name }))
      expect(location()).toBe(`/it/erogazione/panoramica/fruitori/${FIRST_CONSUMER.id}`)
      await user.click(
        await screen.findByRole('link', {
          name: itPages.providerDashboardConsumerDetail.goToEServiceDetail
            .replace('{{name}}', ESERVICE.name)
            .replace('{{version}}', resource.version),
        })
      )
      await screen.findByRole('heading', { level: 1, name: ESERVICE.name })
      await user.click(screen.getByRole('link', { name: routeLabels.PROVIDE_DASHBOARD_CONSUMERS }))
      expect(location()).toBe('/it/erogazione/panoramica/fruitori')
      expect(screen.getByText('Destination other')).toBeInTheDocument()
    })

    it('opens from the e-service monitoring tab with a monitoring breadcrumb trail', async () => {
      const { user } = await renderApp(`/it/erogazione/e-service/${ESERVICE.id}/${DESCRIPTOR_ID}`)
      await user.click(
        await screen.findByRole('button', {
          name: itEservice.read.monitoring.consumers.viewConsumerAriaLabel.replace(
            '{{name}}',
            LAZIO.name
          ),
        })
      )

      expect(location()).toBe(monitoringPath(LAZIO.id))
      expect(await screen.findByRole('heading', { level: 1, name: LAZIO.name })).toBeInTheDocument()
      await waitFor(() =>
        expect(getBreadcrumbs()).toEqual([
          { label: routeLabels.PROVIDE, href: '/it/erogazione' },
          { label: routeLabels.PROVIDE_ESERVICE_LIST, href: '/it/erogazione/e-service' },
          { label: LAZIO.name },
        ])
      )
      await user.click(screen.getByRole('link', { name: routeLabels.PROVIDE_ESERVICE_LIST }))
      expect(location()).toBe('/it/erogazione/e-service')
      expect(screen.getByText('Destination other')).toBeInTheDocument()
    })

    it.each([
      { language: 'it', pages: itPages, shared: itShared, origin: 'dashboard' },
      { language: 'en', pages: enPages, shared: enShared, origin: 'dashboard' },
      { language: 'it', pages: itPages, shared: itShared, origin: 'monitoring' },
      { language: 'en', pages: enPages, shared: enShared, origin: 'monitoring' },
    ] as const)(
      'navigates versions with real $origin breadcrumbs and reload in $language',
      async ({ language, pages, shared, origin }) => {
        const labels = pages.providerDashboardConsumerEServiceDetail
        const route = origin === 'dashboard' ? dashboardPath : monitoringPath
        const path = route(LAZIO.id).replace('/it/', `/${language}/`)
        const { user, unmount } = await renderApp(path)
        const title = origin === 'dashboard' ? ESERVICE.name : LAZIO.name
        expect(await screen.findByRole('heading', { level: 1, name: title })).toBeVisible()
        // Parents once the consumer is known; with no relationship the consumer parent stays generic.
        const parents = (consumerLabel: string) =>
          origin === 'dashboard'
            ? dashboardParents(LAZIO.id, consumerLabel, language, shared.routeLabels)
            : [
                { label: shared.routeLabels.PROVIDE, href: `/${language}/erogazione` },
                {
                  label: shared.routeLabels.PROVIDE_ESERVICE_LIST,
                  href: `/${language}/erogazione/e-service`,
                },
              ]
        expect(getBreadcrumbs()).toEqual([...parents(LAZIO.name), { label: title }])
        const summary = screen
          .getByText(origin === 'dashboard' ? labels.summary.consumer : labels.summary.eservice)
          .closest('dl')!
        const entries = Array.from(summary.children)
        if (origin === 'dashboard') {
          expect(entries.slice(0, 3).map((entry) => entry.textContent)).toEqual([
            labels.summary.consumer,
            LAZIO.name,
            labels.summary.version,
          ])
          expect(entries[3]).toHaveTextContent(
            labels.summary.versionShort.replace('{{version}}', resource.version)
          )
        } else {
          expect(entries[1]).toHaveTextContent(
            labels.summary.eserviceValue
              .replace('{{name}}', ESERVICE.name)
              .replace('{{version}}', resource.version)
          )
        }
        const versionPath = route(LAZIO.id, OLDEST_DESCRIPTOR_ID).replace('/it/', `/${language}/`)
        const link = within(summary).getByRole('link', {
          name: labels.summary.otherVersionAriaLabel.replace('{{version}}', '0'),
        })
        expect(link).toHaveAttribute('href', versionPath)
        await user.click(link)
        expect(location()).toBe(versionPath)
        expect(await screen.findByText(labels.noRelationship)).toBeInTheDocument()
        expect(mainCalls().at(-1)).toEqual(
          expect.objectContaining({ consumerId: LAZIO.id, descriptorId: OLDEST_DESCRIPTOR_ID })
        )
        expect(
          screen.getByRole('heading', {
            level: 1,
            name: origin === 'dashboard' ? ESERVICE.name : labels.fallbackTitle,
          })
        ).toBeVisible()
        unmount()

        await renderApp(versionPath)
        expect(await screen.findByText(labels.noRelationship)).toBeInTheDocument()
        expect(getBreadcrumbs()).toEqual([
          ...parents(shared.routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL),
          {
            label:
              origin === 'dashboard'
                ? ESERVICE.name
                : shared.routeLabels.PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL,
          },
        ])
      }
    )

    it.each([
      {
        origin: 'dashboard',
        path: dashboardPath(FIRST_CONSUMER.id),
        parent: FIRST_CONSUMER.name,
        title: ESERVICE.name,
      },
      {
        origin: 'monitoring',
        path: monitoringPath(FIRST_CONSUMER.id),
        parent: routeLabels.PROVIDE_ESERVICE_LIST,
        title: FIRST_CONSUMER.name,
      },
    ])(
      'restores breadcrumbs and URL state on a $origin direct link/reload',
      async ({ path, parent, title }) => {
        await renderApp(`${path}?states=SUSPENDED&q=Sospesa`)
        expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument()
        await waitFor(() => expect(getBreadcrumbs().at(-1)).toEqual({ label: title }))
        expect(getBreadcrumbs().at(-2)?.label).toBe(parent)
        expect(mainCalls()[0]).toEqual(
          expect.objectContaining({
            consumerId: FIRST_CONSUMER.id,
            descriptorId: DESCRIPTOR_ID,
            states: ['SUSPENDED'],
            q: 'Sospesa',
            offset: 0,
            includeArchived: false,
          })
        )
        const table = screen.getByRole('table')
        expect(within(table).getAllByRole('row')).toHaveLength(2)
        expect(within(table).getByText(`Sospesa ${FIRST_CONSUMER.name}`)).toBeInTheDocument()
        expect(screen.getByRole('textbox', { name: copy.searchPlaceholder })).toHaveValue('Sospesa')
      }
    )

    it('keeps the generic breadcrumb labels while loading and on load errors', async () => {
      getPurposes.mockRejectedValue(new Error('boom'))
      await renderApp(dashboardPath(FIRST_CONSUMER.id))
      expect(await screen.findByText(copy.loadError)).toBeInTheDocument()
      expect(getBreadcrumbs()).toEqual([
        ...dashboardParents(FIRST_CONSUMER.id, routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL),
        { label: routeLabels.PROVIDE_DASHBOARD_CONSUMER_ESERVICE_DETAIL },
      ])
      expect(getPurposes).toHaveBeenCalledTimes(1)
    })

    it.each([
      { language: 'it', pages: itPages, shared: itShared, origin: 'dashboard' },
      { language: 'en', pages: enPages, shared: enShared, origin: 'dashboard' },
      { language: 'it', pages: itPages, shared: itShared, origin: 'monitoring' },
      { language: 'en', pages: enPages, shared: enShared, origin: 'monitoring' },
    ] as const)(
      'recovers $origin breadcrumbs after an error in $language',
      async ({ language, pages, shared, origin }) => {
        let releaseRetry: () => void = () => {}
        getPurposes.mockRejectedValueOnce(new Error('boom'))
        getPurposes.mockImplementationOnce(
          (params) =>
            new Promise((resolve) => {
              releaseRetry = () =>
                resolve(getMockProducerEServiceMonitoringConsumerPurposes(params))
            })
        )
        const path = (origin === 'dashboard' ? dashboardPath : monitoringPath)(LAZIO.id).replace(
          '/it/',
          `/${language}/`
        )
        const labels = pages.providerDashboardConsumerEServiceDetail
        const parents = (consumerLabel: string) =>
          origin === 'dashboard'
            ? dashboardParents(LAZIO.id, consumerLabel, language, shared.routeLabels)
            : [
                { label: shared.routeLabels.PROVIDE, href: `/${language}/erogazione` },
                {
                  label: shared.routeLabels.PROVIDE_ESERVICE_LIST,
                  href: `/${language}/erogazione/e-service`,
                },
              ]
        const { user } = await renderApp(path)
        expect(await screen.findByText(labels.loadError)).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 1, name: labels.fallbackTitle })).toBeVisible()
        const fallbackBreadcrumbs = [
          ...parents(shared.routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL),
          {
            label:
              origin === 'dashboard'
                ? shared.routeLabels.PROVIDE_DASHBOARD_CONSUMER_ESERVICE_DETAIL
                : shared.routeLabels.PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL,
          },
        ]
        expect(getBreadcrumbs()).toEqual(fallbackBreadcrumbs)
        const assertHeader = () => {
          expect(screen.getByText(labels.description)).toBeVisible()
          const exportButton = screen.getByRole('button', { name: labels.export })
          expect(exportButton).toBeDisabled()
          expect(exportButton.parentElement).toHaveStyle({
            marginLeft: 'auto',
            flexShrink: '0',
            whiteSpace: 'nowrap',
          })
        }
        assertHeader()
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: labels.retry }))
        await waitFor(() => expect(getPurposes).toHaveBeenCalledTimes(2))
        // A pending retry must not restore stale data or turn Export into an available action.
        assertHeader()
        expect(getBreadcrumbs()).toEqual(fallbackBreadcrumbs)
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: labels.retry })).not.toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
        expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()

        releaseRetry()
        const title = origin === 'dashboard' ? ESERVICE.name : LAZIO.name
        expect(await screen.findByRole('heading', { level: 1, name: title })).toBeVisible()
        expect(getBreadcrumbs()).toEqual([...parents(LAZIO.name), { label: title }])
        assertHeader()
        expect(screen.queryByText(labels.loadError)).not.toBeInTheDocument()
        expect(getPurposes).toHaveBeenCalledTimes(2)
      }
    )
  })

  describe('waiting-for-approval warning', () => {
    it('states that the threshold is exceeded only when approved calls exceed it', async () => {
      await renderApp(monitoringPath(LAZIO.id))
      expect(await screen.findByText(copy.waitingApproval.title)).toBeInTheDocument()
      expect(
        screen.getByText(copy.waitingApproval.descriptionThresholdExceeded)
      ).toBeInTheDocument()
      expect(screen.queryByText(copy.waitingApproval.description)).not.toBeInTheDocument()
      expect(getPurposes).toHaveBeenCalledTimes(1)
    })

    it('uses neutral wording when waiting purposes exist below the threshold', async () => {
      await renderApp(monitoringPath(MILANO.id))
      expect(await screen.findByText(copy.waitingApproval.title)).toBeInTheDocument()
      expect(screen.getByText(copy.waitingApproval.description)).toBeInTheDocument()
      expect(
        screen.queryByText(copy.waitingApproval.descriptionThresholdExceeded)
      ).not.toBeInTheDocument()
      expect(getPurposes).toHaveBeenCalledTimes(1)
    })
  })

  it('shows the no-relationship state for an unknown consumer without a synthetic relationship', async () => {
    await renderApp(dashboardPath(UNKNOWN_CONSUMER_ID))
    expect(await screen.findByText(copy.noRelationship)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: ESERVICE.name })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText(copy.summary.threshold)).not.toBeInTheDocument()
    expect(getPurposes).toHaveBeenCalledTimes(1)
    expect(getBreadcrumbs()).toEqual([
      ...dashboardParents(UNKNOWN_CONSUMER_ID, routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL),
      { label: ESERVICE.name },
    ])
  })

  it('paginates through the URL and resets to page 1 when a state filter is applied', async () => {
    getPurposes.mockImplementation(async (params) => buildPagedResponse(params, 23))
    const { user } = await renderApp(dashboardPath(FIRST_CONSUMER.id))
    expect(await screen.findByText('Finalità 01')).toBeInTheDocument()
    expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()
    expect(getPurposes).toHaveBeenCalledTimes(1)
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(11)

    await user.click(screen.getByRole('button', { name: /pagina 2|page 2/i }))
    expect(await screen.findByText('Finalità 11')).toBeInTheDocument()
    expect(screen.queryByText('Finalità 01')).not.toBeInTheDocument()
    expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()
    expect(getPurposes).toHaveBeenCalledTimes(2)
    expect(mainCalls().at(-1)).toEqual(expect.objectContaining({ offset: 10, limit: 10 }))
    // nuqs updates the browser URL directly (shallow), so read it from window.location.
    await waitFor(() => expect(window.location.search).toContain('offset=10'))

    await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
    await user.click(await screen.findByRole('combobox', { name: copy.filters.states }))
    await user.click(
      await screen.findByRole('option', { name: copy.filters.stateOptions.SUSPENDED })
    )
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: itFilters.additionals.actions.apply }))

    await waitFor(() =>
      expect(mainCalls().at(-1)).toEqual(
        expect.objectContaining({ offset: 0, states: ['SUSPENDED'] })
      )
    )
    const table = screen.getByRole('table')
    await waitFor(() => expect(within(table).getAllByRole('row')).toHaveLength(9))
    expect(within(table).queryByText('Finalità 02')).not.toBeInTheDocument()
    expect(within(table).getByText('Finalità 01')).toBeInTheDocument()
    expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()
    expect(getPurposes).toHaveBeenCalledTimes(3)
    await waitFor(() => expect(window.location.search).not.toContain('offset=10'))
    expect(new URLSearchParams(window.location.search).get('states')).toBe('SUSPENDED')
  })

  it.each([
    { origin: 'dashboard', path: dashboardPath(LAZIO.id) },
    { origin: 'monitoring', path: monitoringPath(LAZIO.id) },
  ])(
    'applies and clears draft filters from $origin without changing search/sort or the warning',
    async ({ path }) => {
      const search = `?offset=10&q=${encodeURIComponent(LAZIO.name)}&sortBy=NAME_ASC`
      const { user } = await renderApp(`${path}${search}`)
      await screen.findByText(copy.empty)
      await screen.findByText(copy.waitingApproval.title)

      await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
      const drawer = await screen.findByRole('dialog', { name: itFilters.additionals.title })
      expect(drawer).toHaveAccessibleDescription(itFilters.additionals.subtitle)
      expect(within(drawer).getAllByText(itFilters.additionals.title)).toHaveLength(1)
      const archived = within(drawer).getByLabelText(copy.filters.includeArchived)
      expect(archived).not.toBeChecked()
      await user.click(archived)
      await user.click(within(drawer).getByRole('combobox', { name: copy.filters.states }))
      const list = await screen.findByRole('listbox')
      expect(
        within(list)
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual([
        copy.filters.selectAll,
        copy.filters.stateOptions.ACTIVE,
        copy.filters.stateOptions.SUSPENDED,
        copy.filters.stateOptions.WAITING_FOR_APPROVAL,
        copy.filters.stateOptions.REJECTED,
      ])
      await user.click(within(list).getByRole('option', { name: copy.filters.selectAll }))
      for (const option of within(list).getAllByRole('option').slice(1)) {
        expect(option).toHaveAttribute('aria-selected', 'true')
      }
      // Select all is reversible. Leave one individual state selected for the API assertion.
      await user.click(within(list).getByRole('option', { name: copy.filters.selectAll }))
      for (const option of within(list).getAllByRole('option').slice(1)) {
        expect(option).toHaveAttribute('aria-selected', 'false')
      }
      await user.click(
        within(list).getByRole('option', { name: copy.filters.stateOptions.SUSPENDED })
      )
      await user.keyboard('{Escape}')
      expect(mainCalls()).toHaveLength(1)
      expect(window.location.search).not.toContain('includeArchived')
      await user.click(
        within(drawer).getByRole('button', { name: itFilters.additionals.actions.apply })
      )
      await waitFor(() =>
        expect(mainCalls().at(-1)).toEqual(
          expect.objectContaining({
            states: ['SUSPENDED'],
            includeArchived: true,
            offset: 0,
            q: LAZIO.name,
            sortBy: 'NAME_ASC',
          })
        )
      )
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      await waitFor(() => {
        const params = new URLSearchParams(window.location.search)
        expect(params.get('states')).toBe('SUSPENDED')
        expect(params.get('includeArchived')).toBe('true')
        expect(params.has('offset')).toBe(false)
      })
      expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()
      expect(getPurposes).toHaveBeenCalledTimes(2)

      await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
      const reopened = await screen.findByRole('dialog')
      expect(within(reopened).getByLabelText(copy.filters.includeArchived)).toBeChecked()
      expect(
        within(reopened).getByRole('combobox', { name: copy.filters.states })
      ).toHaveTextContent(copy.filters.stateOptions.SUSPENDED)
      await user.click(
        within(reopened).getByRole('button', { name: itFilters.additionals.actions.reset })
      )
      await waitFor(() =>
        expect(mainCalls().at(-1)).toEqual(
          expect.objectContaining({
            states: undefined,
            includeArchived: false,
            offset: 0,
            q: LAZIO.name,
            sortBy: 'NAME_ASC',
          })
        )
      )
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(screen.getByRole('textbox', { name: copy.searchPlaceholder })).toHaveValue(LAZIO.name)
      expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()
      expect(getPurposes).toHaveBeenCalledTimes(3)
      await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
      const cleared = await screen.findByRole('dialog')
      expect(within(cleared).getByLabelText(copy.filters.includeArchived)).not.toBeChecked()
      expect(
        within(cleared).getByRole('combobox', { name: copy.filters.states })
      ).not.toHaveTextContent(copy.filters.stateOptions.SUSPENDED)
    }
  )

  it.each(['close', 'escape', 'backdrop'] as const)(
    'discards pending filters on %s and restores the applied URL values on reopening',
    async (dismiss) => {
      const { user } = await renderApp(
        `${dashboardPath(FIRST_CONSUMER.id)}?states=SUSPENDED&includeArchived=true`
      )
      await screen.findByRole('table')
      await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
      const drawer = await screen.findByRole('dialog')
      await user.click(within(drawer).getByLabelText(copy.filters.includeArchived))
      await user.click(within(drawer).getByRole('combobox', { name: copy.filters.states }))
      await user.click(
        await screen.findByRole('option', { name: copy.filters.stateOptions.ACTIVE })
      )
      await user.keyboard('{Escape}')
      if (dismiss === 'close') {
        await user.click(
          within(drawer).getByRole('button', { name: itShared.drawer.closeIconAriaLabel })
        )
      } else if (dismiss === 'escape') {
        await user.keyboard('{Escape}')
      } else {
        await user.click(document.querySelector<HTMLElement>('.MuiBackdrop-root')!)
      }
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(mainCalls()).toHaveLength(1)
      const params = new URLSearchParams(window.location.search)
      expect(params.get('states')).toBe('SUSPENDED')
      expect(params.get('includeArchived')).toBe('true')

      await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
      const reopened = await screen.findByRole('dialog')
      expect(within(reopened).getByLabelText(copy.filters.includeArchived)).toBeChecked()
      const select = within(reopened).getByRole('combobox', { name: copy.filters.states })
      expect(select).toHaveTextContent(copy.filters.stateOptions.SUSPENDED)
      expect(select).not.toHaveTextContent(copy.filters.stateOptions.ACTIVE)
    }
  )

  it.each([
    { origin: 'dashboard', path: dashboardPath(FIRST_CONSUMER.id) },
    { origin: 'monitoring', path: monitoringPath(FIRST_CONSUMER.id) },
  ])('restores applied filters on browser back and forward from $origin', async ({ path }) => {
    const { user } = await renderApp(`${path}?states=SUSPENDED&offset=10`)
    await screen.findByText(copy.empty)
    await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
    const drawer = await screen.findByRole('dialog')
    const archived = within(drawer).getByLabelText(copy.filters.includeArchived)
    archived.focus()
    await user.keyboard(' ')
    expect(archived).toBeChecked()
    await user.click(within(drawer).getByRole('combobox', { name: copy.filters.states }))
    await user.click(await screen.findByRole('option', { name: copy.filters.stateOptions.ACTIVE }))
    await user.keyboard('{Escape}')
    await user.click(
      within(drawer).getByRole('button', { name: itFilters.additionals.actions.apply })
    )
    await waitFor(() => {
      const params = new URLSearchParams(window.location.search)
      expect(params.get('states')).toBe('SUSPENDED,ACTIVE')
      expect(params.get('includeArchived')).toBe('true')
      expect(params.has('offset')).toBe(false)
    })
    await waitFor(() =>
      expect(mainCalls().at(-1)).toEqual(
        expect.objectContaining({
          states: ['SUSPENDED', 'ACTIVE'],
          includeArchived: true,
          offset: 0,
        })
      )
    )

    window.history.back()
    await waitFor(() => {
      const params = new URLSearchParams(window.location.search)
      expect(params.get('states')).toBe('SUSPENDED')
      expect(params.has('includeArchived')).toBe(false)
      expect(params.get('offset')).toBe('10')
    })
    await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
    const restored = await screen.findByRole('dialog')
    expect(within(restored).getByLabelText(copy.filters.includeArchived)).not.toBeChecked()
    const restoredSelect = within(restored).getByRole('combobox', { name: copy.filters.states })
    expect(restoredSelect).toHaveTextContent(copy.filters.stateOptions.SUSPENDED)
    expect(restoredSelect).not.toHaveTextContent(copy.filters.stateOptions.ACTIVE)
    await user.click(
      within(restored).getByRole('button', { name: itShared.drawer.closeIconAriaLabel })
    )

    window.history.forward()
    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).get('includeArchived')).toBe('true')
    )
    await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
    const forwarded = await screen.findByRole('dialog')
    expect(within(forwarded).getByLabelText(copy.filters.includeArchived)).toBeChecked()
    expect(
      within(forwarded).getByRole('combobox', { name: copy.filters.states })
    ).toHaveTextContent(copy.filters.stateOptions.ACTIVE)
  })

  it('includes archived rows only after applying the toggle and restores it from the URL', async () => {
    const { user, unmount } = await renderApp(
      `${monitoringPath(FIRST_CONSUMER.id)}?q=Archiviata&sortBy=NAME_ASC`
    )
    await screen.findByText(copy.empty)
    await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
    const drawer = await screen.findByRole('dialog')
    await user.click(within(drawer).getByLabelText(copy.filters.includeArchived))
    expect(screen.queryByText(`Archiviata ${FIRST_CONSUMER.name}`)).not.toBeInTheDocument()
    await user.click(
      within(drawer).getByRole('button', { name: itFilters.additionals.actions.apply })
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(await screen.findByText(`Archiviata ${FIRST_CONSUMER.name}`)).toBeInTheDocument()
    await waitFor(() => expect(window.location.search).toContain('includeArchived=true'))
    const savedURL = window.location.pathname + window.location.search
    unmount()

    await renderApp(savedURL)
    expect(await screen.findByText(`Archiviata ${FIRST_CONSUMER.name}`)).toBeInTheDocument()
    expect(mainCalls().at(-1)).toEqual(
      expect.objectContaining({ includeArchived: true, q: 'Archiviata', sortBy: 'NAME_ASC' })
    )
  })

  it('opens the responsive bottom drawer and applies filters on mobile', async () => {
    stubMobile()
    const { user } = await renderApp(monitoringPath(FIRST_CONSUMER.id))
    await screen.findByText(FIRST_CONSUMER.name, { selector: 'h1' })
    await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
    const drawer = await screen.findByRole('dialog', { name: itFilters.additionals.title })
    expect(drawer).toHaveClass('MuiDrawer-paperAnchorBottom')
    await user.click(within(drawer).getByLabelText(copy.filters.includeArchived))
    await user.click(
      within(drawer).getByRole('button', { name: itFilters.additionals.actions.apply })
    )
    await waitFor(() =>
      expect(mainCalls().at(-1)).toEqual(
        expect.objectContaining({ includeArchived: true, offset: 0 })
      )
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('navigates to the provider purpose detail from the row action', async () => {
    const { user } = await renderApp(monitoringPath(LAZIO.id))
    const table = await screen.findByRole('table')
    const firstRow = within(table).getAllByRole('row')[1]
    const title = within(firstRow).getAllByRole('cell')[0].textContent!
    const purpose = getMockProducerEServiceMonitoringConsumerPurposes({
      eserviceId: ESERVICE.id,
      descriptorId: DESCRIPTOR_ID,
      consumerId: LAZIO.id,
      offset: 0,
      limit: 10,
      sortBy: 'DATE_DESC',
      includeArchived: false,
    }).results[0]
    expect(title).toBe(purpose.title)
    await user.click(
      within(firstRow).getByRole('link', { name: copy.goToPurpose.replace('{{title}}', title) })
    )
    expect(location()).toBe(`/it/erogazione/finalita/${purpose.purposeId}`)
    expect(screen.getByText('Destination purpose')).toBeInTheDocument()
  })

  it.each(['dashboard', 'monitoring'] as const)(
    'always shows the Italian subtitle and a right-aligned, non-wrapping export action from %s',
    async (origin) => {
      let release: () => void = () => {}
      getPurposes.mockImplementation(
        (params) =>
          new Promise((resolve) => {
            release = () => resolve(getMockProducerEServiceMonitoringConsumerPurposes(params))
          })
      )
      const path = origin === 'dashboard' ? dashboardPath : monitoringPath
      await renderApp(path(LAZIO.id))

      const subtitle =
        'Vedi i consumi previsti e le finalità create dal fruitore per questo e-service.'
      expect(copy.description).toBe(subtitle)
      const assertHeader = () => {
        expect(screen.getByText(subtitle)).toBeVisible()
        const exportButton = screen.getByRole('button', { name: copy.export })
        expect(exportButton).toBeDisabled()
        expect(exportButton.parentElement).toHaveStyle({
          marginLeft: 'auto',
          flexShrink: '0',
          whiteSpace: 'nowrap',
        })
      }

      // While pending: no stale/fallback heading, but subtitle and action are already there.
      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
      assertHeader()

      release()
      const heading = await screen.findByRole('heading', {
        level: 1,
        name: origin === 'dashboard' ? ESERVICE.name : LAZIO.name,
      })
      // The title is the flexible item: it wraps instead of overflowing or squeezing the action.
      const headingStyle = getComputedStyle(heading)
      expect(parseFloat(headingStyle.minWidth)).toBe(0)
      expect(headingStyle.overflowWrap).toBe('anywhere')
      assertHeader()
    }
  )

  it.each(['dashboard', 'monitoring'] as const)(
    'never shows the previous version rows while another version loads from %s',
    async (origin) => {
      let releaseOldest: () => void = () => {}
      getPurposes.mockImplementation((params) =>
        params.descriptorId === OLDEST_DESCRIPTOR_ID
          ? new Promise((resolve) => {
              releaseOldest = () =>
                resolve(getMockProducerEServiceMonitoringConsumerPurposes(params))
            })
          : Promise.resolve(getMockProducerEServiceMonitoringConsumerPurposes(params))
      )
      const path = origin === 'dashboard' ? dashboardPath : monitoringPath
      const { user } = await renderApp(path(LAZIO.id))
      const table = await screen.findByRole('table')
      const firstTitle = within(within(table).getAllByRole('row')[1]).getAllByRole('cell')[0]
        .textContent!
      expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()

      await user.click(
        screen.getByRole('link', {
          name: copy.summary.otherVersionAriaLabel.replace('{{version}}', '0'),
        })
      )
      expect(location()).toBe(path(LAZIO.id, OLDEST_DESCRIPTOR_ID))
      await waitFor(() => expect(screen.queryByText(firstTitle)).not.toBeInTheDocument())
      // No stale heading is rendered while the new version loads (title omitted while pending).
      expect(
        screen.queryByRole('heading', {
          level: 1,
          name: origin === 'dashboard' ? ESERVICE.name : LAZIO.name,
        })
      ).not.toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
      expect(screen.queryByText(copy.waitingApproval.title)).not.toBeInTheDocument()

      releaseOldest()
      // Lazio has no relationship with the archived version fixture.
      expect(await screen.findByText(copy.noRelationship)).toBeInTheDocument()
      expect(screen.queryByText(firstTitle)).not.toBeInTheDocument()
    }
  )

  it('labels every mobile value and keeps the purpose action on small screens', async () => {
    stubMobile()
    await renderApp(monitoringPath(LAZIO.id))
    expect(await screen.findByRole('heading', { level: 1, name: LAZIO.name })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    const list = await screen.findByRole('group', {
      name: copy.tableAriaLabel.replace('{{name}}', LAZIO.name),
    })
    const purpose = getMockProducerEServiceMonitoringConsumerPurposes({
      eserviceId: ESERVICE.id,
      descriptorId: DESCRIPTOR_ID,
      consumerId: LAZIO.id,
      offset: 0,
      limit: 10,
      sortBy: 'DATE_DESC',
      includeArchived: false,
    }).results[0]
    const card = within(list).getByText(purpose.title).closest('dl')!.parentElement!
    expect(within(card).getByRole('definition', { name: copy.columns.title })).toHaveTextContent(
      purpose.title
    )
    expect(within(card).getByRole('definition', { name: copy.columns.state })).toHaveTextContent(
      itCommon.status.purpose[purpose.state]
    )
    expect(
      within(card).getByRole('definition', { name: copy.columns.dailyCalls })
    ).toBeInTheDocument()
    expect(
      within(card).getByRole('definition', { name: copy.columns.updatedAt })
    ).toBeInTheDocument()
    expect(
      within(card).getByRole('link', { name: copy.goToPurpose.replace('{{title}}', purpose.title) })
    ).toHaveAttribute('href', `/it/erogazione/finalita/${purpose.purposeId}`)
    expect(screen.getByRole('link', { name: copy.waitingApproval.action })).toBeInTheDocument()
  })
})
