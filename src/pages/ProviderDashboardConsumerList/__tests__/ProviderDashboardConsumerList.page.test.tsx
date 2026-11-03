import type { ReactNode } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { Button, ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { MemoryRouter } from 'react-router-dom'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as LayoutContainers from '@/components/layout/containers'
import type { ActionItemButton } from '@/types/common.types'
import type {
  GetProducerDashboardConsumersParams,
  ProducerDashboardConsumers,
} from '@/api/api.generatedTypes'
import { ProducerServices } from '@/api/producer'
import * as router from '@/router'
import ProviderDashboardConsumerList from '../ProviderDashboardConsumerList.page'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'
import itFilters from '@/static/locales/it/filters.json'
import enFilters from '@/static/locales/en/filters.json'

vi.unmock('react-i18next')
vi.mock('@/api/producer/producer.services', () => ({
  ProducerServices: { getDashboardConsumers: vi.fn() },
}))

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

const navigateMock = vi.fn()
const getConsumers = vi.mocked(ProducerServices.getDashboardConsumers)
const copy = itPages.providerDashboardConsumerList
const resultCount = (count: number) =>
  screen.queryByText(
    (_, element) => element?.tagName === 'P' && element.textContent === `${count} risultati`
  )
const consumers = Array.from({ length: 30 }, (_, index) => ({
  consumer: { id: `consumer-${index}`, name: `Consumer ${String(index).padStart(2, '0')}` },
  eservicesCount: index + 1,
  activePurposesCount: index * 2,
}))

const response = ({
  offset,
  limit,
  q,
  sortBy,
}: GetProducerDashboardConsumersParams): ProducerDashboardConsumers => {
  const filtered = consumers.filter(({ consumer }) =>
    consumer.name.toLowerCase().includes(q?.toLowerCase() ?? '')
  )
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'NAME_DESC':
        return b.consumer.name.localeCompare(a.consumer.name)
      case 'ESERVICES_COUNT_DESC':
        return b.eservicesCount - a.eservicesCount
      case 'ESERVICES_COUNT_ASC':
        return a.eservicesCount - b.eservicesCount
      default:
        return a.consumer.name.localeCompare(b.consumer.name)
    }
  })
  return {
    totalConsumers: consumers.length,
    results: filtered.slice(offset, offset + limit),
    pagination: { offset, limit, totalCount: filtered.length },
  }
}

const renderPage = async (language: 'it' | 'en' = 'it', search = '') => {
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: {
      it: { pages: itPages, filters: itFilters },
      en: { pages: enPages, filters: enFilters },
    },
  })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[`/consumers${search}`]}>
            <NuqsTestingAdapter searchParams={search} hasMemory>
              <ProviderDashboardConsumerList />
            </NuqsTestingAdapter>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

