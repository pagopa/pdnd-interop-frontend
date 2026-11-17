import type { ReactNode } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as LayoutContainers from '@/components/layout/containers'
import type {
  GetProducerEServiceMonitoringConsumerPurposesParams,
  ProducerEServiceMonitoringConsumerPurposes,
} from '@/api/api.generatedTypes'
import { ProducerServices } from '@/api/producer'
import { mockUseJwt } from '@/utils/testing.utils'
import { getParentRoutes, routes } from '@/router'
import ProviderDashboardConsumerEServiceDetail from '../ProviderDashboardConsumerEServiceDetail.page'
import type { ConsumerEServiceDetailOrigin } from '../consumerEServiceDetail.utils'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'
import itCommon from '@/static/locales/it/common.json'
import enCommon from '@/static/locales/en/common.json'
import itFilters from '@/static/locales/it/filters.json'
import enFilters from '@/static/locales/en/filters.json'
import itPurpose from '@/static/locales/it/purpose.json'
import enPurpose from '@/static/locales/en/purpose.json'

vi.unmock('react-i18next')
vi.mock('@/api/producer/producer.services', () => ({
  ProducerServices: { getEServiceMonitoringConsumerPurposes: vi.fn() },
}))

vi.mock('@/components/layout/containers', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof LayoutContainers
  return {
    ...actual,
    PageContainer: ({
      isLoading,
      title,
      description,
      titleAction,
      breadcrumbRouteLabelOverrides,
      children,
    }: {
      isLoading?: boolean
      title: string
      description: string
      titleAction?: ReactNode
      breadcrumbRouteLabelOverrides?: Record<string, string | false>
      children: ReactNode
    }) => (
      <main>
        <div data-testid="breadcrumbs">{JSON.stringify(breadcrumbRouteLabelOverrides ?? {})}</div>
        {!isLoading && <h1>{title}</h1>}
        <p>{description}</p>
        {titleAction}
        {children}
      </main>
    ),
  }
})

const ESERVICE_ID = 'eservice-1'
const DESCRIPTOR_ID = 'descriptor-2'
const CONSUMER_ID = 'consumer-1'
const OTHER_CONSUMER_ID = 'consumer-2'
const getPurposes = vi.mocked(ProducerServices.getEServiceMonitoringConsumerPurposes)
const copy = itPages.providerDashboardConsumerEServiceDetail

type Params = GetProducerEServiceMonitoringConsumerPurposesParams

const buildResponse = (
  params: Params,
  overrides: Partial<ProducerEServiceMonitoringConsumerPurposes> = {}
): ProducerEServiceMonitoringConsumerPurposes => {
  const isOther = params.consumerId === OTHER_CONSUMER_ID
  const isWaitingProbe = params.states?.length === 1 && params.states[0] === 'WAITING_FOR_APPROVAL'
  return {
    eservice: { id: ESERVICE_ID, name: 'Anagrafe nazionale' },
    version: '2',
    otherVersions: [{ descriptorId: 'descriptor-1', version: '1' }],
    consumer: isOther
      ? { id: OTHER_CONSUMER_ID, name: 'Comune di Roma', kind: 'PA' }
      : { id: CONSUMER_ID, name: 'Regione Lombardia', kind: 'PA' },
    dailyCallsPerConsumer: 10000,
    customizedByAttribute: isOther
      ? undefined
      : { id: 'attr-1', name: 'Regioni', kind: 'CERTIFIED' },
    approvedDailyCalls: 9500,
    percentage: 95,
    results: isWaitingProbe
      ? []
      : isOther
        ? [
            {
              purposeId: 'purpose-roma',
              title: 'Finalità Roma',
              dailyCalls: 10,
              state: 'ACTIVE',
              updatedAt: '2025-02-01T10:00:00Z',
            },
          ]
        : [
            {
              purposeId: 'purpose-1',
              title: 'Verifica residenza',
              dailyCalls: 1200,
              state: 'ACTIVE',
              updatedAt: '2025-03-01T10:00:00Z',
            },
            {
              purposeId: 'purpose-2',
              title: 'Controllo ISEE',
              dailyCalls: 300,
              state: 'SUSPENDED',
              suspendedByConsumer: true,
              updatedAt: '2025-02-01T10:00:00Z',
            },
          ],
    pagination: {
      offset: params.offset,
      limit: params.limit,
      totalCount: isWaitingProbe ? (isOther ? 0 : 2) : isOther ? 1 : 2,
    },
    ...overrides,
  } as ProducerEServiceMonitoringConsumerPurposes
}

