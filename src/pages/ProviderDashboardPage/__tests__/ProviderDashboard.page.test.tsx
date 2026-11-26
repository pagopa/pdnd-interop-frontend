import { Suspense, type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { theme } from '@pagopa/interop-fe-commons'
import type * as LayoutContainers from '@/components/layout/containers'
import ProviderDashboardPage from '../ProviderDashboard.page'
import { CardDashboard } from '@/components/shared/CardDashboard/CardDashboard'
import type { CardDashboardProps } from '@/components/shared/CardDashboard/CardDashboard'
import type * as DashboardCard from '@/components/shared/CardDashboard/CardDashboard'
import { mockUseJwt } from '@/utils/testing.utils'
import * as router from '@/router'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'
import itDashboard from '@/static/locales/it/dashboard.json'
import enDashboard from '@/static/locales/en/dashboard.json'
import itEservice from '@/static/locales/it/eservice.json'
import enEservice from '@/static/locales/en/eservice.json'
import { ProducerServices } from '@/api/producer'
import type {
  MonitoringArchiving,
  MonitoringArchivingRow,
  ProducerDashboard,
  ProducerDashboardConsumers,
  ProducerDashboardSaturation,
  ProducerDashboardSaturationItem,
} from '@/api/api.generatedTypes'

vi.unmock('react-i18next')

vi.mock('@/components/layout/containers', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof LayoutContainers

  return {
    ...actual,
    PageContainer: ({
      title,
      description,
      children,
    }: {
      title: string
      description: string
      children: ReactNode
    }) => (
      <main>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </main>
    ),
  }
})

vi.mock('@/components/shared/CardDashboard/CardDashboard', () => ({
  CardDashboard: vi.fn(({ heading, action }: CardDashboardProps) => (
    <section aria-label={heading}>
      <h3>{heading}</h3>
      {action && <button onClick={action.action}>{action.text}</button>}
    </section>
  )),
}))

const navigateMock = vi.fn()
const cardMock = vi.mocked(CardDashboard)

const dashboard: ProducerDashboard = {
  eservices: {
    total: 97,
    published: 31,
    suspended: 7,
    archiving: 5,
    archivingSuspended: 2,
  },
  pendingAgreements: 13,
  waitingForApprovalPurposes: 29,
  activeAgreements: 14321,
  alignment: {
    aligned: 11001,
    agreementWithoutPurposes: 2202,
    purposesWithoutAgreement: 303,
  },
  averageActivePurposesPerEService: 4.7,
}

const consumers: ProducerDashboardConsumers = {
  totalConsumers: 42,
  results: [],
  pagination: { offset: 0, limit: 1, totalCount: 42 },
}

const emptyDashboard: ProducerDashboard = {
  eservices: { total: 0, published: 0, suspended: 0, archiving: 0, archivingSuspended: 0 },
  pendingAgreements: 0,
  waitingForApprovalPurposes: 0,
  activeAgreements: 0,
  alignment: { aligned: 0, agreementWithoutPurposes: 0, purposesWithoutAgreement: 0 },
  averageActivePurposesPerEService: 0,
}

const emptyConsumers: ProducerDashboardConsumers = {
  totalConsumers: 0,
  results: [],
  pagination: { offset: 0, limit: 1, totalCount: 0 },
}

const CurrentPath = () => <span data-testid="current-path">{useLocation().pathname}</span>
let restoreBrowser: (() => void) | undefined

const renderDashboard = async (
  language: 'it' | 'en' = 'it',
  waitForData = true,
  search = '',
  throwOnError = false,
  productionAdapter = false
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, throwOnError } },
  })
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: {
      it: { pages: itPages, dashboard: itDashboard, eservice: itEservice },
      en: { pages: enPages, dashboard: enDashboard, eservice: enEservice },
    },
  })

  if (productionAdapter) {
    const originalUrl = window.location.href
    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    window.history.replaceState(null, '', `/it${search}`)
    restoreBrowser = () => {
      scroll.mockRestore()
      window.history.replaceState(null, '', originalUrl)
    }
  }
  const content = (
    <>
      <CurrentPath />
      <ErrorBoundary fallback={<div role="alert">Dashboard error</div>}>
        <Suspense fallback={<div role="status">Loading dashboard</div>}>
          <ProviderDashboardPage />
        </Suspense>
      </ErrorBoundary>
    </>
  )
  const result = render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          {productionAdapter ? (
            <BrowserRouter>
              <NuqsAdapter>{content}</NuqsAdapter>
            </BrowserRouter>
          ) : (
            <MemoryRouter initialEntries={[`/it${search}`]}>
              <NuqsTestingAdapter searchParams={search} hasMemory>
                {content}
              </NuqsTestingAdapter>
            </MemoryRouter>
          )}
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )

  if (waitForData) {
    await screen.findByRole('heading', { level: 1 })
  }
  return { ...result, queryClient }
}

const getCards = () => cardMock.mock.calls.slice(-6).map(([props]) => props)

const saturationRow = (
  index: number,
  overrides: Partial<ProducerDashboardSaturationItem> = {}
): ProducerDashboardSaturationItem => ({
  eservice: { id: `eservice-${index}`, name: `E-service ${index}` },
  descriptorId: `descriptor-${index}`,
  version: String(index),
  activePurposesCount: index,
  approvedDailyCalls: 1000 * index,
  dailyCallsTotal: 2000 * index,
  percentage: 50,
  waitingForApprovalDailyCalls: 0,
  ...overrides,
})

const saturationResponse = (
  results: ProducerDashboardSaturationItem[]
): ProducerDashboardSaturation => ({
  // The dashboard does not display the summary.
  summary: { overThreshold: 777, nearThreshold: 888, total: 999 },
  results,
  pagination: { offset: 0, limit: 5, totalCount: results.length },
})

const emptyArchiving: MonitoringArchiving = { results: [] }

const getSectionTable = async (section: 'thresholds' | 'archiving') => {
  const region = document.querySelector<HTMLElement>(
    `[aria-labelledby="dashboard-${section}-title"]`
  )!
  return within(region).findByRole('table')
}

const getBodyRows = (table: HTMLElement) => within(table).getAllByRole('row').slice(1)

