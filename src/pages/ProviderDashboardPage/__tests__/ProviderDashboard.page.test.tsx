import { Suspense, type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { theme } from '@pagopa/interop-fe-commons'
import type * as LayoutContainers from '@/components/layout/containers'
import ProviderDashboardPage from '../ProviderDashboard.page'
import { CardDashboard } from '@/components/shared/CardDashboard/CardDashboard'
import type { CardDashboardProps } from '@/components/shared/CardDashboard/CardDashboard'
import { mockUseJwt } from '@/utils/testing.utils'
import * as router from '@/router'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'
import itDashboard from '@/static/locales/it/dashboard.json'
import enDashboard from '@/static/locales/en/dashboard.json'
import { ProducerServices } from '@/api/producer'
import type {
  MonitoringArchiving,
  MonitoringArchivingRow,
  ProducerDashboard,
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

const CurrentPath = () => <span data-testid="current-path">{useLocation().pathname}</span>

const renderDashboard = async (language: 'it' | 'en' = 'it', waitForData = true) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: {
      it: { pages: itPages, dashboard: itDashboard },
      en: { pages: enPages, dashboard: enDashboard },
    },
  })

  const result = render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={['/it']}>
            <CurrentPath />
            <ErrorBoundary fallback={<div role="alert">Dashboard error</div>}>
              <Suspense fallback={<div role="status">Loading dashboard</div>}>
                <ProviderDashboardPage />
              </Suspense>
            </ErrorBoundary>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )

  if (waitForData) {
    await screen.findByRole('heading', { level: 1 })
  }
  return { ...result, queryClient }
}

const getCards = () => cardMock.mock.calls.map(([props]) => props)

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
  // summary/pagination are intentionally non-matching values: the UI must ignore them.
  summary: { overThreshold: 777, nearThreshold: 888, total: 999 },
  results,
  pagination: { offset: 0, limit: 5, totalCount: 4242 },
})

const emptyArchiving: MonitoringArchiving = { results: [] }

const getSectionTable = async (section: 'thresholds' | 'archiving') => {
  const tables = await screen.findAllByRole('table')
  const index = section === 'thresholds' ? 0 : 1
  // While loading, the skeleton table is the one inside the status region.
  return tables[index]
}

const getBodyRows = (table: HTMLElement) => within(table).getAllByRole('row').slice(1)

describe('ProviderDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ currentRoles: ['admin'] })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
    vi.spyOn(ProducerServices, 'getDashboard').mockResolvedValue(dashboard)
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
      metric: { value: 14321, label: itPages.dashboard.units.consumers },
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
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(getCards()).toHaveLength(6)
  })

  it('should propagate query errors to the boundary instead of showing fallback metrics', async () => {
    vi.mocked(ProducerServices.getDashboard).mockRejectedValue(new Error('Dashboard unavailable'))

    await renderDashboard('it', false)

    expect(await screen.findByRole('alert')).toHaveTextContent('Dashboard error')
    expect(cardMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should preserve valid zero values for an empty dashboard', async () => {
    vi.mocked(ProducerServices.getDashboard).mockResolvedValue({
      eservices: { total: 0, published: 0, suspended: 0, archiving: 0, archivingSuspended: 0 },
      pendingAgreements: 0,
      waitingForApprovalPurposes: 0,
      activeAgreements: 0,
      alignment: { aligned: 0, agreementWithoutPurposes: 0, purposesWithoutAgreement: 0 },
      averageActivePurposesPerEService: 0,
    })

    await renderDashboard()

    const cards = getCards()
    expect(cards[0].content).toMatchObject({
      total: 0,
      statuses: [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }],
    })
    for (const index of [1, 2, 3, 5]) {
      expect(cards[index].content).toMatchObject({ metric: { value: 0 } })
    }
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
                'Totale fruitori dei miei e-service',
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
                'fruitori',
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
                'Total consumers of my e-services',
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
                'consumers',
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
        dictionary.headings.consumers,
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
      const saturationHeaders = (language === 'it' ? itDashboard : enDashboard)
        .providerSaturationRatePage.table.headlabels
      const saturationTable = await getSectionTable('thresholds')
      const archivingTable = await getSectionTable('archiving')
      expect(
        within(saturationTable)
          .getAllByRole('columnheader')
          .slice(0, 5)
          .map((header) => header.textContent)
      ).toEqual(Object.values(saturationHeaders))
      expect(
        within(archivingTable)
          .getAllByRole('columnheader')
          .slice(0, 4)
          .map((header) => header.textContent)
      ).toEqual(Object.values(dictionary.sections.archiving.columns).slice(0, 4))
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
          heading: itPages.dashboard.headings.consumers,
          text: itPages.dashboard.actions.consumers,
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
          itPages.dashboard.actions.consumers,
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
        heading: itPages.dashboard.headings.consumers,
        label: itPages.dashboard.actions.consumers,
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
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(getCards().every((card) => card.action === undefined)).toBe(true)
      expect(navigateMock).not.toHaveBeenCalled()
    }
  )
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
    vi.spyOn(ProducerServices, 'getDashboardSaturation').mockResolvedValue(saturationResponse([]))
    vi.spyOn(ProducerServices, 'getDashboardArchiving').mockResolvedValue(emptyArchiving)
  })

  it('shows the exact ordered Italian headers and navigable consumption button', async () => {
    const user = userEvent.setup()
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

  it('should request exactly the top five saturation rows by descending percentage without q', async () => {
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
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('should render saturation rows in backend order with localized values and no pagination', async () => {
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
    // Summary and pagination are ignored.
    expect(screen.queryByText('4242')).not.toBeInTheDocument()
    expect(screen.queryByText('999')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
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
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
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

    expect(await screen.findByText(enPages.dashboard.sections.thresholds.empty)).toBeInTheDocument()
    expect(await screen.findByText(enPages.dashboard.sections.archiving.empty)).toBeInTheDocument()
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

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
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
