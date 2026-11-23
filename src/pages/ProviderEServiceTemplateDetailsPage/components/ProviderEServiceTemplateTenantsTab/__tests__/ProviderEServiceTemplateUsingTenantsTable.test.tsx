import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryOptions } from '@tanstack/react-query'
import { createMemoryHistory } from 'history'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { queryClient } from '@/config/query-client'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import type {
  CompactEServiceTemplateVersion,
  EServiceTemplateInstance,
  EServiceTemplateInstances,
} from '@/api/api.generatedTypes'
import { ProviderEServiceTemplateUsingTenantsTable } from '../ProviderEServiceTemplateUsingTenantsTable'

const eserviceTemplateVersions: CompactEServiceTemplateVersion[] = [
  { id: 'template-version-1', version: 1, state: 'PUBLISHED' },
]

const instances: EServiceTemplateInstance[] = [
  {
    id: 'eservice-1',
    name: 'Test EService 1',
    producerId: 'producer-1',
    producerName: 'First Producer',
    instanceLabel: 'my-label',
    latestDescriptor: {
      id: 'descriptor-1',
      state: 'PUBLISHED',
      version: '1',
      audience: [],
      templateVersionId: 'template-version-1',
    },
    descriptors: [],
  },
  {
    id: 'eservice-2',
    name: 'Test EService 2',
    producerId: 'producer-2',
    producerName: 'Second Producer',
    latestDescriptor: {
      id: 'descriptor-2',
      state: 'SUSPENDED',
      version: '1',
      audience: [],
      templateVersionId: 'unknown-version',
    },
    descriptors: [],
  },
]

const mockInstancesQuery = (response: Partial<EServiceTemplateInstances>) =>
  vi
    .spyOn(EServiceTemplateQueries, 'getProviderEServiceTemplateInstancesList')
    .mockImplementation((params) =>
      queryOptions({
        queryKey: ['instances', params],
        queryFn: () =>
          Promise.resolve({
            results: [],
            pagination: { offset: 0, limit: 10, totalCount: 0 },
            ...response,
          }),
      })
    )

const lastInstancesQuery = () => {
  const calls = vi.mocked(EServiceTemplateQueries.getProviderEServiceTemplateInstancesList).mock
    .calls
  return calls[calls.length - 1][0]
}

type InitialFilters = { producerName?: string; states?: string[]; offset?: number }

const buildSearchParams = ({ producerName, states, offset }: InitialFilters = {}) => {
  const params = new URLSearchParams()
  if (producerName) params.set('producerName', producerName)
  if (states) params.set('states', states.join(','))
  if (offset) params.set('offset', String(offset))
  const search = params.toString()
  return search ? `?${search}` : ''
}

const applyTenantFilter = async (user: ReturnType<typeof userEvent.setup>, value: string) => {
  await user.type(await screen.findByRole('textbox', { name: /tenantField/ }), `${value}{Enter}`)
}

const submitFilters = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: 'button' }))

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

const selectStates = async (user: ReturnType<typeof userEvent.setup>, labels: RegExp[]) => {
  ignoreUnparsableScrollSelector()
  await user.click(await screen.findByRole('combobox', { name: /statusField\.label/ }))
  for (const label of labels) {
    await user.click(await screen.findByRole('option', { name: label }))
  }
  await submitFilters(user)
}

const resetFilters = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(await screen.findByRole('button', { name: 'remove' }))
}

const renderTable = (initialFilters: InitialFilters = {}) => {
  const searchParams = buildSearchParams(initialFilters)
  return renderWithApplicationContext(
    <NuqsTestingAdapter searchParams={searchParams} hasMemory>
      <ProviderEServiceTemplateUsingTenantsTable
        eserviceTemplateId="template-1"
        eserviceTemplateVersions={eserviceTemplateVersions}
      />
    </NuqsTestingAdapter>,
    { withRouterContext: true, withReactQueryContext: true },
    createMemoryHistory({ initialEntries: [`/${searchParams}`] })
  )
}

