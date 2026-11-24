import React from 'react'
import { screen, within } from '@testing-library/react'
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
import { ConsumerEServiceTemplateInstancesTable } from '../ConsumerEServiceTemplateInstancesTable'

const eserviceTemplateVersions: CompactEServiceTemplateVersion[] = [
  { id: 'template-version-1', version: 1, state: 'PUBLISHED' },
]

const baseInstance: EServiceTemplateInstance = {
  id: 'eservice-1',
  name: 'Test EService',
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
}

const mockInstancesQuery = (response: Partial<EServiceTemplateInstances>) =>
  vi
    .spyOn(EServiceTemplateQueries, 'getMyEServiceTemplateInstancesList')
    .mockImplementation((params) =>
      queryOptions({
        queryKey: ['my-instances', params],
        queryFn: () =>
          Promise.resolve({
            results: [],
            pagination: { offset: 0, limit: 10, totalCount: 0 },
            ...response,
          }),
      })
    )

const renderTable = () =>
  renderWithApplicationContext(
    <NuqsTestingAdapter hasMemory>
      <ConsumerEServiceTemplateInstancesTable
        eserviceTemplateId="template-id"
        eserviceTemplateVersions={eserviceTemplateVersions}
      />
    </NuqsTestingAdapter>,
    { withReactQueryContext: true, withRouterContext: true },
    createMemoryHistory()
  )

describe('ConsumerEServiceTemplateInstancesTable', () => {
  beforeEach(() => {
    queryClient.clear()
    mockUseJwt({ jwt: { organizationId: 'producer-1' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows every column heading and the content of each instance', async () => {
    mockInstancesQuery({
      results: [
        baseInstance,
        {
          ...baseInstance,
          id: 'eservice-2',
          producerId: 'producer-2',
          producerName: 'Second Producer',
          instanceLabel: undefined,
          latestDescriptor: {
            ...baseInstance.latestDescriptor!,
            id: 'descriptor-2',
            state: 'SUSPENDED',
            templateVersionId: 'unknown-version',
          },
        },
      ],
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
    expect(within(firstRow).queryByText('label.default')).not.toBeInTheDocument()

    expect(within(secondRow).getByText('Second Producer')).toBeInTheDocument()
    expect(within(secondRow).getAllByText('-')).toHaveLength(2)
    expect(within(secondRow).getByText('status.eservice.SUSPENDED')).toBeInTheDocument()
    expect(within(secondRow).getByText('label.default')).toBeInTheDocument()
  })

  it('shows the sub-unit name with its root tenant below, and the root tenant name alone', async () => {
    mockInstancesQuery({
      results: [
        {
          ...baseInstance,
          producerName: 'Direzione Mobilità',
          producerSubUnitType: 'AOO',
          producerParentTenants: [{ id: 'comune-id', name: 'Comune di Milano' }],
        },
        {
          ...baseInstance,
          id: 'eservice-2',
          producerName: 'Ufficio permessi ZTL',
          producerSubUnitType: 'UO',
          producerParentTenants: [
            { id: 'aoo-id', name: 'Direzione Mobilità', subUnitType: 'AOO' },
            { id: 'comune-id', name: 'Comune di Milano' },
          ],
        },
        { ...baseInstance, id: 'eservice-3', producerName: 'Comune di Torino' },
      ],
      pagination: { offset: 0, limit: 10, totalCount: 3 },
    })
    renderTable()

    await screen.findByText('Direzione Mobilità')
    const [, aooRow, uoRow, rootRow] = screen.getAllByRole('row')

    expect(within(aooRow).getByText('Direzione Mobilità')).toBeInTheDocument()
    expect(within(aooRow).getByText('Comune di Milano')).toBeInTheDocument()
    expect(within(uoRow).getByText('Ufficio permessi ZTL - Direzione Mobilità')).toBeInTheDocument()
    expect(within(uoRow).getByText('Comune di Milano')).toBeInTheDocument()
    expect(within(rootRow).getByText('Comune di Torino')).toBeInTheDocument()
    expect(within(rootRow).queryByText('Comune di Milano')).not.toBeInTheDocument()
  })

  it('shows the delegation chip next to the tenant name only for instances of other tenants', async () => {
    mockInstancesQuery({
      results: [
        {
          ...baseInstance,
          id: 'eservice-2',
          producerId: 'producer-2',
          producerName: 'Ufficio permessi ZTL',
          producerSubUnitType: 'UO',
          producerParentTenants: [{ id: 'comune-id', name: 'Comune di Milano' }],
        },
        baseInstance,
      ],
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })
    renderTable()

    await screen.findByText('First Producer')
    const [, otherRow, ownRow] = screen.getAllByRole('row')

    expect(within(otherRow).getByText('label.default')).toBeInTheDocument()
    expect(within(otherRow).getByText('Comune di Milano')).toBeInTheDocument()
    expect(within(ownRow).queryByText('label.default')).not.toBeInTheDocument()
  })

  it('renders "-" when the instance label is an empty string', async () => {
    mockInstancesQuery({
      results: [{ ...baseInstance, instanceLabel: '' }],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    renderTable()

    const row = (await screen.findByText('First Producer')).closest('tr') as HTMLElement

    expect(within(row).getByText('-')).toBeInTheDocument()
  })

  it('navigates to the details page of the selected instance', async () => {
    mockInstancesQuery({
      results: [
        baseInstance,
        {
          ...baseInstance,
          id: 'eservice-2',
          producerId: 'producer-2',
          producerName: 'Second Producer',
          latestDescriptor: { ...baseInstance.latestDescriptor!, id: 'descriptor-2' },
        },
      ],
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
          ...baseInstance,
          latestDescriptor: { ...baseInstance.latestDescriptor!, state: 'DRAFT' },
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

  it('names the table after the tab and does not render row actions besides the details link', async () => {
    mockInstancesQuery({
      results: [baseInstance],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    renderTable()

    const row = (await screen.findByText('First Producer')).closest('tr') as HTMLElement

    expect(screen.getByRole('table', { name: 'read.tabs.eserviceTemplateInstances' })).toBeVisible()
    expect(within(row).queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows a loading table instead of the empty state while fetching', () => {
    mockInstancesQuery({})
    renderTable()

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('list.myInstancesTable.noDataLabel')).not.toBeInTheDocument()
  })

  it('renders instances without a latest descriptor with no details link', async () => {
    mockInstancesQuery({
      results: [{ ...baseInstance, latestDescriptor: undefined }],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })
    renderTable()

    const row = (await screen.findByText('First Producer')).closest('tr') as HTMLElement

    expect(within(row).getByText('-')).toBeInTheDocument()
    expect(within(row).queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders pagination when there are more instances than the page size', async () => {
    mockInstancesQuery({
      results: [baseInstance],
      pagination: { offset: 0, limit: 10, totalCount: 25 },
    })
    renderTable()

    await screen.findByText('First Producer')

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('shows the empty state message when there are no instances', async () => {
    mockInstancesQuery({})
    renderTable()

    expect(await screen.findByText('list.myInstancesTable.noDataLabel')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
