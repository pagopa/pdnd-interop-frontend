import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryOptions } from '@tanstack/react-query'
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
} from '@/api/api.generatedTypes'
import ConsumerPurposesListPage from '../ConsumerPurposesList.page'

const emptyList = { results: [], pagination: { offset: 0, limit: 50, totalCount: 0 } }

const eservices: CompactCatalogEServices = {
  results: [
    { id: 'eservice-1', name: 'First e-service', producer: { id: 'producer-1', name: 'Prod 1' } },
    { id: 'eservice-2', name: 'Second e-service', producer: { id: 'producer-2', name: 'Prod 2' } },
  ],
  pagination: { offset: 0, limit: 50, totalCount: 2 },
}

const producers: CompactOrganizations = {
  results: [
    { id: 'producer-1', name: 'First producer' },
    { id: 'producer-2', name: 'Second producer' },
  ],
  pagination: { offset: 0, limit: 50, totalCount: 2 },
}

const mockQueries = () => {
  vi.spyOn(EServiceQueries, 'getProducers').mockImplementation((params) =>
    queryOptions({ queryKey: ['producers', params], queryFn: () => Promise.resolve(producers) })
  )
  vi.spyOn(EServiceQueries, 'getCompactCatalogList').mockImplementation((params) =>
    queryOptions({
      queryKey: ['compact-catalog', params],
      queryFn: () => Promise.resolve(eservices),
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
          results: [createMockPurpose({ title: 'A purpose', currentVersion: { state: 'ACTIVE' } })],
          pagination: { offset: params.offset, limit: params.limit, totalCount: 25 },
        }),
    })
  )
}

type InitialFilters = { q?: string; states?: string[]; offset?: number }

const buildSearchParams = ({ q, states, offset }: InitialFilters = {}) => {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (states) params.set('states', states.join(','))
  if (offset) params.set('offset', String(offset))
  const search = params.toString()
  return search ? `?${search}` : ''
}

type User = ReturnType<typeof userEvent.setup>

const applyName = async (user: User, value: string) => {
  await user.type(
    await screen.findByRole('textbox', { name: /nameField\.label/ }),
    `${value}{Enter}`
  )
}

// mui-italia Autocomplete scrolls the highlighted option with a CSS.escape-d "#id" selector that jsdom cannot parse
const ignoreUnparsableScrollSelector = () => {
  const querySelector = Element.prototype.querySelector
  vi.spyOn(Element.prototype, 'querySelector').mockImplementation(function (
    this: Element,
    selector: string
  ) {
    return selector.startsWith('\\#') ? null : querySelector.call(this, selector)
  })
}

const selectOption = async (user: User, field: RegExp, option: RegExp) => {
  await user.click(await screen.findByRole('combobox', { name: field }))
  await user.click(await screen.findByRole('option', { name: option }))
}

const submitFilters = (user: User) => user.click(screen.getByRole('button', { name: 'button' }))

const resetFilters = async (user: User) => {
  await user.click(await screen.findByRole('button', { name: 'remove' }))
}

const renderPage = (initialFilters: InitialFilters = {}) =>
  renderWithApplicationContext(
    <NuqsTestingAdapter searchParams={buildSearchParams(initialFilters)} hasMemory>
      <ConsumerPurposesListPage />
    </NuqsTestingAdapter>,
    { withRouterContext: true, withReactQueryContext: true }
  )

describe('ConsumerPurposesListPage filters', () => {
  let listSpy: ReturnType<typeof mockQueries>
  const lastQuery = () => {
    const calls = listSpy.mock.calls
    return calls[calls.length - 1][0]
  }

  beforeEach(() => {
    queryClient.clear()
    mockUseJwt({ jwt: { organizationId: 'consumer-id' } })
    listSpy = mockQueries()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('queries only with the current organization and the default pagination when no filter is set', async () => {
    renderPage()

    await screen.findByText('A purpose')

    expect(lastQuery()).toEqual({ consumersIds: ['consumer-id'], limit: 10, offset: 0 })
  })

  it('reads the initial filters from the url', async () => {
    renderPage({ q: 'my-name', states: ['ACTIVE'] })

    await screen.findByText('A purpose')

    expect(lastQuery()).toMatchObject({ q: 'my-name', states: ['ACTIVE'] })
  })

  it('adds the name to the payload only after submitting it', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(await screen.findByRole('textbox', { name: /nameField\.label/ }), 'my-name')
    expect(lastQuery().q).toBeUndefined()

    await user.keyboard('{Enter}')

    await waitFor(() => expect(lastQuery().q).toBe('my-name'))
  })

  it('adds the selected e-service, producer and status to the payload once submitted', async () => {
    ignoreUnparsableScrollSelector()
    const user = userEvent.setup()
    renderPage()

    await selectOption(user, /eserviceField\.label/, /Second e-service/)
    await selectOption(user, /providerField\.label/, /First producer/)
    await selectOption(user, /statusField\.label/, /optionLabels\.SUSPENDED/)
    expect(lastQuery().eservicesIds).toBeUndefined()

    await submitFilters(user)

    await waitFor(() =>
      expect(lastQuery()).toMatchObject({
        eservicesIds: ['eservice-2'],
        producersIds: ['producer-1'],
        states: ['SUSPENDED'],
      })
    )
  })

  it('removes the filters from the payload when they are reset', async () => {
    const user = userEvent.setup()
    renderPage({ q: 'my-name', states: ['ACTIVE'] })
    await screen.findByText('A purpose')
    expect(lastQuery()).toMatchObject({ q: 'my-name', states: ['ACTIVE'] })

    await resetFilters(user)

    await waitFor(() => {
      expect(lastQuery().q).toBeUndefined()
      expect(lastQuery().states).toBeUndefined()
    })
    expect(lastQuery()).toMatchObject({ consumersIds: ['consumer-id'] })
  })

  it('returns to the first page when the filters are applied', async () => {
    const user = userEvent.setup()
    renderPage({ offset: 10 })
    await screen.findByText('A purpose')
    expect(lastQuery().offset).toBe(10)

    await applyName(user, 'my-name')

    await waitFor(() => expect(lastQuery()).toMatchObject({ q: 'my-name', offset: 0 }))
  })

  it('returns to the first page when the filters are reset', async () => {
    const user = userEvent.setup()
    renderPage({ q: 'my-name', offset: 10 })
    await screen.findByText('A purpose')
    expect(lastQuery()).toMatchObject({ q: 'my-name', offset: 10 })

    await resetFilters(user)

    await waitFor(() => {
      expect(lastQuery().q).toBeUndefined()
      expect(lastQuery().offset).toBe(0)
    })
  })
})
