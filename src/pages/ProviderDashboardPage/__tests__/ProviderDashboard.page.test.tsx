import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { createTheme, ThemeProvider } from '@mui/material'
import type * as LayoutContainers from '@/components/layout/containers'
import ProviderDashboardPage from '../ProviderDashboard.page'
import { CardDashboard } from '@/components/shared/CardDashboard/CardDashboard'
import type { CardDashboardProps } from '@/components/shared/CardDashboard/CardDashboard'
import { mockUseJwt } from '@/utils/testing.utils'
import * as router from '@/router'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'

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
const theme = createTheme()

const renderDashboard = async (language: 'it' | 'en' = 'it') => {
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: { it: { pages: itPages }, en: { pages: enPages } },
  })

  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <ProviderDashboardPage />
      </ThemeProvider>
    </I18nextProvider>
  )
}

const getCards = () => cardMock.mock.calls.map(([props]) => props)

describe('ProviderDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ currentRoles: ['admin'] })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
  })

  it('should render the six dashboard cards with the requested values', async () => {
    await renderDashboard()
    const cards = getCards()

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
      statuses: [{ count: 15 }, { count: 3 }, { count: 2 }, { count: 0 }],
    })
    expect(cards[1].content).toMatchObject({ metric: { value: 10 } })
    expect(cards[2].content).toMatchObject({ metric: { value: 24 } })
    expect(cards[3].content).toMatchObject({ metric: { value: 12200 } })
    expect(cards[4].content).toMatchObject({
      metrics: [{ value: 10000 }, { value: 2000 }, { value: 200 }],
    })
    expect(cards[4].content).toMatchObject({
      metrics: Object.values(itPages.dashboard.metrics).map((label) => ({ label })),
    })
    expect(cards[5].content).toMatchObject({
      metric: { value: 3.5, label: itPages.dashboard.units.purposesPerEservice },
    })
    expect(navigateMock).not.toHaveBeenCalled()
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
    expect(gridStyles).toMatch(/flex-basis: 100%/)
    expect(gridStyles).toMatch(/@media \(min-width:600px\)[\s\S]*flex-basis: 50%/)
    expect(gridStyles).toMatch(/@media \(min-width:1200px\)[\s\S]*flex-basis: 33\.333333%/)
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
      for (const [sectionIndex, section] of Object.values(dictionary.sections).entries()) {
        expect(screen.getByRole('heading', { level: 2, name: section.title })).toBeInTheDocument()
        expect(screen.getByText(section.description)).toBeInTheDocument()
        const placeholder = screen.getByRole('img', { name: section.placeholder })
        expect(placeholder).toBeInTheDocument()
        expect(placeholder.querySelectorAll('.MuiSkeleton-root')).toHaveLength(
          sectionIndex === 0 ? 25 : 20
        )
        expect(placeholder.querySelector('table')).not.toBeInTheDocument()
        expect(placeholder.closest('.MuiPaper-root')).toBeInTheDocument()
      }
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
        ])
      )
    }
  )

  it('should allow security to navigate only to e-services and consumer details', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    const user = userEvent.setup()
    await renderDashboard()

    expect(getCards()).toHaveLength(6)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
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
