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

const isWaitingProbe = (params: GetProducerEServiceMonitoringConsumerPurposesParams) =>
  params.limit === 1 && params.states?.length === 1 && params.states[0] === 'WAITING_FOR_APPROVAL'
const mainCalls = () => getPurposes.mock.calls.map(([p]) => p).filter((p) => !isWaitingProbe(p))
const waitingCalls = () => getPurposes.mock.calls.map(([p]) => p).filter(isWaitingProbe)

const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '/src/static/locales/it/*.json',
  { eager: true }
)
const itResources = Object.fromEntries(
  Object.entries(localeModules).map(([path, mod]) => [
    path.split('/').pop()!.replace('.json', ''),
    mod.default,
  ])
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
  await i18n.init({
    lng: 'it',
    fallbackLng: false,
    resources: { it: itResources } as Resource,
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
      expect(await screen.findByRole('heading', { level: 1, name: consumer.name })).toBeVisible()
      await waitFor(() => {
        expect(getBreadcrumbs().at(-2)?.label).toBe(consumer.name)
        expect(getBreadcrumbs().at(-1)?.label).toBe(row.eservice.name)
      })
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
        await screen.findByRole('heading', { level: 1, name: FIRST_CONSUMER.name })
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(getBreadcrumbs()).toEqual([
          { label: routeLabels.PROVIDE, href: '/it/erogazione' },
          { label: routeLabels.PROVIDE_DASHBOARD, href: '/it/erogazione/panoramica' },
          {
            label: routeLabels.PROVIDE_DASHBOARD_CONSUMERS,
            href: '/it/erogazione/panoramica/fruitori',
          },
          {
            label: FIRST_CONSUMER.name,
            href: `/it/erogazione/panoramica/fruitori/${FIRST_CONSUMER.id}`,
          },
          { label: ESERVICE.name },
        ])
      )
      // Fixture consumer has no waiting purposes: no warning, but the probe ran.
      expect(waitingCalls()).toHaveLength(1)
      expect(screen.queryByText(copy.waitingApproval.title)).not.toBeInTheDocument()

      // The consumer breadcrumb goes back to the real consumer detail page.
      await user.click(screen.getByRole('link', { name: FIRST_CONSUMER.name }))
      expect(location()).toBe(`/it/erogazione/panoramica/fruitori/${FIRST_CONSUMER.id}`)
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
          {
            label: copy.breadcrumbManageEService,
            href: `/it/erogazione/e-service/${ESERVICE.id}/${DESCRIPTOR_ID}`,
          },
          { label: ESERVICE.name },
        ])
      )
    })

    it.each([
      { origin: 'dashboard', path: dashboardPath(FIRST_CONSUMER.id), parent: FIRST_CONSUMER.name },
      {
        origin: 'monitoring',
        path: monitoringPath(FIRST_CONSUMER.id),
        parent: copy.breadcrumbManageEService,
      },
    ])(
      'restores breadcrumbs and URL state on a $origin direct link/reload',
      async ({ path, parent }) => {
        await renderApp(`${path}?states=SUSPENDED&q=Sospesa`)
        expect(
          await screen.findByRole('heading', { level: 1, name: FIRST_CONSUMER.name })
        ).toBeInTheDocument()
        await waitFor(() => expect(getBreadcrumbs().at(-1)).toEqual({ label: ESERVICE.name }))
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
      expect(getBreadcrumbs().slice(-2)).toEqual([
        {
          label: routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL,
          href: `/it/erogazione/panoramica/fruitori/${FIRST_CONSUMER.id}`,
        },
        { label: routeLabels.PROVIDE_DASHBOARD_CONSUMER_ESERVICE_DETAIL },
      ])
      expect(waitingCalls()).toHaveLength(0)
    })
  })

  describe('waiting-for-approval warning', () => {
    it('states that the threshold is exceeded only when approved calls exceed it', async () => {
      await renderApp(monitoringPath(LAZIO.id))
      expect(await screen.findByText(copy.waitingApproval.title)).toBeInTheDocument()
      expect(
        screen.getByText(copy.waitingApproval.descriptionThresholdExceeded)
      ).toBeInTheDocument()
      expect(screen.queryByText(copy.waitingApproval.description)).not.toBeInTheDocument()
    })

    it('uses neutral wording when waiting purposes exist below the threshold', async () => {
      await renderApp(monitoringPath(MILANO.id))
      expect(await screen.findByText(copy.waitingApproval.title)).toBeInTheDocument()
      expect(screen.getByText(copy.waitingApproval.description)).toBeInTheDocument()
      expect(
        screen.queryByText(copy.waitingApproval.descriptionThresholdExceeded)
      ).not.toBeInTheDocument()
      // The warning ignores the table filters: the probe is independent from them.
      expect(waitingCalls()[0]).toEqual(
        expect.objectContaining({ offset: 0, limit: 1, includeArchived: false })
      )
      expect(waitingCalls()[0].q).toBeUndefined()
    })

    it('surfaces an ancillary probe failure without hiding the purposes and recovers on retry', async () => {
      let failProbe = true
      getPurposes.mockImplementation(async (params) => {
        if (isWaitingProbe(params) && failProbe) throw new Error('probe down')
        return getMockProducerEServiceMonitoringConsumerPurposes(params)
      })
      const { user } = await renderApp(monitoringPath(LAZIO.id))
      expect(await screen.findByText(copy.waitingApproval.loadError)).toBeInTheDocument()
      expect(screen.queryByText(copy.waitingApproval.title)).not.toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.queryByText(copy.loadError)).not.toBeInTheDocument()

      failProbe = false
      await user.click(screen.getByRole('button', { name: copy.retry }))
      expect(await screen.findByText(copy.waitingApproval.title)).toBeInTheDocument()
      expect(screen.queryByText(copy.waitingApproval.loadError)).not.toBeInTheDocument()
    })
  })

  it('shows the no-relationship state for an unknown consumer without a synthetic relationship', async () => {
    await renderApp(dashboardPath(UNKNOWN_CONSUMER_ID))
    expect(await screen.findByText(copy.noRelationship)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: copy.fallbackTitle })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText(copy.summary.threshold)).not.toBeInTheDocument()
    expect(waitingCalls()).toHaveLength(0)
    expect(getBreadcrumbs().at(-2)?.label).toBe(routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL)
  })

  it('paginates through the URL and resets to page 1 when a state filter is applied', async () => {
    getPurposes.mockImplementation(async (params) =>
      isWaitingProbe(params)
        ? buildPagedResponse({ ...params, states: ['WAITING_FOR_APPROVAL'] }, 0)
        : buildPagedResponse(params, 23)
    )
    const { user } = await renderApp(dashboardPath(FIRST_CONSUMER.id))
    expect(await screen.findByText('Finalità 01')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(11)

    await user.click(screen.getByRole('button', { name: /pagina 2|page 2/i }))
    expect(await screen.findByText('Finalità 11')).toBeInTheDocument()
    expect(screen.queryByText('Finalità 01')).not.toBeInTheDocument()
    expect(mainCalls().at(-1)).toEqual(expect.objectContaining({ offset: 10, limit: 10 }))
    // nuqs updates the browser URL directly (shallow), so read it from window.location.
    await waitFor(() => expect(window.location.search).toContain('offset=10'))

    await user.click(screen.getByRole('button', { name: itFilters.additionals.trigger }))
    await user.click(await screen.findByRole('combobox', { name: copy.filters.states }))
    await user.click(await screen.findByRole('option', { name: itCommon.status.purpose.SUSPENDED }))
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
    await waitFor(() => expect(window.location.search).not.toContain('offset=10'))
    expect(new URLSearchParams(window.location.search).get('states')).toBe('SUSPENDED')
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

  it('never shows the previous version rows while another version loads', async () => {
    let releaseOldest: () => void = () => {}
    getPurposes.mockImplementation((params) =>
      params.descriptorId === OLDEST_DESCRIPTOR_ID
        ? new Promise((resolve) => {
            releaseOldest = () => resolve(getMockProducerEServiceMonitoringConsumerPurposes(params))
          })
        : Promise.resolve(getMockProducerEServiceMonitoringConsumerPurposes(params))
    )
    const { user } = await renderApp(monitoringPath(LAZIO.id))
    const table = await screen.findByRole('table')
    const firstTitle = within(within(table).getAllByRole('row')[1]).getAllByRole('cell')[0]
      .textContent!
    expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', {
        name: copy.summary.otherVersionAriaLabel.replace('{{version}}', '0'),
      })
    )
    expect(location()).toBe(monitoringPath(LAZIO.id, OLDEST_DESCRIPTOR_ID))
    await waitFor(() => expect(screen.queryByText(firstTitle)).not.toBeInTheDocument())
    // Only the PageContainer skeleton heading is visible while the new version loads.
    expect(screen.queryByRole('heading', { level: 1, name: LAZIO.name })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText(copy.waitingApproval.title)).not.toBeInTheDocument()

    releaseOldest()
    // Lazio has no relationship with the archived version fixture.
    expect(await screen.findByText(copy.noRelationship)).toBeInTheDocument()
    expect(screen.queryByText(firstTitle)).not.toBeInTheDocument()
  })

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
