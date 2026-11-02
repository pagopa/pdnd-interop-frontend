import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { EServiceQueries } from '@/api/eservice'
import ConsumerEServiceCatalogPage from '../ConsumerEServiceCatalog.page'
import { createMockEServiceCatalog } from '../../../../__mocks__/data/eservice.mocks'

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getProducers: vi.fn(),
    queryCatalogList: vi.fn(),
  },
}))

vi.mock('@/config/tracking', () => ({ trackEvent: vi.fn() }))

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/shared/banners/ProductUpdatesBanner', () => ({
  ProductUpdatesBanner: () => null,
}))

vi.mock('../components', () => ({
  EServiceCatalogGrid: () => null,
  EServiceCatalogGridSkeleton: () => null,
}))

const pagination = { offset: 0, limit: 9, totalCount: 0 }

const lastCatalogQuery = () => {
  const calls = vi.mocked(EServiceQueries.queryCatalogList).mock.calls
  return calls[calls.length - 1][0]
}

const renderPage = (searchParams = '') =>
  renderWithApplicationContext(
    <NuqsTestingAdapter searchParams={searchParams} hasMemory>
      <ConsumerEServiceCatalogPage />
    </NuqsTestingAdapter>,
    { withRouterContext: true, withReactQueryContext: true }
  )

describe('ConsumerEServiceCatalogPage filters and query payload', () => {
  beforeEach(() => {
    vi.mocked(EServiceQueries.getProducers).mockReturnValue({
      queryKey: ['producers'],
      queryFn: () => Promise.resolve({ results: [], pagination }),
    } as never)
    vi.mocked(EServiceQueries.queryCatalogList).mockImplementation(
      (query) =>
        ({
          queryKey: ['catalog', query],
          queryFn: () => Promise.resolve({ results: [], pagination }),
        }) as never
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('queries with default pagination and sorting when no filter is set', () => {
    renderPage()

    expect(lastCatalogQuery()).toEqual({ limit: 9, offset: 0, sortBy: 'CREATED_AT_DESC' })
  })

  it("does not render pagination when there aren't items", async () => {
    vi.mocked(EServiceQueries.queryCatalogList).mockImplementation(
      (query) =>
        ({
          queryKey: ['catalog', query],
          queryFn: () =>
            Promise.resolve({ results: [], pagination: { ...pagination, totalCount: 0 } }),
        }) as never
    )

    renderPage()

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByTestId('items-per-page-select')).not.toBeInTheDocument()
  })

  it('renders pagination when there are items', async () => {
    vi.mocked(EServiceQueries.queryCatalogList).mockImplementation(
      (query) =>
        ({
          queryKey: ['catalog', query],
          queryFn: () =>
            Promise.resolve({
              results: [createMockEServiceCatalog()],
              pagination: { ...pagination, totalCount: 1 },
            }),
        }) as never
    )

    renderPage()

    waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByTestId('items-per-page-select')).toBeInTheDocument()
    })
  })

  it('reads the initial filters from the url', () => {
    renderPage('?keyword=from-url&onlySignalHubEnabled=true&mode=RECEIVE')

    expect(lastCatalogQuery()).toMatchObject({
      keyword: 'from-url',
      onlySignalHubEnabled: true,
      mode: 'RECEIVE',
    })
  })

  it('adds the keyword to the payload after submitting the main filters', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByRole('textbox', { name: /keywordField\.label/ }), 'my-eservice')
    expect(lastCatalogQuery().keyword).toBeUndefined()

    await user.click(screen.getByRole('button', { name: 'button' }))

    await waitFor(() =>
      expect(lastCatalogQuery()).toMatchObject({
        keyword: 'my-eservice',
        limit: 9,
        offset: 0,
        sortBy: 'CREATED_AT_DESC',
      })
    )
  })

  it('adds boolean additional filters to the payload once applied', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'trigger' }))
    const drawer = await screen.findByRole('presentation')
    await user.click(
      within(drawer).getByRole('checkbox', { name: /onlyActiveEServicesField\.label/ })
    )
    await user.click(within(drawer).getByRole('button', { name: 'actions.apply' }))

    await waitFor(() => expect(lastCatalogQuery().onlyActiveEservices).toBe(true))
  })

  it('maps the asyncExchange select to a boolean in the payload', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'trigger' }))
    const drawer = await screen.findByRole('presentation')
    await user.click(within(drawer).getByRole('combobox', { name: /asyncExchangeField\.label/ }))
    await user.click(await screen.findByRole('option', { name: /options\.ASYNC/ }))
    await user.click(within(drawer).getByRole('button', { name: 'actions.apply' }))

    await waitFor(() => expect(lastCatalogQuery().asyncExchange).toBe(true))
  })

  it('removes the filters from the payload when they are reset', async () => {
    const user = userEvent.setup()
    renderPage('?keyword=abc&onlySignalHubEnabled=true')
    expect(lastCatalogQuery()).toMatchObject({ keyword: 'abc', onlySignalHubEnabled: true })

    await user.click(screen.getByRole('button', { name: 'remove' }))

    await waitFor(() => {
      const query = lastCatalogQuery()
      expect(query.keyword).toBeUndefined()
      expect(query.onlySignalHubEnabled).toBeUndefined()
    })
  })

  it('updates sortBy in the payload when sorting changes', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /sorting\.CREATED_AT_DESC/ }))
    await user.click(await screen.findByRole('menuitem', { name: /sorting\.NAME_ASC/ }))

    await waitFor(() => expect(lastCatalogQuery().sortBy).toBe('NAME_ASC'))
  })
})