describe('ProviderDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ currentRoles: ['admin'] })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
    vi.spyOn(ProducerServices, 'getDashboard').mockResolvedValue(dashboard)
    vi.spyOn(ProducerServices, 'getDashboardConsumers').mockResolvedValue(consumers)
    vi.spyOn(ProducerServices, 'getDashboardSaturation').mockResolvedValue(saturationResponse([]))
    vi.spyOn(ProducerServices, 'getDashboardArchiving').mockResolvedValue(emptyArchiving)
  })

  it('should query the producer dashboard and map its values to the six cards', async () => {
    const { queryClient } = await renderDashboard()
    const cards = getCards()

    expect(ProducerServices.getDashboard).toHaveBeenCalledExactlyOnceWith()
    expect(queryClient.getQueryData(['ProducerGetDashboard'])).toEqual(dashboard)
    expect(cards).toHaveLength(6)
    expect(cards.map((card) => card.content.kind)).toEqual([
      'status',
      'metric',
      'metric',
      'metric',
      'metrics',
      'metric',
    ])
    expect(cards[0].content).toMatchObject({
      total: 97,
      statuses: [{ count: 31 }, { count: 7 }, { count: 5 }, { count: 2 }],
    })
    expect(cards[1].content).toMatchObject({ metric: { value: 13 } })
    expect(cards[2].content).toMatchObject({ metric: { value: 29 } })
    expect(cards[3].content).toMatchObject({
      metric: { value: 14321, label: itPages.dashboard.units.activeAgreements },
    })
    expect(cards[4].content).toMatchObject({
      metrics: [{ value: 11001 }, { value: 2202 }, { value: 303 }],
    })
    expect(cards[4].content).toMatchObject({
      metrics: Object.values(itPages.dashboard.metrics).map((label) => ({ label })),
    })
    expect(cards[5].content).toMatchObject({
      metric: { value: 4.7, label: itPages.dashboard.units.purposesPerEservice },
    })
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('should map e-service status colors from the shared application theme', async () => {
    await renderDashboard()

    expect(getCards()[0].content).toMatchObject({
      kind: 'status',
      statuses: [
        { id: 'active', color: theme.colors.turquoise[600] },
        { id: 'suspended', color: theme.palette.error.dark },
        { id: 'archiving', color: theme.palette.primary.main },
        { id: 'suspendedArchiving', color: theme.palette.info.main },
      ],
    })
  })

  it('should show the suspense fallback without cards until the query resolves', async () => {
    let resolveDashboard!: (value: ProducerDashboard) => void
    vi.mocked(ProducerServices.getDashboard).mockReturnValue(
      new Promise<ProducerDashboard>((resolve) => {
        resolveDashboard = resolve
      })
    )

    await renderDashboard('it', false)

    expect(screen.getByRole('status')).toHaveTextContent('Loading dashboard')
    expect(cardMock).not.toHaveBeenCalled()

    await act(async () => resolveDashboard(dashboard))

    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByText('Loading dashboard')).not.toBeInTheDocument()
    expect(getCards()).toHaveLength(6)
  })

  it('should propagate query errors to the boundary instead of showing fallback metrics', async () => {
    vi.mocked(ProducerServices.getDashboard).mockRejectedValue(new Error('Dashboard unavailable'))

    await renderDashboard('it', false)

    expect(await screen.findByRole('alert')).toHaveTextContent('Dashboard error')
    expect(cardMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should preserve valid zero metrics and show empty content only for the first four cards', async () => {
    vi.mocked(ProducerServices.getDashboard).mockResolvedValue(emptyDashboard)
    vi.mocked(ProducerServices.getDashboardConsumers).mockResolvedValue(emptyConsumers)

    await renderDashboard()

    const cards = getCards()
    for (const index of [0, 1, 2, 3]) {
      expect(cards[index].content.kind).toBe('empty')
    }
    expect(cards[5].content).toMatchObject({
      metric: { value: 0, label: itPages.dashboard.units.purposesPerEservice },
    })
    expect(cards[4].content).toMatchObject({
      metrics: [{ value: 0 }, { value: 0 }, { value: 0 }],
    })
  })

  it('should use full-width, half-width, and one-third-width grid items at xs, sm, and lg', async () => {
    const { container } = await renderDashboard()
    const grid = container.querySelector('.MuiGrid-container')

    expect(grid?.children).toHaveLength(6)
    for (const item of Array.from(grid?.children ?? [])) {
      expect(item).toHaveClass(
        'MuiGrid-item',
        'MuiGrid-grid-xs-12',
        'MuiGrid-grid-sm-6',
        'MuiGrid-grid-lg-4'
      )
    }

    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules))
    const gridStyles = rules.map((rule) => rule.cssText).join('\n')
    const breakpointStyles = (breakpoint: 'sm' | 'lg') =>
      rules
        .filter(
          (rule) =>
            rule instanceof CSSMediaRule &&
            rule.conditionText === theme.breakpoints.up(breakpoint).replace('@media ', '')
        )
        .map((rule) => rule.cssText)
        .join('\n')
    expect(gridStyles).toMatch(/flex-basis: 100%/)
    expect(breakpointStyles('sm')).toMatch(/flex-basis: 50%/)
    expect(breakpointStyles('lg')).toMatch(/flex-basis: 33\.333333%/)
  })

  it.each([
    { language: 'it', dictionary: itPages.dashboard },
    { language: 'en', dictionary: enPages.dashboard },
  ] as const)(
    'should translate the page and every card in $language',
    async ({ language, dictionary }) => {
      const expectedCopy =
        language === 'it'
          ? {
              headings: [
                'Stato dei tuoi e-service',
                'Richieste di fruizione in attesa di approvazione',
                'Finalità in attesa di approvazione',
                'Richieste di fruizione attive',
                'Dettaglio fruitori per stato fruizione e finalità',
                'Media di finalità per e-service',
              ],
              statuses: ['Attivi', 'Sospesi', 'In archiviazione', 'Sospesi in archiviazione'],
              metrics: [
                'enti con richiesta di fruizione attiva e almeno una finalità attiva',
                'enti con richiesta di fruizione attiva ma nessuna finalità o finalità sospesa',
                'enti con almeno una finalità attiva ma richiesta sospesa',
              ],
              units: [
                'e-service totali',
                'richieste',
                'finalità',
                'richieste attive',
                'finalità per e-service',
              ],
              sectionDescriptions: [
                'Vedi le versioni dei tuoi e-service ordinate per i consumi previsti della soglia totale di chiamate API.',
                'Vedi le versioni di e-service che stanno per essere archiviate e quanti fruitori ci sono.',
              ],
            }
          : {
              headings: [
                'Your e-service status',
                'Fruition requests awaiting approval',
                'Purposes awaiting approval',
                'Active fruition requests',
                'Consumer breakdown by fruition status and purpose',
                'Average purposes per e-service',
              ],
              statuses: ['Active', 'Suspended', 'Archiving', 'Suspended in archiving'],
              metrics: [
                'organizations with an active fruition request and at least one active purpose',
                'organizations with an active fruition request but no active purpose or a suspended purpose',
                'organizations with at least one active purpose but a suspended request',
              ],
              units: [
                'total e-services',
                'requests',
                'purposes',
                'active requests',
                'purposes per e-service',
              ],
              sectionDescriptions: [
                'View your e-service versions ordered by projected consumption of the total API call threshold.',
                'View e-service versions that are about to be archived and how many consumers they have.',
              ],
            }

      await renderDashboard(language)

      expect(Object.values(dictionary.headings)).toEqual(expectedCopy.headings)
      expect(Object.values(dictionary.statuses)).toEqual(expectedCopy.statuses)
      expect(Object.values(dictionary.metrics)).toEqual(expectedCopy.metrics)
      expect(Object.values(dictionary.units)).toEqual(expectedCopy.units)
      expect(Object.values(dictionary.sections).map((section) => section.description)).toEqual(
        expectedCopy.sectionDescriptions
      )
      expect(screen.getByRole('heading', { level: 1, name: dictionary.title })).toBeInTheDocument()
      expect(screen.getByText(dictionary.description)).toBeInTheDocument()
      expect(getCards().map((card) => card.heading)).toEqual([
        dictionary.headings.eservices,
        dictionary.headings.pendingAgreements,
        dictionary.headings.purposesAwaitingApproval,
        dictionary.headings.activeAgreements,
        dictionary.headings.agreementsAndPurposes,
        dictionary.headings.average,
      ])
      expect(getCards()[0].content).toMatchObject({
        totalLabel: dictionary.units.eservices,
        statuses: Object.values(dictionary.statuses).map((label) => ({ label })),
      })
      expect(getCards()[4].content).toMatchObject({
        metrics: Object.values(dictionary.metrics).map((label) => ({ label })),
      })
      expect(getCards()[5].content).toMatchObject({
        metric: { label: dictionary.units.purposesPerEservice },
      })
      for (const section of Object.values(dictionary.sections)) {
        expect(screen.getByRole('heading', { level: 2, name: section.title })).toBeInTheDocument()
        expect(screen.getByText(section.description)).toBeInTheDocument()
        expect(await screen.findByText(section.empty)).toBeInTheDocument()
      }
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      for (const name of Object.values(dictionary.actions)) {
        expect(screen.getAllByRole('button', { name }).length).toBeGreaterThan(0)
      }
    }
  )

  it.each(['admin', 'api'] as const)(
    'should allow %s to follow only the five route-appropriate card actions',
    async (role) => {
      mockUseJwt({ currentRoles: [role] })
      const user = userEvent.setup()
      await renderDashboard()

      const cards = getCards()
      expect(cards.filter((card) => card.action?.type === 'link')).toHaveLength(5)
      expect(cards[3].action?.type).toBe('link')
      expect(cards[4].action).toBeUndefined()
      const expectedActions = [
        {
          heading: itPages.dashboard.headings.eservices,
          text: itPages.dashboard.actions.eservices,
          destination: 'PROVIDE_ESERVICE_LIST',
        },
        {
          heading: itPages.dashboard.headings.pendingAgreements,
          text: itPages.dashboard.actions.agreements,
          destination: 'PROVIDE_AGREEMENT_LIST',
        },
        {
          heading: itPages.dashboard.headings.purposesAwaitingApproval,
          text: itPages.dashboard.actions.purposesAwaitingApproval,
          destination: 'PROVIDE_PURPOSE_LIST',
        },
        {
          heading: itPages.dashboard.headings.activeAgreements,
          text: itPages.dashboard.actions.activeAgreements,
          destination: 'PROVIDE_DASHBOARD_CONSUMERS',
        },
        {
          heading: itPages.dashboard.headings.average,
          text: itPages.dashboard.actions.purposesReceived,
          destination: 'PROVIDE_PURPOSE_LIST',
        },
      ] as const

      for (const { heading, text, destination } of expectedActions) {
        await user.click(within(screen.getByLabelText(heading)).getByRole('button', { name: text }))
        expect(navigateMock).toHaveBeenLastCalledWith(destination)
      }
      expect(navigateMock).toHaveBeenCalledTimes(5)
    }
  )

  it.each(['support', 'viewer'] as const)(
    'should hide create but retain read actions for %s',
    async (role) => {
      mockUseJwt({ currentRoles: [role] })
      await renderDashboard()

      expect(getCards()).toHaveLength(6)
      expect(getCards().filter((card) => card.action?.type === 'link')).toHaveLength(5)
      expect(getCards()[3].action?.type).toBe('link')
      expect(getCards()[4].action).toBeUndefined()
      expect(new Set(screen.getAllByRole('button').map((button) => button.textContent))).toEqual(
        new Set([
          itPages.dashboard.actions.eservices,
          itPages.dashboard.actions.agreements,
          itPages.dashboard.actions.purposesAwaitingApproval,
          itPages.dashboard.actions.purposesReceived,
          itPages.dashboard.actions.activeAgreements,
          itPages.dashboard.sections.thresholds.viewAll,
        ])
      )
    }
  )

  it('should allow security to navigate to e-services and consumer details from cards', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    const user = userEvent.setup()
    await renderDashboard()

    expect(getCards()).toHaveLength(6)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(getCards().filter((card) => card.action === undefined)).toHaveLength(4)
    const allowedActions = [
      {
        heading: itPages.dashboard.headings.eservices,
        label: itPages.dashboard.actions.eservices,
        destination: 'PROVIDE_ESERVICE_LIST',
      },
      {
        heading: itPages.dashboard.headings.activeAgreements,
        label: itPages.dashboard.actions.activeAgreements,
        destination: 'PROVIDE_DASHBOARD_CONSUMERS',
      },
    ] as const
    for (const { heading, label, destination } of allowedActions) {
      const button = within(screen.getByLabelText(heading)).getByRole('button', { name: label })
      await user.click(button)
      expect(navigateMock).toHaveBeenLastCalledWith(destination)
    }
    expect(navigateMock).toHaveBeenCalledTimes(2)
  })

  it.each([{ roles: [] }, { roles: ['reviewer'] }] as const)(
    'should expose no actions for unauthorized roles $roles',
    async ({ roles }) => {
      mockUseJwt({ currentRoles: [...roles] })
      await renderDashboard()

      expect(getCards()).toHaveLength(6)
      await screen.findByText(itPages.dashboard.sections.thresholds.empty)
      await screen.findByText(itPages.dashboard.sections.archiving.empty)
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(getCards().every((card) => card.action === undefined)).toBe(true)
      expect(navigateMock).not.toHaveBeenCalled()
    }
  )
})

