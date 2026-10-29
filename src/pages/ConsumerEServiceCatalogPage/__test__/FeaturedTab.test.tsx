import React from 'react'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EServiceQueries } from '@/api/eservice'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { queryClient } from '@/config/query-client'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import FeaturedTab from '../FeaturedTab'

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getFeaturedEServicesCatalog: vi.fn(),
  },
}))

vi.mock('../components', () => ({
  EServiceCatalogGrid: ({ eservices }: { eservices?: CatalogEService[] }) => (
    <ul aria-label="Featured e-services">
      {eservices?.map((eservice) => (
        <li key={eservice.id}>{eservice.name}</li>
      ))}
    </ul>
  ),
  EServiceCatalogGridSkeleton: () => <div role="status">Loading e-services</div>,
}))

const queryKey = ['EServiceGetFeaturedEServicesCatalog']
const queryFn = vi.fn<() => Promise<CatalogEService[]>>()

const renderTab = (onGoToCatalog = vi.fn(), searchParams = '') =>
  renderWithApplicationContext(<FeaturedTab onGoToCatalog={onGoToCatalog} />, {
    withRouterContext: true,
    withReactQueryContext: true,
    nuqsTestingAdapterProps: { searchParams, hasMemory: true },
  })

const createEServices = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    createMockEServiceCatalog({ id: `eservice-${index + 1}`, name: `E-service ${index + 1}` })
  )

const getVisibleNames = () =>
  within(screen.getByRole('list', { name: 'Featured e-services' }))
    .getAllByRole('listitem')
    .map((item) => item.textContent)

describe('FeaturedTab', () => {
  beforeEach(() => {
    queryClient.clear()
    queryFn.mockReset()
    vi.mocked(EServiceQueries.getFeaturedEServicesCatalog).mockReturnValue({
      queryKey,
      queryFn,
      retry: false,
      throwOnError: false,
      staleTime: Infinity,
    } as never)
  })

  afterEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('renders the skeleton while the e-services are loading', () => {
    queryFn.mockReturnValue(new Promise(() => {}))

    renderTab()

    expect(screen.getByRole('status')).toHaveTextContent('Loading e-services')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'emptyStateBanner.eservices.goToCatalogButtonLabel' })
    ).not.toBeInTheDocument()
  })

  it('renders the no-results banner and navigates to the catalog when clicked', async () => {
    const user = userEvent.setup()
    const onGoToCatalog = vi.fn()
    queryFn.mockResolvedValue([])

    renderTab(onGoToCatalog)

    expect(
      await screen.findByText('emptyStateBanner.eservices.noResults.title')
    ).toBeInTheDocument()
    expect(screen.getByText('emptyStateBanner.eservices.noResults.description')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'emptyStateBanner.eservices.goToCatalogButtonLabel' })
    )

    expect(onGoToCatalog).toHaveBeenCalledTimes(1)
  })

  it('renders the combined banner when the request fails without cached data', async () => {
    queryFn.mockRejectedValue(new Error('network error'))

    renderTab()

    expect(
      await screen.findByText('emptyStateBanner.eservicesAndUseCases.title')
    ).toBeInTheDocument()
    expect(
      screen.getByText('emptyStateBanner.eservicesAndUseCases.description')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'emptyStateBanner.eservices.goToCatalogButtonLabel' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it.each([4, 6, 10, 12])('renders the first page of %i e-services', async (count) => {
    const eservices = createEServices(count)
    queryFn.mockResolvedValue(eservices)

    renderTab()

    await screen.findByRole('list', { name: 'Featured e-services' })

    expect(getVisibleNames()).toEqual(eservices.slice(0, 6).map((eservice) => eservice.name))
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.queryByText(/emptyStateBanner\./)).not.toBeInTheDocument()
    if (count > 6) {
      expect(screen.getByRole('button', { name: /2/ })).toBeInTheDocument()
    } else {
      expect(screen.queryByRole('button', { name: /2/ })).not.toBeInTheDocument()
    }
    expect(screen.queryByRole('button', { name: /3/ })).not.toBeInTheDocument()
  })

  it.each([10, 12])('changes pages locally for %i e-services', async (count) => {
    const user = userEvent.setup()
    const eservices = createEServices(count)
    queryFn.mockResolvedValue(eservices)

    renderTab()

    await screen.findByRole('list', { name: 'Featured e-services' })
    await user.click(screen.getByRole('button', { name: /2/ }))

    await waitFor(() => {
      expect(getVisibleNames()).toEqual(eservices.slice(6, 12).map((eservice) => eservice.name))
    })

    await user.click(screen.getByRole('button', { name: /1/ }))

    await waitFor(() => {
      expect(getVisibleNames()).toEqual(eservices.slice(0, 6).map((eservice) => eservice.name))
    })
    expect(queryFn).toHaveBeenCalledTimes(1)
  })

  it('reads the initial page from the URL offset', async () => {
    const eservices = createEServices(10)
    queryFn.mockResolvedValue(eservices)

    renderTab(vi.fn(), '?offset=6')

    await screen.findByRole('list', { name: 'Featured e-services' })

    expect(getVisibleNames()).toEqual(eservices.slice(6).map((eservice) => eservice.name))
  })
})
