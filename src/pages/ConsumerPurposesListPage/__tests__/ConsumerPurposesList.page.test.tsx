import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryOptions } from '@tanstack/react-query'
import { createMemoryHistory } from 'history'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { queryClient } from '@/config/query-client'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import { DelegationQueries } from '@/api/delegation'
import type {
  CompactCatalogEServices,
  CompactOrganizations,
  DelegationTenants,
  Purpose,
  PurposeVersionState,
  Purposes,
  ReviewerWorkflow,
  RiskAnalysisSigningState,
} from '@/api/api.generatedTypes'
import ConsumerPurposesListPage from '../ConsumerPurposesList.page'

const emptyList = { results: [], pagination: { offset: 0, limit: 50, totalCount: 0 } }

const mockQueries = (purposes: Partial<Purposes> = {}) => {
  vi.spyOn(EServiceQueries, 'getProducers').mockImplementation((params) =>
    queryOptions({
      queryKey: ['producers', params],
      queryFn: () => Promise.resolve<CompactOrganizations>(emptyList),
    })
  )
  vi.spyOn(EServiceQueries, 'getCompactCatalogList').mockImplementation((params) =>
    queryOptions({
      queryKey: ['compact-catalog', params],
      queryFn: () => Promise.resolve<CompactCatalogEServices>(emptyList),
    })
  )
  vi.spyOn(DelegationQueries, 'getConsumerDelegatorsWithAgreements').mockImplementation((params) =>
    queryOptions({
      queryKey: ['delegators', params],
      queryFn: () => Promise.resolve<DelegationTenants>(emptyList),
    })
  )
  return vi.spyOn(PurposeQueries, 'getConsumersList').mockImplementation((params) =>
    queryOptions({
      queryKey: ['consumer-purposes', params],
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
      <ConsumerPurposesListPage />
    </NuqsTestingAdapter>,
    { withRouterContext: true, withReactQueryContext: true },
    history
  )
}

const buildPurpose = (
  currentVersionState: PurposeVersionState,
  signingState?: RiskAnalysisSigningState
): Purpose => {
  const reviewerWorkflow: ReviewerWorkflow | undefined = signingState
    ? { reviewers: [], signingState }
    : undefined

  return createMockPurpose({
    currentVersion: { state: currentVersionState },
    riskAnalysisReviewMode: signingState ? 'REVIEWER_WRITES_REVIEWER_SIGNS' : undefined,
    reviewerWorkflow,
  })
}

describe('ConsumerPurposesListPage table', () => {
  beforeEach(() => {
    queryClient.clear()
    mockUseJwt({ jwt: { organizationId: 'consumer-id' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('queries the purposes of the current organization', async () => {
    const spy = mockQueries()
    renderPage()

    await waitFor(() =>
      expect(spy).toHaveBeenLastCalledWith(
        expect.objectContaining({ consumersIds: ['consumer-id'], limit: 10, offset: 0 })
      )
    )
  })

  it('shows every column heading and the content of each purpose', async () => {
    mockQueries({
      results: [
        createMockPurpose({
          id: 'purpose-1',
          title: 'Purpose title',
          eservice: { name: 'E-service name', producer: { name: 'Producer name' } },
          currentVersion: { state: 'ACTIVE' },
        }),
        createMockPurpose({
          id: 'purpose-2',
          title: 'Delegated purpose',
          eservice: { name: 'Other e-service', producer: { name: 'Other producer' } },
          currentVersion: { state: 'ACTIVE' },
          delegation: {
            id: 'delegation-id',
            delegator: { id: 'consumer-id', name: 'Consumer' },
            delegate: { id: 'delegate-id', name: 'Delegate' },
          },
        }),
      ],
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })
    renderPage()

    await screen.findByText('Purpose title')
    ;['purposeName', 'eserviceName', 'providerName', 'purposeStatus'].forEach((heading) => {
      expect(screen.getByRole('columnheader', { name: heading })).toBeInTheDocument()
    })

    const [, firstRow, secondRow] = screen.getAllByRole('row')

    expect(within(firstRow).getByText('Purpose title')).toBeInTheDocument()
    expect(within(firstRow).getByText('E-service name')).toBeInTheDocument()
    expect(within(firstRow).getByText('Producer name')).toBeInTheDocument()
    expect(within(firstRow).queryByText('label.delegator')).not.toBeInTheDocument()

    expect(within(secondRow).getByText('Delegated purpose')).toBeInTheDocument()
    expect(within(secondRow).getByText('Other e-service')).toBeInTheDocument()
    expect(within(secondRow).getByText('Other producer')).toBeInTheDocument()
    expect(within(secondRow).getByText('label.delegator')).toBeInTheDocument()
  })

  it('shows the risk analysis outcome next to the status of a draft purpose', async () => {
    mockQueries({
      results: [
        { ...buildPurpose('DRAFT', 'SIGNED'), id: 'signed', title: 'Signed' },
        { ...buildPurpose('DRAFT', 'REJECTED'), id: 'rejected', title: 'Rejected' },
        { ...buildPurpose('DRAFT', 'ASSIGNED'), id: 'assigned', title: 'Assigned' },
        { ...buildPurpose('ACTIVE', 'SIGNED'), id: 'active', title: 'Active' },
      ],
      pagination: { offset: 0, limit: 10, totalCount: 4 },
    })
    renderPage()

    await screen.findByText('Signed')
    const rowOf = (title: string) => screen.getByText(title).closest('tr') as HTMLElement

    expect(within(rowOf('Signed')).getByLabelText('list.riskAnalysisApproved')).toBeInTheDocument()
    expect(
      within(rowOf('Rejected')).getByLabelText('list.riskAnalysisRejected')
    ).toBeInTheDocument()
    expect(within(rowOf('Assigned')).queryByLabelText(/list\.riskAnalysis/)).not.toBeInTheDocument()
    expect(within(rowOf('Active')).queryByLabelText(/list\.riskAnalysis/)).not.toBeInTheDocument()
  })

  it('opens the details of a purpose, or the summary when it is an editable draft', async () => {
    mockQueries({
      results: [
        createMockPurpose({
          id: 'active-id',
          title: 'Active',
          currentVersion: { state: 'ACTIVE' },
        }),
        createMockPurpose({ id: 'draft-id', title: 'Draft', currentVersion: { state: 'DRAFT' } }),
      ],
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })
    const user = userEvent.setup()
    const { history } = renderPage()

    await screen.findByText('Active')
    const [activeRow, draftRow] = screen.getAllByRole('row').slice(1)

    await user.click(within(activeRow).getByRole('link', { name: 'actions.inspect' }))
    expect(history.location.pathname).toBe('/it/fruizione/finalita/active-id')

    await user.click(within(draftRow).getByRole('link', { name: 'actions.edit' }))
    expect(history.location.pathname).toBe('/it/fruizione/finalita/draft-id/riepilogo')
  })

  it('tells that the purpose has a version waiting for approval in the link name', async () => {
    mockQueries({
      results: [
        createMockPurpose({
          title: 'Waiting',
          currentVersion: { state: 'ACTIVE' },
          waitingForApprovalVersion: { state: 'WAITING_FOR_APPROVAL' },
        }),
      ],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    renderPage()

    expect(
      await screen.findByRole('link', {
        name: 'actions.inspect. list.waitingForApprovalVersionTooltip',
      })
    ).toBeInTheDocument()
  })

  it('shows the producer sub-unit name with its root tenant below, and the root tenant name alone', async () => {
    mockQueries({
      results: [
        createMockPurpose({
          id: 'aoo',
          title: 'AOO purpose',
          eservice: {
            producer: {
              name: 'Direzione Mobilità',
              subUnitType: 'AOO',
              parentTenants: [{ id: 'comune-id', name: 'Comune di Milano' }],
            },
          },
        }),
        createMockPurpose({
          id: 'uo',
          title: 'UO purpose',
          eservice: {
            producer: {
              name: 'Ufficio permessi ZTL',
              subUnitType: 'UO',
              parentTenants: [
                { id: 'aoo-id', name: 'Direzione Mobilità', subUnitType: 'AOO' },
                { id: 'comune-id', name: 'Comune di Milano' },
              ],
            },
          },
        }),
        createMockPurpose({
          id: 'root',
          title: 'Root purpose',
          eservice: { producer: { name: 'Comune di Torino' } },
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

    expect(screen.getByRole('table', { name: 'list.tableLabel' })).toBeVisible()
    expect(within(row).queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows a loading table instead of the empty state while fetching', () => {
    mockQueries()
    renderPage()

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('list.noResultsLabel')).not.toBeInTheDocument()
  })

  it('shows the empty state when there are no purposes', async () => {
    mockQueries()
    renderPage()

    expect(await screen.findByText('list.noResultsLabel')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('keeps the pagination instead of the empty state when the current page is out of range', async () => {
    mockQueries({ results: [], pagination: { offset: 20, limit: 10, totalCount: 15 } })
    renderPage('?offset=20')

    expect(await screen.findByRole('navigation')).toBeInTheDocument()
    expect(screen.queryByText('list.noResultsLabel')).not.toBeInTheDocument()
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
            queryKey: ['consumer-purposes', params],
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

    await waitFor(() => expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true'))
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