describe('ProviderDashboardPage loaded-empty presentation', () => {
  const defaultCardImplementation = cardMock.getMockImplementation()

  beforeEach(async () => {
    vi.clearAllMocks()
    const actual = await vi.importActual<typeof DashboardCard>(
      '@/components/shared/CardDashboard/CardDashboard'
    )
    cardMock.mockImplementation(actual.CardDashboard)
    mockUseJwt({ currentRoles: ['admin'] })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
    vi.spyOn(ProducerServices, 'getDashboard').mockResolvedValue(emptyDashboard)
    vi.spyOn(ProducerServices, 'getDashboardConsumers').mockResolvedValue(emptyConsumers)
    vi.spyOn(ProducerServices, 'getDashboardSaturation').mockResolvedValue(saturationResponse([]))
    vi.spyOn(ProducerServices, 'getDashboardArchiving').mockResolvedValue(emptyArchiving)
  })

  afterEach(() => {
    cardMock.mockImplementation(defaultCardImplementation!)
  })

  it.each([
    { language: 'it', dictionary: itPages.dashboard },
    { language: 'en', dictionary: enPages.dashboard },
  ] as const)(
    'renders the six loaded-empty cards in $language',
    async ({ language, dictionary }) => {
      const { container } = await renderDashboard(language)
      const cards = getCards()
      const regions = [
        dictionary.headings.eservices,
        dictionary.headings.pendingAgreements,
        dictionary.headings.purposesAwaitingApproval,
        dictionary.empty.consumersHeading,
        dictionary.headings.agreementsAndPurposes,
        dictionary.headings.average,
      ].map((name) => screen.getByRole('region', { name }))
      const messages = [
        dictionary.empty.eservices,
        dictionary.empty.pendingAgreements,
        dictionary.empty.purposesAwaitingApproval,
        dictionary.empty.consumers,
      ]
      for (const [index, message] of messages.entries()) {
        expect(within(regions[index]).getByText(message)).toBeVisible()
        expect(within(regions[index]).queryByText('0')).not.toBeInTheDocument()
        expect(within(regions[index]).queryByRole('list')).not.toBeInTheDocument()
        expect(within(regions[index]).queryByRole('img')).not.toBeInTheDocument()
        expect(within(regions[index]).queryByTestId('CheckRoundedIcon') !== null).toBe(
          index === 1 || index === 2
        )
        if (index > 0) {
          expect(within(regions[index]).queryByRole('button')).not.toBeInTheDocument()
        }
      }
      expect(within(regions[4]).getAllByText('0')).toHaveLength(3)
      for (const label of Object.values(dictionary.metrics)) {
        expect(within(regions[4]).getByText(label)).toBeVisible()
      }
      expect(within(regions[5]).getByText('0')).toBeVisible()
      expect(within(regions[5]).getByText(dictionary.units.purposesPerEservice)).toBeVisible()
      expect(within(regions[5]).queryByRole('button')).not.toBeInTheDocument()
      expect(cards.map((card) => card.content.kind)).toEqual([
        'empty',
        'empty',
        'empty',
        'empty',
        'metrics',
        'metric',
      ])
      expect(ProducerServices.getDashboardConsumers).toHaveBeenCalledExactlyOnceWith({
        offset: 0,
        limit: 1,
      })
      const grid = container.querySelector('.MuiGrid-container')
      expect(grid?.children).toHaveLength(6)
      for (const item of Array.from(grid?.children ?? [])) {
        expect(item).toHaveClass('MuiGrid-grid-xs-12', 'MuiGrid-grid-sm-6', 'MuiGrid-grid-lg-4')
      }
      const create = within(regions[0]).getByRole('button', {
        name: dictionary.empty.createEservice,
      })
      expect(create).toHaveClass('MuiButton-contained')
      expect(within(create).getByTestId('AddIcon')).toBeInTheDocument()
      await userEvent.setup().click(create)
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_CREATE')
    }
  )

  it.each(['admin', 'api', 'support', 'security', 'viewer', 'reviewer', 'none'] as const)(
    'gates empty-state creation for %s without exposing normal card actions',
    async (role) => {
      mockUseJwt({ currentRoles: role === 'none' ? [] : [role] })
      await renderDashboard()
      const create = screen.queryByRole('button', { name: itPages.dashboard.empty.createEservice })
      if (role === 'admin' || role === 'api') {
        expect(create).toBeEnabled()
        await userEvent.setup().click(create!)
        expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_CREATE')
      } else {
        expect(create).not.toBeInTheDocument()
        expect(navigateMock).not.toHaveBeenCalled()
      }
      for (const label of Object.values(itPages.dashboard.actions)) {
        expect(screen.queryByRole('button', { name: label })).not.toBeInTheDocument()
      }
    }
  )

  it('decides each empty state independently and uses the consumer total, not active agreements', async () => {
    vi.mocked(ProducerServices.getDashboard).mockResolvedValue({
      ...dashboard,
      eservices: { ...dashboard.eservices, total: 0 },
      waitingForApprovalPurposes: 0,
    })
    // Active agreements are nonzero, but the dedicated consumer count is zero.
    await renderDashboard()
    const cards = getCards()
    expect(cards.map((card) => card.content.kind)).toEqual([
      'empty',
      'metric',
      'empty',
      'empty',
      'metrics',
      'metric',
    ])
    expect(cards[1].content).toMatchObject({ metric: { value: dashboard.pendingAgreements } })
    expect(cards[1].action?.text).toBe(itPages.dashboard.actions.agreements)
    expect(cards[5].action?.text).toBe(itPages.dashboard.actions.purposesReceived)
    expect(cards[2].action).toBeUndefined()
    expect(cards[3].action).toBeUndefined()
  })

  it('does not infer no consumers from zero active agreements or an empty limited result list', async () => {
    vi.mocked(ProducerServices.getDashboardConsumers).mockResolvedValue(consumers)
    await renderDashboard()
    expect(getCards()[3]).toMatchObject({
      heading: itPages.dashboard.headings.activeAgreements,
      content: {
        kind: 'metric',
        metric: { value: 0, label: itPages.dashboard.units.activeAgreements },
      },
      action: { type: 'link', text: itPages.dashboard.actions.activeAgreements },
    })
    expect(screen.queryByText(itPages.dashboard.empty.consumers)).not.toBeInTheDocument()
  })

  it('keeps a nonzero e-service total and purposes visible alongside zero pending agreements', async () => {
    vi.mocked(ProducerServices.getDashboard).mockResolvedValue({
      ...emptyDashboard,
      eservices: { ...emptyDashboard.eservices, total: 1 },
      waitingForApprovalPurposes: 3,
    })
    vi.mocked(ProducerServices.getDashboardConsumers).mockResolvedValue(consumers)
    await renderDashboard()
    const cards = getCards()
    expect(cards.map((card) => card.content.kind)).toEqual([
      'status',
      'empty',
      'metric',
      'metric',
      'metrics',
      'metric',
    ])
    expect(cards[0].content).toMatchObject({
      total: 1,
      statuses: [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }],
    })
    expect(cards[0].action?.text).toBe(itPages.dashboard.actions.eservices)
    expect(cards[1].action).toBeUndefined()
    expect(cards[2].content).toMatchObject({ metric: { value: 3 } })
    expect(cards[2].action?.text).toBe(itPages.dashboard.actions.purposesAwaitingApproval)
    expect(cards[5].content).toMatchObject({
      metric: { value: 0, label: itPages.dashboard.units.purposesPerEservice },
    })
    expect(cards[5].action).toBeUndefined()
    expect(screen.queryByText(itPages.dashboard.empty.eservices)).not.toBeInTheDocument()
    expect(
      screen.queryByText(itPages.dashboard.empty.purposesAwaitingApproval)
    ).not.toBeInTheDocument()
  })

  it('does not show empty cards while the independent consumer count is loading', async () => {
    let resolveConsumers!: (data: ProducerDashboardConsumers) => void
    vi.mocked(ProducerServices.getDashboardConsumers).mockReturnValue(
      new Promise((resolve) => {
        resolveConsumers = resolve
      })
    )
    await renderDashboard('it', false)
    await waitFor(() => expect(ProducerServices.getDashboardConsumers).toHaveBeenCalled())
    expect(screen.getByRole('status')).toHaveTextContent('Loading dashboard')
    expect(cardMock).not.toHaveBeenCalled()
    expect(screen.queryByText(itPages.dashboard.empty.consumers)).not.toBeInTheDocument()
    await act(async () => resolveConsumers(emptyConsumers))
    expect(await screen.findByText(itPages.dashboard.empty.consumers)).toBeVisible()
  })

  it('does not treat a failed consumer query as a loaded zero', async () => {
    vi.mocked(ProducerServices.getDashboardConsumers).mockRejectedValue(
      new Error('Consumers unavailable')
    )
    await renderDashboard('it', false)
    expect(await screen.findByRole('alert')).toHaveTextContent('Dashboard error')
    expect(cardMock).not.toHaveBeenCalled()
    expect(screen.queryByText(itPages.dashboard.empty.consumers)).not.toBeInTheDocument()
  })
})

