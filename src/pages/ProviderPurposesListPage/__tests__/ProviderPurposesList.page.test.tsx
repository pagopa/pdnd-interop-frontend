import React from 'react'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryOptions } from '@tanstack/react-query'
import { createMemoryHistory } from 'history'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { queryClient } from '@/config/query-client'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import type { ProducerEServices, CompactOrganizations, Purposes } from '@/api/api.generatedTypes'
import ProviderPurposesListPage from '../ProviderPurposesList.page'

const emptyList = { results: [], pagination: { offset: 0, limit: 50, totalCount: 0 } }

const mockQueries = (purposes: Partial<Purposes> = {}) => {
  vi.spyOn(EServiceQueries, 'getConsumers').mockImplementation((params) =>
    queryOptions({
      queryKey: ['consumers', params],
      queryFn: () => Promise.resolve<CompactOrganizations>(emptyList),
    })
  )
  vi.spyOn(EServiceQueries, 'getProviderList').mockImplementation((params) =>
    queryOptions({
      queryKey: ['provider-eservices', params],
      queryFn: () => Promise.resolve<ProducerEServices>(emptyList),
    })
  )
  return vi.spyOn(PurposeQueries, 'getProducersList').mockImplementation((params) =>
    queryOptions({
      queryKey: ['provider-purposes', params],
      queryFn: () =>
        Promise.resolve({
          results: [],
          pagination: { offset: 0, limit: 10, totalCount: 0 },
          ...purposes,
        }),
    })
  )
}

const renderPage = (searchParams = '') => {
  const history = createMemoryHistory()
  return renderWithApplicationContext(
    <NuqsTestingAdapter searchParams={searchParams} hasMemory>
      <ProviderPurposesListPage />
    </NuqsTestingAdapter>,
    { withRouterContext: true, withReactQueryContext: true },
    history
  )
}