const dashboardPath = (consumerId = CONSUMER_ID) =>
  `/it/erogazione/panoramica/fruitori/${consumerId}/e-service/${ESERVICE_ID}/${DESCRIPTOR_ID}`
const monitoringPath = (consumerId = CONSUMER_ID) =>
  `/it/erogazione/e-service/${ESERVICE_ID}/${DESCRIPTOR_ID}/monitoraggio/fruitori/${consumerId}`

const GoToConsumer = ({ origin }: { origin: ConsumerEServiceDetailOrigin }) => {
  const navigate = useNavigate()
  const to = origin === 'dashboard' ? dashboardPath : monitoringPath
  return <button onClick={() => navigate(to(OTHER_CONSUMER_ID))}>switch consumer</button>
}

const renderPage = async ({
  origin = 'dashboard',
  language = 'it',
  search = '',
}: { origin?: ConsumerEServiceDetailOrigin; language?: 'it' | 'en'; search?: string } = {}) => {
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: {
      it: { pages: itPages, filters: itFilters, common: itCommon, purpose: itPurpose },
      en: { pages: enPages, filters: enFilters, common: enCommon, purpose: enPurpose },
    },
  })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, throwOnError: true } },
  })
  const path =
    origin === 'dashboard'
      ? '/:language/erogazione/panoramica/fruitori/:consumerId/e-service/:eserviceId/:descriptorId'
      : '/:language/erogazione/e-service/:eserviceId/:descriptorId/monitoraggio/fruitori/:consumerId'
  const initial = origin === 'dashboard' ? dashboardPath() : monitoringPath()
  return render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[`${initial}${search}`]}>
            <NuqsTestingAdapter searchParams={search} hasMemory>
              <Routes>
                <Route
                  path={path}
                  element={
                    <>
                      <GoToConsumer origin={origin} />
                      <ProviderDashboardConsumerEServiceDetail origin={origin} />
                    </>
                  }
                />
              </Routes>
            </NuqsTestingAdapter>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

const mainCalls = () =>
  getPurposes.mock.calls
    .map(([params]) => params)
    .filter((params) => !(params.limit === 1 && params.states?.[0] === 'WAITING_FOR_APPROVAL'))
const breadcrumbs = () =>
  JSON.parse(screen.getByTestId('breadcrumbs').textContent ?? '{}') as Record<string, string>