describe('ProviderDashboardPage tables', () => {
  const thresholds = itPages.dashboard.sections.thresholds
  const archiving = itPages.dashboard.sections.archiving
  const saturationParams = { offset: 0, limit: 5, sortBy: 'PERCENTAGE_DESC' }
  const saturationHeaders = itDashboard.providerSaturationRatePage.table.headlabels

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ currentRoles: ['admin'] })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
    vi.spyOn(ProducerServices, 'getDashboard').mockResolvedValue(dashboard)
    vi.spyOn(ProducerServices, 'getDashboardConsumers').mockResolvedValue(consumers)
    vi.spyOn(ProducerServices, 'getDashboardSaturation').mockResolvedValue(saturationResponse([]))
    vi.spyOn(ProducerServices, 'getDashboardArchiving').mockResolvedValue(emptyArchiving)
  })
  afterEach(() => {
    restoreBrowser?.()
    restoreBrowser = undefined
  })

  it('shows the exact ordered Italian headers and navigable consumption button', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardSaturation).mockResolvedValue(
      saturationResponse([saturationRow(1)])
    )
    vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
      results: [
        {
          eservice: { id: 'es', name: 'E-service' },
          consumersCount: 1,
          archivableOn: '2026-12-01T09:00:00Z',
        },
      ],
    })
    await renderDashboard()
    const saturation = await getSectionTable('thresholds')
    const archive = await getSectionTable('archiving')
    expect(
      within(saturation)
        .getAllByRole('columnheader')
        .slice(0, 5)
        .map((cell) => cell.textContent)
    ).toEqual([
      'Nome e-service e versione',
      'Finalità',
      'Percentuale soglia totale',
      'Chiamate approvate /totale disponibile',
      'Chiamate da approvare',
    ])
    expect(
      within(archive)
        .getAllByRole('columnheader')
        .slice(0, 4)
        .map((cell) => cell.textContent)
    ).toEqual(['Nome e-service', 'Versione', 'Fruitori', 'Data di archiviazione'])
    const button = screen.getByRole('button', { name: 'Vai a tutti i consumi previsti' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('MuiButton-text', 'MuiButton-textPrimary', 'MuiButton-sizeMedium')
    expect(within(button).getByTestId('ArrowForwardIcon')).toBeInTheDocument()
    await user.click(button)
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_SATURATION_RATE')
  })

  it.each(['admin', 'support', 'api', 'security', 'viewer'] as const)(
    'shows the consumption button for %s',
    async (role) => {
      mockUseJwt({ currentRoles: [role] })
      await renderDashboard()
      expect(screen.getByRole('button', { name: 'Vai a tutti i consumi previsti' })).toBeVisible()
    }
  )

  it('hides the consumption button without route access', async () => {
    mockUseJwt({ currentRoles: ['reviewer'] })
    await renderDashboard()
    expect(
      screen.queryByRole('button', { name: 'Vai a tutti i consumi previsti' })
    ).not.toBeInTheDocument()
  })

  it('requests the default page of saturation rows by descending percentage without q', async () => {
    const { queryClient } = await renderDashboard()
    await screen.findByText(thresholds.empty)

    expect(ProducerServices.getDashboardSaturation).toHaveBeenCalledExactlyOnceWith(
      saturationParams
    )
    const [params] = vi.mocked(ProducerServices.getDashboardSaturation).mock.calls[0]
    expect(params).not.toHaveProperty('q')
    expect(ProducerServices.getDashboardArchiving).toHaveBeenCalledExactlyOnceWith()

    const saturationQuery = queryClient
      .getQueryCache()
      .find({ queryKey: ['ProducerGetDashboardSaturation', saturationParams], exact: true })
    const archivingQuery = queryClient
      .getQueryCache()
      .find({ queryKey: ['ProducerGetDashboardArchiving'], exact: true })
    expect(saturationQuery).toBeDefined()
    expect(archivingQuery).toBeDefined()
    expect(
      (saturationQuery?.options as { refetchInterval?: unknown }).refetchInterval
    ).toBeUndefined()
    expect(
      (archivingQuery?.options as { refetchInterval?: unknown }).refetchInterval
    ).toBeUndefined()
  })

  it('should retain mobile label associations and both descriptor and fallback route actions', async () => {
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
    try {
      const user = userEvent.setup()
      vi.mocked(ProducerServices.getDashboardSaturation).mockResolvedValue(
        saturationResponse([saturationRow(1, { percentage: 125 })])
      )
      vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
        results: [
          {
            eservice: { id: 'whole-eservice', name: 'Whole e-service' },
            consumersCount: 0,
            archivableOn: '2026-12-01',
          },
        ],
      })
      await renderDashboard()
      const saturation = (await screen.findByText('E-service 1')).closest('dl')!.parentElement!
      const archive = (await screen.findByText('Whole e-service')).closest('dl')!.parentElement!
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(screen.getByRole('group', { name: thresholds.columns.eservice })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: archiving.columns.eservice })).toBeInTheDocument()
      expect(
        within(saturation)
          .getAllByRole('term')
          .map((term) => term.textContent)
      ).toEqual(Object.values(saturationHeaders))
      expect(
        within(archive)
          .getAllByRole('term')
          .map((term) => term.textContent)
      ).toEqual(Object.values(archiving.columns).slice(0, 4))
      expect(
        within(saturation).getByRole('definition', { name: saturationHeaders.percentageRate })
      ).toHaveTextContent('125%')
      expect(
        within(saturation).getByRole('definition', { name: saturationHeaders.callsToApprove })
      ).toHaveTextContent('0')
      expect(
        within(archive).getByRole('definition', { name: archiving.columns.consumers })
      ).toHaveTextContent('0')
      expect(within(archive).getByText(archiving.wholeEService)).toBeVisible()
      const versionAction = within(saturation).getByRole('button', {
        name: thresholds.viewVersionAriaLabel
          .replace('{{version}}', '1')
          .replace('{{name}}', 'E-service 1'),
      })
      expect(versionAction).toHaveTextContent(/^$/)
      expect(within(versionAction).getByTestId('ChevronRightIcon')).toBeInTheDocument()
      expect(versionAction.children).toHaveLength(1)
      expect(within(saturation).queryByText(thresholds.viewVersion)).not.toBeInTheDocument()
      await user.click(versionAction)
      expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_MANAGE', {
        params: { eserviceId: 'eservice-1', descriptorId: 'descriptor-1' },
      })
      await user.click(
        within(archive).getByRole('button', {
          name: archiving.viewEServicesAriaLabel.replace('{{name}}', 'Whole e-service'),
        })
      )
      expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_LIST')
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('renders saturation rows in backend order with localized values and pagination', async () => {
    vi.mocked(ProducerServices.getDashboardSaturation).mockResolvedValue(
      saturationResponse([
        saturationRow(1, {
          eservice: { id: 'eservice-over', name: 'Anagrafe' },
          descriptorId: 'descriptor-over',
          version: '3',
          activePurposesCount: 12345,
          approvedDailyCalls: 12000,
          dailyCallsTotal: 10000,
          percentage: 125,
          waitingForApprovalDailyCalls: 15000,
        }),
        saturationRow(2, { percentage: 90 }),
        saturationRow(3, { percentage: 40 }),
      ])
    )

    await renderDashboard()
    await screen.findByText('Anagrafe')
    const rows = getBodyRows(await getSectionTable('thresholds'))

    expect(rows).toHaveLength(3)
    expect(rows.map((row) => within(row).getAllByRole('cell')[0].textContent)).toEqual([
      'AnagrafeVersione 3',
      'E-service 2Versione 2',
      'E-service 3Versione 3',
    ])
    const cells = within(rows[0]).getAllByRole('cell')
    expect(cells).toHaveLength(6)
    expect(cells[1]).toHaveTextContent('12.345')
    expect(cells[3]).toHaveTextContent('12.000 / 10.000')
    // Percentages above 100 are shown exactly as returned, without clamping.
    expect(cells[2]).toHaveTextContent('125%')
    expect(cells[4]).toHaveTextContent('15.000')
    expect(within(rows[1]).getAllByRole('cell')[2]).toHaveTextContent(/^90%$/)
    expect(within(rows[1]).getAllByRole('cell')[4]).toHaveTextContent(/^0$/)
    const chart = cells[2].querySelector('svg')!
    expect(chart.closest('[aria-hidden="true"]')).toBeInTheDocument()
    expect(chart).toHaveAttribute('width', '20')
    expect(chart).toHaveAttribute('height', '20')
    expect(cells[2].querySelector('p p, p div')).not.toBeInTheDocument()
    await waitFor(() => {
      const arcs = chart.querySelectorAll('path.MuiPieArc-root')
      expect(arcs).toHaveLength(2)
      expect(arcs[0]).toHaveAttribute('fill', theme.colors.error[600])
      expect(arcs[1]).toHaveAttribute('fill', theme.palette.grey[200])
    })
    // Summary is not displayed on the dashboard.
    expect(screen.queryByText('999')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('uses URL pagination and changes page and page size', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardSaturation).mockImplementation(async (params) => ({
      ...saturationResponse([saturationRow(params.offset + 1)]),
      pagination: { ...params, totalCount: 60 },
    }))
    await renderDashboard('it', true, '?offset=10&limit=10')
    await screen.findByText('E-service 11')
    expect(ProducerServices.getDashboardSaturation).toHaveBeenCalledExactlyOnceWith({
      offset: 10,
      limit: 10,
      sortBy: 'PERCENTAGE_DESC',
    })

    await user.click(screen.getByRole('button', { name: /page 3/i }))
    await screen.findByText('E-service 21')
    await waitFor(() =>
      expect(ProducerServices.getDashboardSaturation).toHaveBeenLastCalledWith({
        offset: 20,
        limit: 10,
        sortBy: 'PERCENTAGE_DESC',
      })
    )
    await user.click(screen.getByRole('combobox'))
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '5',
      '10',
      '15',
    ])
    await user.click(screen.getByRole('option', { name: '15' }))
    await screen.findByText('E-service 1')
    await waitFor(() =>
      expect(ProducerServices.getDashboardSaturation).toHaveBeenLastCalledWith({
        offset: 0,
        limit: 15,
        sortBy: 'PERCENTAGE_DESC',
      })
    )
  })

  it('uses the production router adapter without duplicate pagination requests', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardSaturation).mockImplementation(async (params) => ({
      ...saturationResponse([saturationRow(params.offset + 1)]),
      pagination: { ...params, totalCount: 60 },
    }))
    await renderDashboard('it', true, '', true, true)
    await screen.findByText('E-service 1')
    await waitFor(() =>
      expect(ProducerServices.getDashboardSaturation).toHaveBeenCalledExactlyOnceWith({
        offset: 0,
        limit: 5,
        sortBy: 'PERCENTAGE_DESC',
      })
    )
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await screen.findByText('E-service 6')
    await waitFor(() => expect(new URLSearchParams(window.location.search).get('offset')).toBe('5'))
    expect(screen.queryByText('E-service 1')).not.toBeInTheDocument()

    await user.click(screen.getByRole('combobox'))
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '5',
      '10',
      '15',
    ])
    await user.click(screen.getByRole('option', { name: '10' }))
    await screen.findByText('E-service 1')
    await waitFor(() => expect(new URLSearchParams(window.location.search).get('limit')).toBe('10'))
    expect(new URLSearchParams(window.location.search).has('offset')).toBe(false)
    expect(vi.mocked(ProducerServices.getDashboardSaturation).mock.calls).toEqual([
      [{ offset: 0, limit: 5, sortBy: 'PERCENTAGE_DESC' }],
      [{ offset: 5, limit: 5, sortBy: 'PERCENTAGE_DESC' }],
      [{ offset: 0, limit: 10, sortBy: 'PERCENTAGE_DESC' }],
    ])
  })

  it('handles saturation errors inline even when queries default to throwing', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardSaturation)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(saturationResponse([saturationRow(1)]))
    await renderDashboard('it', true, '', true)
    expect(await screen.findByText(thresholds.loadError)).toBeVisible()
    expect(screen.queryByText('Dashboard error')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: thresholds.retry }))
    expect(await screen.findByText('E-service 1')).toBeVisible()
  })

  it('keeps the previous dashboard page busy while fetching and retries the failed page', async () => {
    const user = userEvent.setup()
    let rejectPage!: (error: Error) => void
    vi.mocked(ProducerServices.getDashboardSaturation)
      .mockResolvedValueOnce({
        ...saturationResponse([saturationRow(1)]),
        pagination: { offset: 0, limit: 5, totalCount: 20 },
      })
      .mockReturnValueOnce(
        new Promise((_, reject) => {
          rejectPage = reject
        })
      )
      .mockResolvedValueOnce({
        ...saturationResponse([saturationRow(6)]),
        pagination: { offset: 5, limit: 5, totalCount: 20 },
      })
    await renderDashboard()
    await screen.findByText('E-service 1')
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await waitFor(() => expect(ProducerServices.getDashboardSaturation).toHaveBeenCalledTimes(2))
    const table = await getSectionTable('thresholds')
    expect(table).toHaveAttribute('aria-busy', 'true')
    expect(within(table).getByText('E-service 1')).toBeVisible()
    await act(async () => rejectPage(new Error('offline')))
    expect(await screen.findByText(thresholds.loadError)).toBeVisible()
    await user.click(screen.getByRole('button', { name: thresholds.retry }))
    expect(await screen.findByText('E-service 6')).toBeVisible()
    expect(ProducerServices.getDashboardSaturation).toHaveBeenLastCalledWith({
      offset: 5,
      limit: 5,
      sortBy: 'PERCENTAGE_DESC',
    })
  })

  it('should navigate from saturation rows to the descriptor detail', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardSaturation).mockResolvedValue(
      saturationResponse([saturationRow(1)])
    )

    await renderDashboard()
    await user.click(
      await screen.findByRole('button', {
        name: 'Vedi la versione 1 di E-service 1',
      })
    )

    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: 'eservice-1', descriptorId: 'descriptor-1' },
    })
  })

  it('should render archiving rows in backend order, without truncation, with optional descriptor fields', async () => {
    const user = userEvent.setup()
    const results: MonitoringArchivingRow[] = [
      {
        eservice: { id: 'es-a', name: 'Versioned service' },
        descriptorId: 'desc-a',
        version: '2',
        consumersCount: 15000,
        archivableOn: '2026-11-10T09:00:00Z',
      },
      {
        eservice: { id: 'es-b', name: 'Whole service' },
        consumersCount: 3,
        archivableOn: '2026-12-01T09:00:00Z',
      },
      {
        eservice: { id: 'es-c', name: 'Unnumbered version service' },
        descriptorId: 'desc-c',
        consumersCount: 4,
        archivableOn: '2026-12-02T09:00:00Z',
      },
      ...Array.from({ length: 5 }, (_, index) => ({
        eservice: { id: `es-extra-${index}`, name: `Extra ${index}` },
        descriptorId: `desc-extra-${index}`,
        version: '1',
        consumersCount: index,
        archivableOn: `2027-01-1${index}T09:00:00Z`,
      })),
    ]
    vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({ results })

    await renderDashboard()
    await screen.findByText('Whole service')
    const rows = getBodyRows(await getSectionTable('archiving'))

    expect(rows).toHaveLength(8)
    expect(rows.map((row) => within(row).getAllByRole('cell')[0].textContent)).toEqual(
      results.map(({ eservice }) => eservice.name)
    )
    const versioned = within(rows[0]).getAllByRole('cell')
    expect(versioned).toHaveLength(5)
    expect(versioned[1]).toHaveTextContent('Versione 2')
    expect(versioned[2]).toHaveTextContent('15.000')
    expect(versioned[3]).toHaveTextContent('10/11/2026')
    const whole = within(rows[1]).getAllByRole('cell')
    expect(whole[1]).toHaveTextContent(archiving.wholeEService)
    expect(whole[3]).toHaveTextContent('01/12/2026')
    expect(rows[1]).not.toHaveTextContent('undefined')
    const unnumbered = within(rows[2]).getAllByRole('cell')
    expect(unnumbered[1].textContent).toBe('')
    expect(unnumbered[2]).toHaveTextContent('4')
    expect(rows[2]).not.toHaveTextContent('undefined')

    await user.click(
      within(rows[0]).getByRole('button', { name: 'Vedi la versione 2 di Versioned service' })
    )
    expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: 'es-a', descriptorId: 'desc-a' },
    })
    const listButton = within(rows[1]).getByRole('button', {
      name: 'Vai alla lista e-service per trovare Whole service',
    })
    expect(listButton).toHaveTextContent(/^$/)
    expect(within(listButton).getByTestId('ChevronRightIcon')).toBeInTheDocument()
    expect(listButton.children).toHaveLength(1)
    await user.click(listButton)
    expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_LIST')
    await user.click(
      within(rows[2]).getByRole('button', {
        name: 'Vedi la versione di Unnumbered version service',
      })
    )
    expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: 'es-c', descriptorId: 'desc-c' },
    })
  })

  it.each([
    ['it', 'desktop'],
    ['it', 'mobile'],
    ['en', 'desktop'],
    ['en', 'mobile'],
  ] as const)('shows calendar-day chips in %s on %s', async (language, viewport) => {
    if (viewport === 'mobile') {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    }
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 12, 23, 55))

    try {
      const { columns } = (language === 'it' ? itPages : enPages).dashboard.sections.archiving
      const labels =
        language === 'it'
          ? ['archiviata', 'oggi', 'tra 1 giorno', 'tra 10 giorni', 'tra 11 giorni']
          : ['archived', 'today', 'in 1 day', 'in 10 days', 'in 11 days']
      const days = [11, 12, 13, 22, 23]
      vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
        results: days.map((day, index) => ({
          eservice: { id: `es-${index}`, name: `Service ${index}` },
          consumersCount: 0,
          archivableOn: new Date(2026, 10, day, 0, 5).toISOString(),
        })),
      })
      await renderDashboard(language)
      const table = await screen.findByRole(viewport === 'mobile' ? 'group' : 'table', {
        name: columns.eservice,
        busy: false,
      })

      const dateCells =
        viewport === 'mobile'
          ? within(table).getAllByRole('definition', { name: columns.archivableOn })
          : getBodyRows(table).map((row) => within(row).getAllByRole('cell')[3])
      expect(dateCells).toHaveLength(days.length)
      labels.forEach((label, index) => {
        const cell = dateCells[index]
        const chip = within(cell).getByText(label).closest('.MuiChip-root')
        expect(chip).toHaveClass(index === 4 ? 'MuiChip-colorInfo' : 'MuiChip-colorError')
        expect(chip?.previousElementSibling).toHaveTextContent(`${days[index]}/11/2026`)
        expect(cell.querySelector('p p, p div')).toBeNull()
      })
    } finally {
      vi.useRealTimers()
      if (viewport === 'mobile') vi.unstubAllGlobals()
    }
  })

  it('should show independent loading skeletons until each table resolves', async () => {
    let resolveSaturation!: (value: ProducerDashboardSaturation) => void
    let resolveArchiving!: (value: MonitoringArchiving) => void
    vi.mocked(ProducerServices.getDashboardSaturation).mockReturnValue(
      new Promise((resolve) => {
        resolveSaturation = resolve
      })
    )
    vi.mocked(ProducerServices.getDashboardArchiving).mockReturnValue(
      new Promise((resolve) => {
        resolveArchiving = resolve
      })
    )

    await renderDashboard()

    const saturationLoading = await screen.findByRole('status', { name: thresholds.loading })
    const archivingLoading = screen.getByRole('status', { name: archiving.loading })
    expect(saturationLoading.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0)
    expect(archivingLoading.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0)

    await act(async () => resolveSaturation(saturationResponse([saturationRow(1)])))
    expect(await screen.findByText('E-service 1')).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: thresholds.loading })).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: archiving.loading })).toBeInTheDocument()

    await act(async () => resolveArchiving(emptyArchiving))
    expect(await screen.findByText(archiving.empty)).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: archiving.loading })).not.toBeInTheDocument()
  })

  it('should show an error with retry per table without affecting the other table or the cards', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardSaturation)
      .mockRejectedValueOnce(new Error('saturation down'))
      .mockResolvedValueOnce(saturationResponse([saturationRow(1)]))
    vi.mocked(ProducerServices.getDashboardArchiving)
      .mockRejectedValueOnce(new Error('archiving down'))
      .mockResolvedValueOnce(emptyArchiving)

    await renderDashboard()

    expect(await screen.findByText(thresholds.loadError)).toBeInTheDocument()
    expect(await screen.findByText(archiving.loadError)).toBeInTheDocument()
    expect(getCards().length).toBeGreaterThanOrEqual(6)

    const [saturationRetry, archivingRetry] = screen.getAllByRole('button', {
      name: thresholds.retry,
    })
    await user.click(saturationRetry)
    expect(await screen.findByText('E-service 1')).toBeInTheDocument()
    expect(screen.queryByText(thresholds.loadError)).not.toBeInTheDocument()
    expect(screen.getByText(archiving.loadError)).toBeInTheDocument()
    expect(ProducerServices.getDashboardSaturation).toHaveBeenCalledTimes(2)
    expect(ProducerServices.getDashboardSaturation).toHaveBeenLastCalledWith(saturationParams)

    await user.click(archivingRetry)
    expect(await screen.findByText(archiving.empty)).toBeInTheDocument()
    expect(ProducerServices.getDashboardArchiving).toHaveBeenCalledTimes(2)
  })

  it('should show localized empty states in English', async () => {
    await renderDashboard('en')

    for (const section of ['thresholds', 'archiving'] as const) {
      const message = await screen.findByText(enPages.dashboard.sections[section].empty)
      const panel = message.closest('[role="status"]') as HTMLElement
      expect(within(panel).getByTestId('ErrorOutlineIcon')).toBeInTheDocument()
      const region = screen.getByRole('region', {
        name: enPages.dashboard.sections[section].title,
      })
      expect(within(region).queryByRole('table')).not.toBeInTheDocument()
      expect(within(region).queryByRole('columnheader')).not.toBeInTheDocument()
      expect(within(region).queryByRole('row')).not.toBeInTheDocument()
    }
  })

  it('should hide row actions for roles without access to e-service routes', async () => {
    mockUseJwt({ currentRoles: ['reviewer'] })
    vi.mocked(ProducerServices.getDashboardSaturation).mockResolvedValue(
      saturationResponse([saturationRow(1)])
    )
    vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
      results: [
        {
          eservice: { id: 'es-b', name: 'Whole service' },
          consumersCount: 1,
          archivableOn: '2026-12-01T09:00:00Z',
        },
      ],
    })

    await renderDashboard()
    await screen.findByText('E-service 1')
    await screen.findByText('Whole service')

    const saturation = await getSectionTable('thresholds')
    const archive = await getSectionTable('archiving')
    expect(within(saturation).queryByRole('button')).not.toBeInTheDocument()
    expect(within(archive).queryByRole('button')).not.toBeInTheDocument()
  })

  it('should keep unsorted backend saturation order and show fractional/over-100 percentages unclamped', async () => {
    vi.mocked(ProducerServices.getDashboardSaturation).mockResolvedValue(
      saturationResponse([
        saturationRow(1, { percentage: 40.25 }),
        saturationRow(2, { percentage: 133.3 }),
        saturationRow(3, { percentage: 0 }),
        saturationRow(4, { percentage: 99.95 }),
        saturationRow(5, { percentage: 100 }),
      ])
    )

    await renderDashboard()
    await screen.findByText('E-service 5')
    const rows = getBodyRows(await getSectionTable('thresholds'))

    expect(rows.map((row) => within(row).getAllByRole('cell')[0].textContent)).toEqual([
      'E-service 1Versione 1',
      'E-service 2Versione 2',
      'E-service 3Versione 3',
      'E-service 4Versione 4',
      'E-service 5Versione 5',
    ])
    expect(rows.map((row) => within(row).getAllByRole('cell')[2].textContent)).toEqual([
      '40,25%',
      '133,3%',
      '0%',
      '99,95%',
      '100%',
    ])
  })

  it('should navigate a descriptor-only archiving row by descriptorId without inventing a version', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
      results: [
        {
          eservice: { id: 'es-d', name: 'Descriptor only' },
          descriptorId: 'desc-d',
          consumersCount: 4,
          archivableOn: '2026-11-20T09:00:00Z',
        },
      ],
    })

    await renderDashboard()
    await screen.findByText('Descriptor only')
    const [row] = getBodyRows(await getSectionTable('archiving'))

    expect(within(row).getAllByRole('cell')[0].textContent).toBe('Descriptor only')
    expect(within(row).getAllByRole('cell')[1]).toHaveTextContent(/^$/)
    expect(row).not.toHaveTextContent(archiving.wholeEService)
    expect(row).not.toHaveTextContent('undefined')
    expect(within(row).queryByRole('button', { name: /lista e-service/ })).not.toBeInTheDocument()
    const button = within(row).getByRole('button', {
      name: 'Vedi la versione di Descriptor only',
    })
    expect(button).toHaveTextContent(/^$/)
    expect(within(button).getByTestId('ChevronRightIcon')).toBeInTheDocument()
    expect(button.children).toHaveLength(1)
    await user.click(button)
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: 'es-d', descriptorId: 'desc-d' },
    })
  })

  it('should show the version of a version-only archiving row and fall back honestly to the list', async () => {
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
      results: [
        {
          eservice: { id: 'es-v', name: 'Version only' },
          version: '7',
          consumersCount: 2,
          archivableOn: '2026-11-21T09:00:00Z',
        },
      ],
    })

    await renderDashboard()
    await screen.findByText('Version only')
    const [row] = getBodyRows(await getSectionTable('archiving'))

    expect(within(row).getAllByRole('cell')[0].textContent).toBe('Version only')
    expect(within(row).getAllByRole('cell')[1]).toHaveTextContent('Versione 7')
    expect(row).not.toHaveTextContent(archiving.wholeEService)
    expect(within(row).queryByRole('button', { name: /Vedi la versione/ })).not.toBeInTheDocument()
    await user.click(
      within(row).getByRole('button', {
        name: 'Vai alla lista e-service per trovare Version only',
      })
    )
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_LIST')
    expect(navigateMock).not.toHaveBeenCalledWith('PROVIDE_ESERVICE_MANAGE', expect.anything())
  })

  it('should render descriptor-only/version-only labels in English', async () => {
    vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
      results: [
        {
          eservice: { id: 'es-d', name: 'Descriptor only' },
          descriptorId: 'desc-d',
          consumersCount: 1,
          archivableOn: '2026-11-20T09:00:00Z',
        },
        {
          eservice: { id: 'es-v', name: 'Version only' },
          version: '7',
          consumersCount: 1,
          archivableOn: '2026-11-21T09:00:00Z',
        },
      ],
    })

    await renderDashboard('en')
    expect(
      await screen.findByRole('button', { name: 'View the version of Descriptor only' })
    ).toBeInTheDocument()
    expect(screen.getByText('Version 7')).toBeInTheDocument()
  })

  it('should let security navigate from both tables to versions and the e-service list', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    const user = userEvent.setup()
    vi.mocked(ProducerServices.getDashboardSaturation).mockResolvedValue(
      saturationResponse([saturationRow(1)])
    )
    vi.mocked(ProducerServices.getDashboardArchiving).mockResolvedValue({
      results: [
        {
          eservice: { id: 'es-d', name: 'Descriptor only' },
          descriptorId: 'desc-d',
          consumersCount: 1,
          archivableOn: '2026-11-20T09:00:00Z',
        },
        {
          eservice: { id: 'es-b', name: 'Whole service' },
          consumersCount: 1,
          archivableOn: '2026-12-01T09:00:00Z',
        },
      ],
    })

    await renderDashboard()
    await user.click(
      await screen.findByRole('button', { name: 'Vedi la versione 1 di E-service 1' })
    )
    expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: 'eservice-1', descriptorId: 'descriptor-1' },
    })
    await user.click(
      await screen.findByRole('button', { name: 'Vedi la versione di Descriptor only' })
    )
    expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: 'es-d', descriptorId: 'desc-d' },
    })
    await user.click(
      screen.getByRole('button', { name: 'Vai alla lista e-service per trovare Whole service' })
    )
    expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_LIST')
  })
})