describe('ProviderPurposesListPage table', () => {
  beforeEach(() => {
    queryClient.clear()
    mockUseJwt({ jwt: { organizationId: 'provider-id' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('queries the purposes of the current organization', async () => {
    const spy = mockQueries()
    renderPage()

    await vi.waitFor(() =>
      expect(spy).toHaveBeenLastCalledWith(
        expect.objectContaining({ producersIds: ['provider-id'], limit: 10, offset: 0 })
      )
    )
  })

  it('shows every column heading and the content of each purpose', async () => {
    mockQueries({
      results: [
        createMockPurpose({
          id: 'purpose-1',
          title: 'First purpose',
          consumer: { name: 'First consumer' },
          currentVersion: { state: 'ACTIVE' },
        }),
        createMockPurpose({
          id: 'purpose-2',
          title: 'Second purpose',
          consumer: { name: 'Second consumer' },
          currentVersion: { state: 'SUSPENDED' },
        }),
      ],
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })
    renderPage()

    await screen.findByText('First purpose')
    ;['purposeName', 'subscriberName', 'purposeStatus'].forEach((heading) => {
      expect(screen.getByRole('columnheader', { name: heading })).toBeInTheDocument()
    })

    const [, firstRow, secondRow] = screen.getAllByRole('row')

    expect(within(firstRow).getByText('First purpose')).toBeInTheDocument()
    expect(within(firstRow).getByText('First consumer')).toBeInTheDocument()
    expect(within(firstRow).getByText('status.purpose.ACTIVE')).toBeInTheDocument()
    expect(within(secondRow).getByText('Second purpose')).toBeInTheDocument()
    expect(within(secondRow).getByText('Second consumer')).toBeInTheDocument()
    expect(within(secondRow).getByText('status.purpose.SUSPENDED')).toBeInTheDocument()
  })

  it('opens the details of a purpose', async () => {
    mockQueries({
      results: [
        createMockPurpose({
          id: 'purpose-id',
          title: 'Opened',
          currentVersion: { state: 'ACTIVE' },
        }),
      ],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    const user = userEvent.setup()
    const { history } = renderPage()

    await screen.findByText('Opened')
    await user.click(screen.getByRole('link', { name: 'actions.inspect' }))

    expect(history.location.pathname).toBe('/it/erogazione/finalita/purpose-id')
  })

  it('shows the waiting for approval state in the status cell when a new version waits for approval', async () => {
    const user = userEvent.setup()

    mockQueries({
      results: [
        createMockPurpose({
          title: 'Waiting',
          currentVersion: { state: 'ACTIVE' },
          waitingForApprovalVersion: { state: 'WAITING_FOR_APPROVAL' },
        }),
        createMockPurpose({
          title: 'Regular',
          currentVersion: { state: 'ACTIVE' },
        }),
      ],
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })

    renderPage()

    await screen.findByText('Waiting')

    const [, waitingRow, regularRow] = screen.getAllByRole('row')
    expect(within(waitingRow).getByText('status.purpose.ACTIVE')).toBeInTheDocument()

    const errorIcon = within(waitingRow).getByTestId('ErrorIconNext')
    expect(errorIcon).toBeInTheDocument()

    expect(within(regularRow).queryByTestId('ErrorIconNext')).not.toBeInTheDocument()

    await user.hover(errorIcon)

    expect(await screen.findByRole('tooltip')).toHaveTextContent('newVersionAvailableTooltip')
  })

  it('shows the consumer sub-unit name with its root tenant below, and the root tenant name alone', async () => {
    mockQueries({
      results: [
        createMockPurpose({
          id: 'aoo',
          title: 'AOO purpose',
          consumer: {
            name: 'Direzione Mobilità',
            subUnitType: 'AOO',
            parentTenants: [{ id: 'comune-id', name: 'Comune di Milano' }],
          },
        }),
        createMockPurpose({
          id: 'uo',
          title: 'UO purpose',
          consumer: {
            name: 'Ufficio permessi ZTL',
            subUnitType: 'UO',
            parentTenants: [
              { id: 'aoo-id', name: 'Direzione Mobilità', subUnitType: 'AOO' },
              { id: 'comune-id', name: 'Comune di Milano' },
            ],
          },
        }),
        createMockPurpose({
          id: 'root',
          title: 'Root purpose',
          consumer: { name: 'Comune di Torino' },
        }),
      ],
      pagination: { offset: 0, limit: 10, totalCount: 3 },
    })
    renderPage()

    await screen.findByText('AOO purpose')
    const [, aooRow, uoRow, rootRow] = screen.getAllByRole('row')

    expect(within(aooRow).getByText('Direzione Mobilità')).toBeInTheDocument()
    expect(within(aooRow).getByText('Comune di Milano')).toBeInTheDocument()
    expect(within(uoRow).getByText('Ufficio permessi ZTL - Direzione Mobilità')).toBeInTheDocument()
    expect(within(uoRow).getByText('Comune di Milano')).toBeInTheDocument()
    expect(within(rootRow).getByText('Comune di Torino')).toBeInTheDocument()
    expect(within(rootRow).queryByText('Comune di Milano')).not.toBeInTheDocument()
  })

  it('names the table and does not render row actions besides the details link', async () => {
    mockQueries({
      results: [createMockPurpose({ title: 'Named', currentVersion: { state: 'ACTIVE' } })],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    renderPage()

    const row = (await screen.findByText('Named')).closest('tr') as HTMLElement

    expect(screen.getByRole('table', { name: 'providerTableLabel' })).toBeVisible()
    expect(within(row).queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows a loading table instead of the empty state while fetching', () => {
    mockQueries()
    renderPage()

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('noResultsLabel')).not.toBeInTheDocument()
  })

  it('shows the empty state when there are no purposes', async () => {
    mockQueries()
    renderPage()

    expect(await screen.findByText('noResultsLabel')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('keeps the pagination instead of the empty state when the current page is out of range', async () => {
    mockQueries({ results: [], pagination: { offset: 20, limit: 10, totalCount: 15 } })
    renderPage('?offset=20')

    expect(await screen.findByRole('navigation')).toBeInTheDocument()
    expect(screen.queryByText('noResultsLabel')).not.toBeInTheDocument()
  })

  it('shows the loading table while the next page loads', async () => {
    const spy = mockQueries({
      results: [createMockPurpose({ title: 'First page', currentVersion: { state: 'ACTIVE' } })],
      pagination: { offset: 0, limit: 10, totalCount: 25 },
    })
    const firstPageImplementation = spy.getMockImplementation()!
    let resolveSecondPage: () => void = () => {}
    spy.mockImplementation((params) =>
      params.offset === 0
        ? firstPageImplementation(params)
        : queryOptions({
            queryKey: ['provider-purposes', params],
            queryFn: () =>
              new Promise<Purposes>((resolve) => {
                resolveSecondPage = () =>
                  resolve({
                    results: [
                      createMockPurpose({
                        title: 'Second page',
                        currentVersion: { state: 'ACTIVE' },
                      }),
                    ],
                    pagination: { offset: 10, limit: 10, totalCount: 25 },
                  })
              }),
          })
    )
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('First page')
    await user.click(screen.getByRole('button', { name: /2/ }))

    await vi.waitFor(() => expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true'))
    expect(screen.queryByText('First page')).not.toBeInTheDocument()

    resolveSecondPage()

    expect(await screen.findByText('Second page')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeVisible()
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-busy', 'true')
  })

  it('renders pagination when there are more purposes than the page size', async () => {
    mockQueries({
      results: [createMockPurpose({ title: 'Paginated', currentVersion: { state: 'ACTIVE' } })],
      pagination: { offset: 0, limit: 10, totalCount: 25 },
    })
    renderPage()

    await screen.findByText('Paginated')

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
