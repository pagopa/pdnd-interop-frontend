import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { createTheme, ThemeProvider } from '@mui/material'
import ProviderDashboardPage from '../ProviderDashboard.page'
import { CardDashboard } from '@/components/shared/CardDashboard/CardDashboard'
import type { CardDashboardProps } from '@/components/shared/CardDashboard/CardDashboard'
import { mockUseJwt } from '@/utils/testing.utils'
import * as router from '@/router'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'

vi.unmock('react-i18next')

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({ title, children }: { title: string; children: ReactNode }) => (
    <main>
      <h1>{title}</h1>
      {children}
    </main>
  ),
}))

vi.mock('@/components/shared/CardDashboard/CardDashboard', () => ({
  CardDashboard: vi.fn(({ heading, action }: CardDashboardProps) => (
    <section aria-label={heading}>
      <h2>{heading}</h2>
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

  it('should render twelve demo cards covering all five content variants and edge values', async () => {
    await renderDashboard()
    const cards = getCards()

    expect(screen.getAllByRole('region')).toHaveLength(12)
    expect(cards.map((card) => card.content.kind)).toEqual([
      'status',
      'metric',
      'metric',
      'metric',
      'metrics',
      'metric',
      'consumption',
      'empty',
      'empty',
      'status',
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
    expect(cards[5].content).toMatchObject({ metric: { value: 3.5 } })
    expect(cards[6].content).toMatchObject({ used: 38500, limit: 50000 })
    expect(cards[7].content).toEqual({ kind: 'empty', message: itPages.dashboard.empty.eservices })
    expect(cards[8].content).toEqual({
      kind: 'empty',
      message: itPages.dashboard.empty.pendingRequests,
      icon: 'success',
    })
    expect(cards[9].content).toMatchObject({
      statuses: [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }],
    })
    expect(cards[10].content).toMatchObject({
      metrics: [{ value: 0 }, { value: 0 }, { value: 0 }],
    })
    expect(cards[11].content).toMatchObject({ metric: { value: 0.9 } })
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('should use full-width, half-width, and one-third-width grid items at xs, sm, and lg', async () => {
    const { container } = await renderDashboard()
    const grid = container.querySelector('.MuiGrid-container')

    expect(grid?.children).toHaveLength(12)
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
      await renderDashboard(language)

      expect(screen.getByRole('heading', { level: 1, name: dictionary.title })).toBeInTheDocument()
      expect(getCards().map((card) => card.heading)).toEqual([
        dictionary.headings.eservices,
        dictionary.headings.pendingRequests,
        dictionary.headings.purposes,
        dictionary.headings.consumers,
        dictionary.headings.requests,
        dictionary.headings.average,
        dictionary.headings.consumption,
        dictionary.headings.eservices,
        dictionary.headings.pendingRequests,
        dictionary.headings.eservices,
        dictionary.headings.requests,
        dictionary.headings.average,
      ])
      expect(getCards()[0].content).toMatchObject({
        totalLabel: dictionary.units.eservices,
        statuses: Object.values(dictionary.statuses).map((label) => ({ label })),
      })
      expect(getCards()[4].content).toMatchObject({
        metrics: Object.values(dictionary.requests).map((label) => ({ label })),
      })
      expect(getCards()[6]).toMatchObject({
        subtitle: dictionary.consumptionSubtitle,
        content: { unitLabel: dictionary.units.calls },
      })
      expect(getCards()[7].content).toMatchObject({ message: dictionary.empty.eservices })
      expect(getCards()[8].content).toMatchObject({ message: dictionary.empty.pendingRequests })
      for (const name of Object.values(dictionary.actions)) {
        expect(screen.getAllByRole('button', { name }).length).toBeGreaterThan(0)
      }
    }
  )

  it.each(['admin', 'api'] as const)(
    'should allow %s to create and follow every card action',
    async (role) => {
      mockUseJwt({ currentRoles: [role] })
      const user = userEvent.setup()
      await renderDashboard()

      expect(getCards()[7].action?.type).toBe('primary')
      expect(getCards().filter((card) => card.action?.type === 'link')).toHaveLength(11)
      for (const button of screen.getAllByRole('button', {
        name: itPages.dashboard.actions.eservices,
      })) {
        await user.click(button)
        expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_LIST')
      }
      for (const button of screen.getAllByRole('button', {
        name: itPages.dashboard.actions.agreements,
      })) {
        await user.click(button)
        expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_AGREEMENT_LIST')
      }
      for (const button of screen.getAllByRole('button', {
        name: itPages.dashboard.actions.purposes,
      })) {
        await user.click(button)
        expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_PURPOSE_LIST')
      }
      await user.click(screen.getByRole('button', { name: itPages.dashboard.actions.create }))
      expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_CREATE')
      expect(navigateMock).toHaveBeenCalledTimes(12)
    }
  )

  it.each(['support', 'viewer'] as const)(
    'should hide create but retain read actions for %s',
    async (role) => {
      mockUseJwt({ currentRoles: [role] })
      await renderDashboard()

      expect(screen.getAllByRole('region')).toHaveLength(12)
      expect(
        screen.queryByRole('button', { name: itPages.dashboard.actions.create })
      ).not.toBeInTheDocument()
      expect(getCards()[7].action).toBeUndefined()
      expect(getCards().filter((card) => card.action?.type === 'link')).toHaveLength(11)
      expect(new Set(screen.getAllByRole('button').map((button) => button.textContent))).toEqual(
        new Set([
          itPages.dashboard.actions.eservices,
          itPages.dashboard.actions.agreements,
          itPages.dashboard.actions.purposes,
        ])
      )
    }
  )

  it('should allow security to navigate only to e-services', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    const user = userEvent.setup()
    await renderDashboard()

    expect(screen.getAllByRole('region')).toHaveLength(12)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    expect(getCards().filter((card) => card.action === undefined)).toHaveLength(10)
    for (const button of buttons) {
      expect(button).toHaveAccessibleName(itPages.dashboard.actions.eservices)
      await user.click(button)
      expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_LIST')
    }
    expect(navigateMock).toHaveBeenCalledTimes(2)
  })

  it.each([{ roles: [] }, { roles: ['reviewer'] }] as const)(
    'should expose no actions for unauthorized roles $roles',
    async ({ roles }) => {
      mockUseJwt({ currentRoles: [...roles] })
      await renderDashboard()

      expect(screen.getAllByRole('region')).toHaveLength(12)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(getCards().every((card) => card.action === undefined)).toBe(true)
      expect(navigateMock).not.toHaveBeenCalled()
    }
  )
})
