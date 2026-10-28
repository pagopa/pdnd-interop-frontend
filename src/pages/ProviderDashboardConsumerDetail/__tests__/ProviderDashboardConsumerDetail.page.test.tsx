import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { Button, ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { MemoryRouter } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import type * as LayoutContainers from '@/components/layout/containers'
import type { ActionItemButton } from '@/types/common.types'
import ProviderDashboardConsumerDetail from '../ProviderDashboardConsumerDetail.page'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'
import itFilters from '@/static/locales/it/filters.json'
import enFilters from '@/static/locales/en/filters.json'

vi.unmock('react-i18next')

vi.mock('@/components/layout/containers', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof LayoutContainers

  return {
    ...actual,
    PageContainer: ({
      title,
      description,
      topSideActions,
      children,
    }: {
      title: string
      description: string
      topSideActions?: ActionItemButton[]
      children: ReactNode
    }) => (
      <main>
        <h1>{title}</h1>
        <p>{description}</p>
        {topSideActions?.map(({ action, label, disabled, color, variant }) => (
          <Button key={label} onClick={action} disabled={disabled} color={color} variant={variant}>
            {label}
          </Button>
        ))}
        {children}
      </main>
    ),
  }
})

const renderPage = async (language: 'it' | 'en' = 'it') => {
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: {
      it: { pages: itPages, filters: itFilters },
      en: { pages: enPages, filters: enFilters },
    },
  })

  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <NuqsAdapter>
            <ProviderDashboardConsumerDetail />
          </NuqsAdapter>
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  )
}

describe('ProviderDashboardConsumerDetail', () => {
  it.each([
    { language: 'it', copy: itPages.providerDashboardConsumerDetail },
    { language: 'en', copy: enPages.providerDashboardConsumerDetail },
  ] as const)(
    'renders the $language header, summary, count, and outlined primary export action',
    async ({ language, copy }) => {
      await renderPage(language)

      expect(screen.getByRole('heading', { level: 1, name: copy.title })).toBeInTheDocument()
      expect(screen.getByText(copy.description)).toBeInTheDocument()
      const summaryLabel = screen.getByText(copy.summary)
      const summaryTotal = screen.getByText('6')
      expect(summaryLabel.parentElement).toBe(summaryTotal.parentElement)
      expect(
        screen.queryByRole('heading', { level: 2, name: copy.summary })
      ).not.toBeInTheDocument()
      const exportButton = screen.getByRole('button', { name: copy.export })
      expect(exportButton).toBeEnabled()
      expect(exportButton).toHaveClass('MuiButton-outlinedPrimary')
    }
  )

  it('keeps result, sorting, and table content as skeleton placeholders', async () => {
    const { container } = await renderPage()
    const copy = itPages.providerDashboardConsumerDetail

    const resultsPlaceholder = screen.getByRole('img', { name: copy.placeholders.results })
    const tablePlaceholder = screen.getByRole('img', { name: copy.placeholders.table })

    expect(resultsPlaceholder.querySelectorAll('.MuiSkeleton-root')).toHaveLength(2)
    expect(tablePlaceholder.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(10)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText(/6 risultati/i)).not.toBeInTheDocument()
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(10)
  })

  it('renders the shared e-service filter and standard search button', async () => {
    await renderPage()

    const searchInput = screen.getByRole('textbox', {
      name: itPages.providerDashboardConsumerDetail.searchPlaceholder,
    })
    const searchButton = screen.getByRole('button', { name: itFilters.button })

    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    expect(searchInput).toHaveAttribute('name', 'q')
    expect(searchButton).toBeEnabled()
    expect(searchButton).toHaveAttribute('type', 'submit')
    expect(searchButton).toHaveClass('MuiButton-containedPrimary')
    expect(searchButton?.parentElement).toHaveClass('MuiGrid-grid-md-4')
  })

  it('keeps the summary single-column on small screens and two-column at md', async () => {
    await renderPage()

    const styles = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules))
      .map((rule) => rule.cssText)
      .join('\n')

    expect(styles).toMatch(/grid-template-columns:\s*1fr/)
    expect(styles).toMatch(
      /@media \(min-width:900px\)[\s\S]*grid-template-columns:\s*320px minmax\(0(?:px)?, 1fr\)/
    )
  })

  it('keeps result and table content as skeletons after submitting a search', async () => {
    const user = userEvent.setup()
    await renderPage()

    const copy = itPages.providerDashboardConsumerDetail
    const searchInput = screen.getByRole('textbox', { name: copy.searchPlaceholder })
    const searchButton = screen.getByRole('button', { name: itFilters.button })
    const resultsPlaceholder = screen.getByRole('img', { name: copy.placeholders.results })

    await user.type(searchInput, 'consumer')
    expect(searchButton).toBeEnabled()
    await user.click(searchButton)

    expect(resultsPlaceholder.querySelectorAll('.MuiSkeleton-root')).toHaveLength(2)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