describe('ProviderDashboardConsumerEServiceDetail', () => {
  beforeEach(() => {
    getPurposes.mockReset()
    getPurposes.mockImplementation(async (params) => buildResponse(params))
    mockUseJwt({ currentRoles: ['admin'] })
  })

  describe('routes', () => {
    it('registers one alias per entry point with origin-specific parent hierarchy', () => {
      expect(routes.PROVIDE_DASHBOARD_CONSUMER_ESERVICE_DETAIL.path).toBe(
        '/erogazione/panoramica/fruitori/:consumerId/e-service/:eserviceId/:descriptorId'
      )
      expect(routes.PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL.path).toBe(
        '/erogazione/e-service/:eserviceId/:descriptorId/monitoraggio/fruitori/:consumerId'
      )
      expect(getParentRoutes('PROVIDE_DASHBOARD_CONSUMER_ESERVICE_DETAIL')).toEqual([
        'DEFAULT',
        'PROVIDE',
        'PROVIDE_DASHBOARD',
        'PROVIDE_DASHBOARD_CONSUMERS',
        'PROVIDE_DASHBOARD_CONSUMER_DETAIL',
      ])
      expect(getParentRoutes('PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL')).toEqual([
        'DEFAULT',
        'PROVIDE',
        'PROVIDE_ESERVICE_LIST',
        'PROVIDE_ESERVICE_MANAGE',
      ])
    })
  })

  it.each([
    { language: 'it', labels: itPages.providerDashboardConsumerEServiceDetail },
    { language: 'en', labels: enPages.providerDashboardConsumerEServiceDetail },
  ] as const)('renders header, summary and table in $language', async ({ language, labels }) => {
    const user = userEvent.setup()
    await renderPage({ language })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })
    ).toBeInTheDocument()
    expect(screen.getByText(labels.description)).toBeInTheDocument()
    expect(screen.getByText('Anagrafe nazionale, V2')).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: labels.summary.otherVersionAriaLabel.replace('{{version}}', '1'),
      })
    ).toHaveAttribute(
      'href',
      `/${language}/erogazione/panoramica/fruitori/${CONSUMER_ID}/e-service/${ESERVICE_ID}/descriptor-1`
    )
    const customChip = screen.getByText(labels.summary.customizedThreshold)
    await user.hover(customChip)
    expect(
      await screen.findByRole('tooltip', {
        name: `${labels.summary.attributeKind.CERTIFIED}: Regioni`,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(labels.summary.percentageAriaLabel.replace('{{value}}', '95'))
    ).toBeInTheDocument()

    const table = screen.getByRole('table', {
      name: labels.tableAriaLabel.replace('{{name}}', 'Regione Lombardia'),
    })
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((header) => header.textContent)
    expect(headers.slice(0, 4)).toEqual([
      labels.columns.title,
      labels.columns.dailyCalls,
      labels.columns.state,
      labels.columns.updatedAt,
    ])
    expect(within(table).getAllByRole('row')).toHaveLength(3)

    const exportButton = screen.getByRole('button', { name: labels.export })
    expect(exportButton).toBeDisabled()
    expect(exportButton).toHaveAccessibleDescription(labels.exportUnavailable)
  })

  it('requests newest first by default with includeArchived=false', async () => {
    await renderPage()
    await screen.findByRole('table')
    expect(mainCalls()[0]).toEqual(
      expect.objectContaining({
        eserviceId: ESERVICE_ID,
        descriptorId: DESCRIPTOR_ID,
        consumerId: CONSUMER_ID,
        offset: 0,
        sortBy: 'DATE_DESC',
        includeArchived: false,
      })
    )
    expect(mainCalls()[0].states).toBeUndefined()
  })

  it('links each row to the provider purpose detail and shows suspension origin', async () => {
    await renderPage()
    const table = await screen.findByRole('table')
    const row = within(table).getAllByRole('row')[2]
    expect(
      within(row).getByText(itCommon.status.agreement.frontendStatus.suspendedByConsumer)
    ).toBeInTheDocument()
    expect(
      within(row).getByRole('link', {
        name: copy.goToPurpose.replace('{{title}}', 'Controllo ISEE'),
      })
    ).toHaveAttribute('href', '/it/erogazione/finalita/purpose-2')
  })

  it('hides the purpose chevron for roles without access', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    await renderPage()
    await screen.findByRole('table')
    expect(screen.queryByRole('link', { name: /Vedi la finalità/ })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: copy.waitingApproval.action })
    ).not.toBeInTheDocument()
    expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()
  })

  it('shows the waiting-for-approval warning with a filtered purposes list CTA', async () => {
    await renderPage()
    const cta = await screen.findByRole('link', { name: copy.waitingApproval.action })
    expect(screen.getByText(copy.waitingApproval.title)).toBeInTheDocument()
    const url = new URL(cta.getAttribute('href') ?? '', 'http://localhost')
    expect(url.pathname).toBe('/it/erogazione/finalita')
    expect(JSON.parse(url.searchParams.get('eservicesIds') ?? '')).toEqual([
      ['Anagrafe nazionale', ESERVICE_ID],
    ])
    expect(JSON.parse(url.searchParams.get('consumersIds') ?? '')).toEqual([
      ['Regione Lombardia', CONSUMER_ID],
    ])
    expect(JSON.parse(url.searchParams.get('states') ?? '')).toEqual([
      [
        itPurpose.list.filters.statusField.optionLabels.WAITING_FOR_APPROVAL,
        'WAITING_FOR_APPROVAL',
      ],
    ])
  })

  it('submits the search and resets the page', async () => {
    const user = userEvent.setup()
    await renderPage({ search: '?offset=10' })
    await screen.findByRole('table')
    await user.type(screen.getByRole('textbox', { name: copy.searchPlaceholder }), 'isee')
    await user.click(screen.getByRole('button', { name: itFilters.button }))
    await waitFor(() =>
      expect(mainCalls().at(-1)).toEqual(expect.objectContaining({ q: 'isee', offset: 0 }))
    )
  })

  it('hydrates state filters from the URL', async () => {
    await renderPage({ search: '?states=SUSPENDED,ACTIVE' })
    await screen.findByRole('table')
    expect(mainCalls()[0].states).toEqual(['SUSPENDED', 'ACTIVE'])
  })

  it('changes sort and resets the page', async () => {
    const user = userEvent.setup()
    await renderPage({ search: '?offset=10' })
    await screen.findByRole('table')
    expect(mainCalls()[0]).toEqual(expect.objectContaining({ offset: 10, sortBy: 'DATE_DESC' }))
    await user.click(screen.getByRole('button', { name: copy.sorting.DATE_DESC }))
    await user.click(screen.getByRole('menuitem', { name: copy.sorting.NAME_ASC }))
    await waitFor(() =>
      expect(mainCalls().at(-1)).toEqual(expect.objectContaining({ offset: 0, sortBy: 'NAME_ASC' }))
    )
  })

  it('uses dashboard breadcrumbs: consumer name then e-service name', async () => {
    await renderPage({ origin: 'dashboard' })
    await screen.findByRole('table')
    expect(breadcrumbs()).toEqual({
      PROVIDE_DASHBOARD_CONSUMER_DETAIL: 'Regione Lombardia',
      PROVIDE_DASHBOARD_CONSUMER_ESERVICE_DETAIL: 'Anagrafe nazionale',
    })
  })

  it('uses monitoring breadcrumbs: Gestisci E-service then e-service name', async () => {
    await renderPage({ origin: 'monitoring' })
    await screen.findByRole('table')
    expect(breadcrumbs()).toEqual({
      PROVIDE_ESERVICE_MANAGE: copy.breadcrumbManageEService,
      PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL: 'Anagrafe nazionale',
    })
    expect(
      screen.getByRole('link', {
        name: copy.summary.otherVersionAriaLabel.replace('{{version}}', '1'),
      })
    ).toHaveAttribute(
      'href',
      `/it/erogazione/e-service/${ESERVICE_ID}/descriptor-1/monitoraggio/fruitori/${CONSUMER_ID}`
    )
  })

  it('shows a loading state while pending', async () => {
    getPurposes.mockImplementation(() => new Promise(() => {}))
    await renderPage()
    expect(await screen.findByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('shows an error with retry', async () => {
    const user = userEvent.setup()
    getPurposes.mockRejectedValueOnce(new Error('boom'))
    await renderPage()
    expect(await screen.findByText(copy.loadError)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: copy.retry }))
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('shows the no-relationship state when consumer is missing', async () => {
    getPurposes.mockImplementation(async (params) =>
      buildResponse(params, {
        consumer: undefined,
        results: [],
        pagination: { offset: 0, limit: 10, totalCount: 0 },
      })
    )
    await renderPage()
    expect(await screen.findByText(copy.noRelationship)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: copy.fallbackTitle })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText(copy.waitingApproval.title)).not.toBeInTheDocument()
  })

  it('shows the empty state when no purpose matches', async () => {
    getPurposes.mockImplementation(async (params) =>
      buildResponse(params, { results: [], pagination: { offset: 0, limit: 10, totalCount: 0 } })
    )
    await renderPage()
    expect(await screen.findByText(copy.empty)).toBeInTheDocument()
  })

  it('does not show the previous consumer data when the consumer changes', async () => {
    const user = userEvent.setup()
    let resolveOther: (value: ProducerEServiceMonitoringConsumerPurposes) => void = () => {}
    getPurposes.mockImplementation((params) =>
      params.consumerId === OTHER_CONSUMER_ID
        ? new Promise((resolve) => {
            resolveOther = () => resolve(buildResponse(params))
          })
        : Promise.resolve(buildResponse(params))
    )
    await renderPage()
    await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })
    await user.click(screen.getByRole('button', { name: 'switch consumer' }))
    await waitFor(() => expect(screen.queryByText('Verifica residenza')).not.toBeInTheDocument())
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.queryByText(copy.waitingApproval.title)).not.toBeInTheDocument()
    resolveOther(buildResponse({} as Params))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Comune di Roma' })
    ).toBeInTheDocument()
    expect(screen.getByText('Finalità Roma')).toBeInTheDocument()
  })
})
