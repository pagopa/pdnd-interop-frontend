import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {
  GetProducerDashboardSaturationParams,
  ProducerDashboardSaturation,
  ProducerDashboardSaturationItem,
  SaturationSortBy,
} from '@/api/api.generatedTypes'
import { ProducerServices } from '@/api/producer'
import ProviderSaturationRatePage from '../ProviderSaturationRate.page'
import itDashboard from '@/static/locales/it/dashboard.json'
import itCommon from '@/static/locales/it/common.json'
import itFilters from '@/static/locales/it/filters.json'
import itSharedComponents from '@/static/locales/it/shared-components.json'

vi.unmock('react-i18next')
vi.mock('@/components/layout/Breadcrumbs', () => ({ Breadcrumbs: () => null }))
vi.mock('@/router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('@/api/producer/producer.services', () => ({
  ProducerServices: { getDashboardSaturation: vi.fn() },
}))

const getSaturation = vi.mocked(ProducerServices.getDashboardSaturation)
const copy = itDashboard.providerSaturationRatePage
const sortLabels: Record<SaturationSortBy, string> = {
  PERCENTAGE_ASC: copy.sorting.percentageAtAsc,
  PERCENTAGE_DESC: copy.sorting.percentageAtDesc,
  NAME_ASC: copy.sorting.nameAsc,
  NAME_DESC: copy.sorting.nameDesc,
}

/** 30 versions: name index and percentage are deliberately not correlated. */
const items: ProducerDashboardSaturationItem[] = Array.from({ length: 30 }, (_, index) => ({
  eservice: { id: `eservice-${index}`, name: `E-service ${String(index).padStart(2, '0')}` },
  descriptorId: `descriptor-${index}`,
  version: String(index + 1),
  activePurposesCount: index,
  approvedDailyCalls: index * 100,
  dailyCallsTotal: 10_000,
  percentage: (index * 7) % 30,
  waitingForApprovalDailyCalls: index,
}))
const summary = { overThreshold: 7, nearThreshold: 4, total: 30 }

/** Simulates backend filtering, ordering and paging so the page must render what it receives. */
const response = ({
  offset,
  limit,
  q,
  sortBy,
}: GetProducerDashboardSaturationParams): ProducerDashboardSaturation => {
  const filtered = items.filter(({ eservice }) =>
    eservice.name.toLowerCase().includes(q?.toLowerCase() ?? '')
  )
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'PERCENTAGE_DESC':
        return b.percentage - a.percentage || a.eservice.name.localeCompare(b.eservice.name)
      case 'NAME_ASC':
        return a.eservice.name.localeCompare(b.eservice.name)
      case 'NAME_DESC':
        return b.eservice.name.localeCompare(a.eservice.name)
      default:
        return a.percentage - b.percentage || a.eservice.name.localeCompare(b.eservice.name)
    }
  })
  return {
    summary,
    results: filtered.slice(offset, offset + limit),
    pagination: { offset, limit, totalCount: filtered.length },
  }
}
const firstName = (params: GetProducerDashboardSaturationParams) =>
  response(params).results[0].eservice.name

const dataRows = () => screen.getAllByRole('row').slice(1)
const renderedNames = () =>
  dataRows().map((row) => within(row).getByText(/^E-service \d{2}$/).textContent)
const namesAt = (indices: number[]) =>
  indices.map((index) => `E-service ${String(index).padStart(2, '0')}`)
const deferredResponse = () => {
  let resolve!: (value: ProducerDashboardSaturation) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<ProducerDashboardSaturation>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}
/** InformationContainer row (label + value) for the given summary label. */
const summaryValue = (label: string) => screen.getByText(label).parentElement!.parentElement!