describe('ProviderEServiceTemplateUsingTenantsTable', () => {
  beforeEach(() => {
    queryClient.clear()
    mockUseJwt({ jwt: { organizationId: 'producer-1' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the sub-unit name with its root tenant below, and the root tenant name alone', async () => {
    mockInstancesQuery({
      results: [
        {
          ...instances[0],
          producerName: 'Direzione Mobilità',
          producerSubUnitType: 'AOO',
          producerParentTenants: [{ id: 'comune-id', name: 'Comune di Milano' }],
        },
        {
          ...instances[1],
          producerName: 'Ufficio permessi ZTL',
          producerSubUnitType: 'UO',
          producerParentTenants: [
            { id: 'aoo-id', name: 'Direzione Mobilità', subUnitType: 'AOO' },
            { id: 'comune-id', name: 'Comune di Milano' },
          ],
        },
      ],
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })
    renderTable()

    await screen.findByText('Direzione Mobilità')
    const [, aooRow, uoRow] = screen.getAllByRole('row')

    expect(within(aooRow).getByText('Direzione Mobilità')).toBeInTheDocument()
    expect(within(aooRow).getByText('Comune di Milano')).toBeInTheDocument()
    expect(within(uoRow).getByText('Ufficio permessi ZTL - Direzione Mobilità')).toBeInTheDocument()
    expect(within(uoRow).getByText('Comune di Milano')).toBeInTheDocument()
  })

  it('shows every column heading and the content of each instance', async () => {
    mockInstancesQuery({
      results: instances,
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })
    renderTable()

    await screen.findByText('First Producer')

    const headings = [
      'eserviceTemplateUsingTenant',
      'eserviceTemplateInstanceLabel',
      'eserviceTemplateInstanceVersion',
      'eserviceTemplateInstanceState',
    ]
    headings.forEach((heading) => {
      expect(screen.getByRole('columnheader', { name: heading })).toBeInTheDocument()
    })

    const [, firstRow, secondRow] = screen.getAllByRole('row')

    expect(within(firstRow).getByText('First Producer')).toBeInTheDocument()
    expect(within(firstRow).getByText('my-label')).toBeInTheDocument()
    expect(within(firstRow).getByText('1')).toBeInTheDocument()
    expect(within(firstRow).getByText('status.eservice.PUBLISHED')).toBeInTheDocument()

    expect(within(secondRow).getByText('Second Producer')).toBeInTheDocument()
    expect(within(secondRow).getAllByText('-')).toHaveLength(2)
    expect(within(secondRow).getByText('status.eservice.SUSPENDED')).toBeInTheDocument()
  })

  it('navigates to the details page of the selected instance', async () => {
    mockInstancesQuery({
      results: instances,
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })
    const user = userEvent.setup()
    const { history } = renderTable()

    await screen.findByText('First Producer')
    const [firstRow, secondRow] = screen.getAllByRole('row').slice(1)

    await user.click(within(firstRow).getByRole('link', { name: 'inspect' }))
    expect(history.location.pathname).toBe('/it/erogazione/e-service/eservice-1/descriptor-1')

    await user.click(within(secondRow).getByRole('link', { name: 'inspect' }))
    expect(history.location.pathname).toBe('/it/catalogo-e-service/eservice-2/descriptor-2')
  })

  it('opens the summary of an own draft instance', async () => {
    mockInstancesQuery({
      results: [
        {
          ...instances[0],
          latestDescriptor: { ...instances[0].latestDescriptor!, state: 'DRAFT' },
        },
      ],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    const user = userEvent.setup()
    const { history } = renderTable()

    await user.click(await screen.findByRole('link', { name: 'inspect' }))

    expect(history.location.pathname).toBe(
      '/it/erogazione/e-service/eservice-1/descriptor-1/modifica/riepilogo'
    )
  })

  it('renders instances without a latest descriptor with no details link and no row actions', async () => {
    mockInstancesQuery({
      results: [{ ...instances[0], instanceLabel: '', latestDescriptor: undefined }],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    renderTable()

    const row = (await screen.findByText('First Producer')).closest('tr') as HTMLElement

    expect(within(row).getAllByText('-')).toHaveLength(2)
    expect(within(row).queryByRole('link')).not.toBeInTheDocument()
    expect(within(row).queryByRole('button')).not.toBeInTheDocument()
  })

  it('names the table after the tab and renders pagination', async () => {
    mockInstancesQuery({
      results: instances,
      pagination: { offset: 0, limit: 10, totalCount: 25 },
    })
    renderTable()

    await screen.findByText('First Producer')

    expect(screen.getByRole('table', { name: 'read.tabs.eserviceTemplateTenants' })).toBeVisible()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('shows a loading table instead of the empty state while fetching', () => {
    mockInstancesQuery({})
    renderTable()

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('list.usingTenantTable.noDataLabel')).not.toBeInTheDocument()
  })

  it('shows the no results message when the filters match nothing', async () => {
    mockInstancesQuery({})
    renderTable({ producerName: 'unknown' })

    expect(await screen.findByText('list.usingTenantTable.noResultsLabel')).toBeInTheDocument()
    expect(screen.queryByText('list.usingTenantTable.noDataLabel')).not.toBeInTheDocument()
  })

  it('queries with default pagination and no filters', () => {
    mockInstancesQuery({})
    renderTable()

    expect(lastInstancesQuery()).toEqual({
      eserviceTemplateId: 'template-1',
      limit: 10,
      offset: 0,
    })
  })

  it('reads the initial filters from the url', () => {
    mockInstancesQuery({ results: instances, pagination: { offset: 0, limit: 10, totalCount: 2 } })
    renderTable({ producerName: 'first', states: ['PUBLISHED'] })

    expect(lastInstancesQuery()).toMatchObject({
      producerName: 'first',
      states: ['PUBLISHED'],
    })
  })

  it('adds the tenant name to the payload only after submitting the filters', async () => {
    mockInstancesQuery({ results: instances, pagination: { offset: 0, limit: 10, totalCount: 2 } })
    const user = userEvent.setup()
    renderTable()

    await user.type(await screen.findByRole('textbox', { name: /tenantField/ }), 'first')
    expect(lastInstancesQuery().producerName).toBeUndefined()

    await user.keyboard('{Enter}')

    await waitFor(() => expect(lastInstancesQuery().producerName).toBe('first'))
  })

  it('adds the selected states to the payload once the filters are submitted', async () => {
    mockInstancesQuery({ results: instances, pagination: { offset: 0, limit: 10, totalCount: 2 } })
    const user = userEvent.setup()
    renderTable()

    await selectStates(user, [/optionLabels\.ACTIVE/, /optionLabels\.SUSPENDED/])

    await waitFor(() => expect(lastInstancesQuery().states).toEqual(['PUBLISHED', 'SUSPENDED']))
  })

  it('removes the filters from the payload when they are reset', async () => {
    mockInstancesQuery({ results: instances, pagination: { offset: 0, limit: 10, totalCount: 2 } })
    const user = userEvent.setup()
    renderTable({ producerName: 'first', states: ['PUBLISHED'] })
    expect(lastInstancesQuery()).toMatchObject({ producerName: 'first', states: ['PUBLISHED'] })

    await resetFilters(user)

    await waitFor(() => {
      expect(lastInstancesQuery().producerName).toBeUndefined()
      expect(lastInstancesQuery().states).toBeUndefined()
    })
  })

  it('returns to the first page when the filters are applied', async () => {
    mockInstancesQuery({
      results: instances,
      pagination: { offset: 10, limit: 10, totalCount: 25 },
    })
    const user = userEvent.setup()
    renderTable({ offset: 10 })
    expect(lastInstancesQuery().offset).toBe(10)

    await applyTenantFilter(user, 'first')

    await waitFor(() =>
      expect(lastInstancesQuery()).toMatchObject({ producerName: 'first', offset: 0 })
    )
  })

  it('returns to the first page when the filters are reset', async () => {
    mockInstancesQuery({
      results: instances,
      pagination: { offset: 10, limit: 10, totalCount: 25 },
    })
    const user = userEvent.setup()
    renderTable({ producerName: 'first', offset: 10 })
    expect(lastInstancesQuery()).toMatchObject({ producerName: 'first', offset: 10 })

    await resetFilters(user)

    await waitFor(() => {
      expect(lastInstancesQuery().producerName).toBeUndefined()
      expect(lastInstancesQuery().offset).toBe(0)
    })
  })

  it('keeps the filters visible to let users change them when no result matches', async () => {
    mockInstancesQuery({})
    renderTable({ producerName: 'unknown' })

    expect(await screen.findByRole('textbox', { name: /tenantField/ })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /statusField\.label/ })).toBeInTheDocument()
  })

  it('hides the filters when the template has no instances and no filter is set', async () => {
    mockInstancesQuery({})
    renderTable()

    await screen.findByText('list.usingTenantTable.noDataLabel')
    expect(screen.queryByRole('textbox', { name: /tenantField/ })).not.toBeInTheDocument()
  })

  it('shows the empty state without filters when the template has no instances', async () => {
    mockInstancesQuery({})
    renderTable()

    expect(await screen.findByText('list.usingTenantTable.noDataLabel')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