describe('ProviderDashboardConsumerList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getConsumers.mockReset()
    getConsumers.mockImplementation(async (params) => response(params))
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
  })

  it.each([
    { language: 'it', labels: itPages.providerDashboardConsumerList },
    { language: 'en', labels: enPages.providerDashboardConsumerList },
  ] as const)(
    'renders the $language totals, columns, rows and export',
    async ({ language, labels }) => {
      await renderPage(language)
      await screen.findByText('Consumer 00')
      expect(getConsumers).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
        sortBy: 'NAME_ASC',
        q: undefined,
      })
      expect(screen.getByRole('heading', { level: 1, name: labels.title })).toBeInTheDocument()
      expect(screen.getByText(labels.description)).toBeInTheDocument()
      expect(
        within(screen.getByText(labels.summary).parentElement!).getByText('30')
      ).toBeInTheDocument()
      Object.values(labels.columns).forEach((label) => {
        expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
      })
      const row = screen.getByText('Consumer 02').closest('tr')!
      expect(within(row).getByText('3')).toBeInTheDocument()
      expect(within(row).getByText('4')).toBeInTheDocument()
      expect(screen.getAllByRole('row')).toHaveLength(11)
      expect(screen.getByRole('button', { name: labels.export })).toHaveClass(
        'MuiButton-outlinedPrimary'
      )
    }
  )

  it('navigates from a consumer row to the detail route with the actual consumerId', async () => {
    const user = userEvent.setup()
    await renderPage()
    await user.click(await screen.findByRole('button', { name: 'Vai al dettaglio di Consumer 02' }))
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_DASHBOARD_CONSUMER_DETAIL', {
      params: { consumerId: 'consumer-2' },
    })
  })

  it('submits q and resets offset, keeps the overall total and clears filters', async () => {
    const user = userEvent.setup()
    await renderPage('it', '?offset=10')
    await screen.findByText('Consumer 10')
    const input = screen.getByRole('textbox', { name: copy.searchPlaceholder })
    await user.type(input, 'Consumer 00')
    expect(getConsumers).toHaveBeenLastCalledWith(
      expect.objectContaining({ offset: 10, q: undefined })
    )
    await user.click(screen.getByRole('button', { name: itFilters.button }))
    await waitFor(() =>
      expect(getConsumers).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0, q: 'Consumer 00' })
      )
    )
    await screen.findByText('Consumer 00')
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(resultCount(1)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: itFilters.remove }))
    await waitFor(() =>
      expect(getConsumers).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0, q: undefined })
      )
    )
    await screen.findByText('Consumer 09')
  })

  it.each([
    { sortBy: 'NAME_ASC', initial: 'NAME_DESC', first: 'Consumer 00' },
    { sortBy: 'NAME_DESC', initial: 'NAME_ASC', first: 'Consumer 29' },
    { sortBy: 'ESERVICES_COUNT_DESC', initial: 'NAME_ASC', first: 'Consumer 29' },
    { sortBy: 'ESERVICES_COUNT_ASC', initial: 'NAME_ASC', first: 'Consumer 00' },
  ] as const)('queries $sortBy and resets the current page', async ({ sortBy, initial, first }) => {
    const user = userEvent.setup()
    await renderPage('it', `?offset=10&sortBy=${initial}`)
    await screen.findByRole('table')
    await user.click(screen.getByRole('button', { name: copy.sorting[initial] }))
    await user.click(screen.getByRole('menuitem', { name: copy.sorting[sortBy] }))
    await waitFor(() =>
      expect(getConsumers).toHaveBeenLastCalledWith(expect.objectContaining({ offset: 0, sortBy }))
    )
    await screen.findByText(first)
    expect(within(screen.getAllByRole('row')[1]).getByText(first)).toBeInTheDocument()
  })

  it.each([24, 36])('loads the correct page and resets offset for limit %s', async (limit) => {
    const user = userEvent.setup()
    await renderPage()
    await screen.findByText('Consumer 00')
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await screen.findByText('Consumer 10')
    expect(getConsumers).toHaveBeenLastCalledWith(
      expect.objectContaining({ offset: 10, limit: 10 })
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: String(limit) }))
    await waitFor(() =>
      expect(getConsumers).toHaveBeenLastCalledWith(expect.objectContaining({ offset: 0, limit }))
    )
    await screen.findByText(`Consumer ${Math.min(limit, 30) - 1}`)
    expect(screen.getAllByRole('row')).toHaveLength(Math.min(limit, 30) + 1)
  })

  it('restores query, sorting and pagination from a direct URL', async () => {
    await renderPage('it', '?q=Consumer&sortBy=ESERVICES_COUNT_DESC&offset=24&limit=24')
    await screen.findByText('Consumer 05')
    expect(getConsumers).toHaveBeenLastCalledWith({
      q: 'Consumer',
      sortBy: 'ESERVICES_COUNT_DESC',
      offset: 24,
      limit: 24,
    })
    expect(screen.getByRole('textbox')).toHaveValue('Consumer')
    expect(screen.getAllByRole('row')).toHaveLength(7)
    expect(resultCount(30)).toBeInTheDocument()
  })

  it('shows an empty state and filtered zero results without losing the overall total', async () => {
    await renderPage('it', '?q=missing')
    await screen.findByText(copy.empty)
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(resultCount(0)).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renders a genuine overall zero total after a successful empty response', async () => {
    getConsumers.mockResolvedValueOnce({
      totalConsumers: 0,
      results: [],
      pagination: { offset: 0, limit: 10, totalCount: 0 },
    })
    await renderPage()
    await screen.findByText(copy.empty)
    expect(within(screen.getByText(copy.summary).parentElement!).getByText('0')).toBeInTheDocument()
    expect(resultCount(0)).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('shows initial loading skeletons without a false zero result', async () => {
    getConsumers.mockImplementation(() => new Promise(() => undefined))
    const { container } = await renderPage()
    await waitFor(() => expect(getConsumers).toHaveBeenCalled())
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(5)
    expect(resultCount(0)).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('keeps previous rows visible while fetching another page', async () => {
    const user = userEvent.setup()
    await renderPage()
    await screen.findByText('Consumer 00')
    let resolve: (value: ProducerDashboardConsumers) => void = () => undefined
    getConsumers.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await waitFor(() => expect(getConsumers).toHaveBeenCalledTimes(2))
    expect(screen.getByText('Consumer 00')).toBeInTheDocument()
    resolve(response({ offset: 10, limit: 10 }))
    await screen.findByText('Consumer 10')
    expect(screen.queryByText('Consumer 00')).not.toBeInTheDocument()
  })

  it('shows a retryable error instead of a zero count', async () => {
    const user = userEvent.setup()
    getConsumers.mockRejectedValueOnce(new Error('offline'))
    await renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.loadError)
    expect(screen.getByText(copy.unavailable)).toBeInTheDocument()
    expect(resultCount(0)).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: copy.retry }))
    await screen.findByText('Consumer 00')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('surfaces an error on a subsequent request instead of presenting stale rows as success', async () => {
    const user = userEvent.setup()
    await renderPage()
    await screen.findByText('Consumer 00')
    getConsumers.mockRejectedValueOnce(new Error('offline'))
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.loadError)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(resultCount(0)).not.toBeInTheDocument()
  })
})