const renderPage = async (search = '') => {
  const i18n = createInstance()
  await i18n.init({
    lng: 'it',
    fallbackLng: false,
    resources: {
      it: {
        dashboard: itDashboard,
        common: itCommon,
        filters: itFilters,
        'shared-components': itSharedComponents,
      },
    },
  })
  // Mirrors the production default (queries throw to the error boundary) to prove the page
  // handles its own errors inline instead of failing silently or crashing the route.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, throwOnError: true } },
  })
  const onUrlUpdate = vi.fn()
  const view = render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[`/saturation${search}`]}>
            <NuqsTestingAdapter searchParams={search} onUrlUpdate={onUrlUpdate} hasMemory>
              <ProviderSaturationRatePage />
            </NuqsTestingAdapter>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
  return {
    ...view,
    client,
    lastSearch: () => onUrlUpdate.mock.lastCall?.[0].searchParams as URLSearchParams,
  }
}

describe('ProviderSaturationRatePage', () => {
  beforeEach(() => {
    getSaturation.mockReset()
    getSaturation.mockImplementation(async (params) => response(params))
  })

  it('renders the actual dashboard intro, outlined search and named table without false results', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1, name: copy.title })).toHaveClass(
      'MuiTypography-h6'
    )
    expect(screen.getByText(copy.description)).toBeVisible()
    expect(screen.getByRole('button', { name: itCommon.actions.export })).toHaveClass(
      'MuiButton-outlined'
    )
    expect(screen.getByRole('button', { name: itFilters.button })).toHaveClass('MuiButton-outlined')
    expect(
      await screen.findByRole('table', { name: copy.table.headlabels.eserviceAndVersion })
    ).toBeVisible()
    expect(screen.getByRole('button', { name: copy.sorting.percentageAtAsc })).toBeVisible()
    expect(screen.queryByText(/0 risultati/)).not.toBeInTheDocument()
  })

  it('queries the default params and renders backend rows, order, summary and page count', async () => {
    await renderPage()
    await screen.findByText(firstName({ offset: 0, limit: 10, sortBy: 'PERCENTAGE_ASC' }))
    expect(getSaturation).toHaveBeenCalledExactlyOnceWith({
      offset: 0,
      limit: 10,
      q: undefined,
      sortBy: 'PERCENTAGE_ASC',
    })
    const expected = response({ offset: 0, limit: 10, sortBy: 'PERCENTAGE_ASC' }).results
    expect(dataRows()).toHaveLength(10)
    dataRows().forEach((row, index) => {
      expect(row).toHaveTextContent(expected[index].eservice.name)
    })
    expect(summaryValue(copy.eserviceOverThreshold)).toHaveTextContent('7')
    expect(summaryValue(copy.eserviceNearThreshold)).toHaveTextContent('4')
    expect(summaryValue(copy.totalEservices)).toHaveTextContent('30')
    // Former hardcoded fixture totals must be gone.
    expect(screen.queryByText('19')).not.toBeInTheDocument()
    expect(screen.queryByText('29')).not.toBeInTheDocument()
    // 30 results / 10 per page => 3 pages.
    expect(screen.getByRole('button', { name: /page 3/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /page 4/i })).not.toBeInTheDocument()
  })

  it('submits the search from page 1, renders filtered rows and resets while keeping sorting', async () => {
    const user = userEvent.setup()
    const { lastSearch } = await renderPage('?offset=10&sortBy=NAME_DESC')
    await screen.findByText('E-service 19')
    const input = screen.getByRole('textbox', { name: copy.filters.label })
    await user.type(input, 'E-service 0')
    expect(getSaturation).toHaveBeenLastCalledWith(
      expect.objectContaining({ offset: 10, q: undefined })
    )
    await user.click(screen.getByRole('button', { name: itFilters.button }))
    await waitFor(() =>
      expect(getSaturation).toHaveBeenLastCalledWith({
        offset: 0,
        limit: 10,
        q: 'E-service 0',
        sortBy: 'NAME_DESC',
      })
    )
    await screen.findByText('E-service 09')
    expect(dataRows()).toHaveLength(10)
    expect(dataRows()[0]).toHaveTextContent('E-service 09')
    expect(dataRows()[9]).toHaveTextContent('E-service 00')
    expect(renderedNames()).toEqual(namesAt([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
    expect(screen.queryByText('E-service 19')).not.toBeInTheDocument()
    // Summary comes from the backend response, not from the visible rows.
    expect(summaryValue(copy.totalEservices)).toHaveTextContent('30')
    expect(screen.queryByRole('button', { name: /page 2/i })).not.toBeInTheDocument()
    expect(lastSearch().get('q')).toBe('E-service 0')

    await user.click(screen.getByRole('button', { name: itFilters.remove }))
    await waitFor(() =>
      expect(getSaturation).toHaveBeenLastCalledWith({
        offset: 0,
        limit: 10,
        q: undefined,
        sortBy: 'NAME_DESC',
      })
    )
    await screen.findByText('E-service 29')
    expect(input).toHaveValue('')
    expect(lastSearch().get('q')).toBeNull()
    expect(lastSearch().get('sortBy')).toBe('NAME_DESC')
    expect(screen.getByRole('button', { name: /page 3/i })).toBeInTheDocument()
  })

  it.each([
    {
      sortBy: 'PERCENTAGE_ASC',
      initial: 'NAME_ASC',
      indices: [0, 13, 26, 9, 22, 5, 18, 1, 14, 27],
    },
    {
      sortBy: 'PERCENTAGE_DESC',
      initial: 'PERCENTAGE_ASC',
      indices: [17, 4, 21, 8, 25, 12, 29, 16, 3, 20],
    },
    {
      sortBy: 'NAME_ASC',
      initial: 'PERCENTAGE_ASC',
      indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    {
      sortBy: 'NAME_DESC',
      initial: 'PERCENTAGE_ASC',
      indices: [29, 28, 27, 26, 25, 24, 23, 22, 21, 20],
    },
  ] as const)(
    'queries $sortBy, resets to page 1, preserves q and renders backend order',
    async ({ sortBy, initial, indices }) => {
      const user = userEvent.setup()
      const { lastSearch } = await renderPage(`?offset=10&q=E-service&sortBy=${initial}`)
      await screen.findByText(firstName({ offset: 10, limit: 10, q: 'E-service', sortBy: initial }))
      await user.click(screen.getByRole('button', { name: sortLabels[initial] }))
      await user.click(screen.getByRole('menuitem', { name: sortLabels[sortBy] }))
      const params = { offset: 0, limit: 10, q: 'E-service', sortBy }
      await waitFor(() => expect(getSaturation).toHaveBeenLastCalledWith(params))
      const expected = response(params).results
      await waitFor(() => expect(dataRows()[0]).toHaveTextContent(expected[0].eservice.name))
      dataRows().forEach((row, index) => {
        expect(row).toHaveTextContent(expected[index].eservice.name)
      })
      expect(renderedNames()).toEqual(namesAt([...indices]))
      // nuqs drops the default sort (PERCENTAGE_ASC) from the URL.
      expect(lastSearch().get('sortBy') ?? 'PERCENTAGE_ASC').toBe(sortBy)
      expect(lastSearch().get('q')).toBe('E-service')
      expect(lastSearch().get('offset') ?? '0').toBe('0')
      expect(screen.getByRole('button', { name: sortLabels[sortBy] })).toBeVisible()
    }
  )

  it('navigates pages and resets to page 1 when the page size changes', async () => {
    const user = userEvent.setup()
    await renderPage('?sortBy=NAME_ASC')
    await screen.findByText('E-service 00')
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await screen.findByText('E-service 10')
    expect(getSaturation).toHaveBeenLastCalledWith(
      expect.objectContaining({ offset: 10, limit: 10, sortBy: 'NAME_ASC' })
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: '24' }))
    await waitFor(() =>
      expect(getSaturation).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0, limit: 24, sortBy: 'NAME_ASC' })
      )
    )
    await screen.findByText('E-service 23')
    expect(dataRows()).toHaveLength(24)
    expect(dataRows()[0]).toHaveTextContent('E-service 00')
  })

  it('restores search, sorting and pagination from a direct URL', async () => {
    await renderPage('?q=E-service&sortBy=PERCENTAGE_DESC&offset=24&limit=24')
    const params = { offset: 24, limit: 24, q: 'E-service', sortBy: 'PERCENTAGE_DESC' } as const
    await screen.findByText(firstName(params))
    expect(getSaturation).toHaveBeenLastCalledWith(params)
    expect(screen.getByRole('textbox', { name: copy.filters.label })).toHaveValue('E-service')
    expect(screen.getByRole('button', { name: copy.sorting.percentageAtDesc })).toBeVisible()
    expect(dataRows()).toHaveLength(6)
    expect(screen.getByRole('button', { name: /page 2/i })).toHaveAttribute('aria-current', 'true')
  })

  it('shows an accessible loading state without summary values or pagination', async () => {
    getSaturation.mockImplementation(() => new Promise(() => undefined))
    const { container } = await renderPage()
    await waitFor(() => expect(getSaturation).toHaveBeenCalled())
    expect(screen.getByRole('status', { name: copy.loading })).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(3)
    expect(summaryValue(copy.totalEservices)).not.toHaveTextContent(/\d/)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByText(itSharedComponents.table.noResultsTitle)).not.toBeInTheDocument()
  })

  it('shows the empty state for a successful search without results', async () => {
    await renderPage('?q=missing')
    expect(await screen.findByText(itSharedComponents.table.noResultsTitle)).toBeVisible()
    expect(getSaturation).toHaveBeenLastCalledWith(expect.objectContaining({ q: 'missing' }))
    expect(summaryValue(copy.totalEservices)).toHaveTextContent('30')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('shows an inline retryable error instead of crashing or presenting zero values', async () => {
    const user = userEvent.setup()
    getSaturation.mockRejectedValueOnce(new Error('offline'))
    await renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.loadError)
    expect(summaryValue(copy.totalEservices)).toHaveTextContent(copy.unavailable)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText(itSharedComponents.table.noResultsTitle)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: copy.retry }))
    await screen.findByRole('table', { name: copy.table.headlabels.eserviceAndVersion })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(summaryValue(copy.totalEservices)).toHaveTextContent('30')
    expect(getSaturation).toHaveBeenCalledTimes(2)
  })

  it('keeps previous rows visible and busy while the next page loads, then surfaces errors', async () => {
    const user = userEvent.setup()
    await renderPage('?sortBy=NAME_ASC')
    await screen.findByText('E-service 00')
    let resolve: (value: ProducerDashboardSaturation) => void = () => undefined
    getSaturation.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await waitFor(() => expect(getSaturation).toHaveBeenCalledTimes(2))
    const table = screen.getByRole('table', { name: copy.table.headlabels.eserviceAndVersion })
    expect(table).toHaveAttribute('aria-busy', 'true')
    expect(within(table).getByText('E-service 00')).toBeVisible()
    resolve(response({ offset: 10, limit: 10, sortBy: 'NAME_ASC' }))
    await screen.findByText('E-service 10')
    expect(screen.queryByText('E-service 00')).not.toBeInTheDocument()

    getSaturation.mockRejectedValueOnce(new Error('offline'))
    await user.click(screen.getByRole('button', { name: /page 3/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.loadError)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renders the server response verbatim without applying a second client-side sort or filter', async () => {
    // Deliberately non-monotonic response: the frontend must trust backend ordering.
    getSaturation.mockResolvedValueOnce({
      summary: { overThreshold: 2, nearThreshold: 1, total: 99 },
      results: [items[12], items[3], items[24]],
      pagination: { offset: 0, limit: 10, totalCount: 3 },
    })
    await renderPage('?q=server-normalized&sortBy=NAME_ASC')
    await screen.findByText('E-service 12')
    expect(getSaturation).toHaveBeenCalledExactlyOnceWith({
      offset: 0,
      limit: 10,
      q: 'server-normalized',
      sortBy: 'NAME_ASC',
    })
    expect(renderedNames()).toEqual(namesAt([12, 3, 24]))
    expect(summaryValue(copy.totalEservices)).toHaveTextContent('99')
  })

  it.each(['success', 'failure'] as const)(
    'ignores a superseded search request finishing with %s after the latest sort has loaded',
    async (outcome) => {
      const user = userEvent.setup()
      const { lastSearch } = await renderPage('?sortBy=NAME_ASC')
      await screen.findByText('E-service 00')
      const previous = deferredResponse()
      getSaturation.mockReturnValueOnce(previous.promise)
      await user.type(screen.getByRole('textbox', { name: copy.filters.label }), 'E-service 0')
      await user.click(screen.getByRole('button', { name: itFilters.button }))
      await waitFor(() => expect(getSaturation).toHaveBeenCalledTimes(2))
      expect(getSaturation).toHaveBeenLastCalledWith({
        offset: 0,
        limit: 10,
        q: 'E-service 0',
        sortBy: 'NAME_ASC',
      })
      expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
      expect(renderedNames()).toEqual(namesAt([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))

      await user.click(screen.getByRole('button', { name: sortLabels.NAME_ASC }))
      await user.click(screen.getByRole('menuitem', { name: sortLabels.NAME_DESC }))
      const latestParams = { offset: 0, limit: 10, q: 'E-service 0', sortBy: 'NAME_DESC' } as const
      await waitFor(() => expect(getSaturation).toHaveBeenLastCalledWith(latestParams))
      await waitFor(() => expect(renderedNames()).toEqual(namesAt([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])))

      await act(async () => {
        if (outcome === 'failure') previous.reject(new Error('superseded request failed'))
        else {
          previous.resolve({
            ...response({ ...latestParams, sortBy: 'NAME_ASC' }),
            summary: { overThreshold: 0, nearThreshold: 0, total: 999 },
          })
        }
        await previous.promise.catch(() => undefined)
      })
      expect(renderedNames()).toEqual(namesAt([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
      expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'false')
      expect(summaryValue(copy.totalEservices)).toHaveTextContent('30')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(lastSearch().get('q')).toBe('E-service 0')
      expect(lastSearch().get('sortBy')).toBe('NAME_DESC')
    }
  )

  it('handles a same-query background error and retries only the current URL params without duplicate requests', async () => {
    const user = userEvent.setup()
    const { client } = await renderPage('?q=E-service&sortBy=NAME_DESC&offset=10')
    const params = { offset: 10, limit: 10, q: 'E-service', sortBy: 'NAME_DESC' } as const
    await screen.findByText('E-service 19')
    getSaturation.mockRejectedValueOnce(new Error('background refresh failed'))
    await act(async () => {
      await client.invalidateQueries({ queryKey: ['ProducerGetDashboardSaturation'] })
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.loadError)
    expect(summaryValue(copy.totalEservices)).toHaveTextContent(copy.unavailable)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText(itSharedComponents.table.noResultsTitle)).not.toBeInTheDocument()

    const retry = deferredResponse()
    getSaturation.mockReturnValueOnce(retry.promise)
    await user.click(screen.getByRole('button', { name: copy.retry }))
    expect(screen.getByRole('button', { name: copy.retry })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: copy.retry }))
    expect(getSaturation).toHaveBeenCalledTimes(3)
    expect(getSaturation).toHaveBeenLastCalledWith(params)
    await act(async () => retry.resolve(response(params)))
    await screen.findByText('E-service 19')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'false')
    expect(renderedNames()).toEqual(namesAt([19, 18, 17, 16, 15, 14, 13, 12, 11, 10]))
    expect(screen.getByRole('button', { name: /page 2/i })).toHaveAttribute('aria-current', 'true')
    expect(summaryValue(copy.totalEservices)).toHaveTextContent('30')
  })
})
