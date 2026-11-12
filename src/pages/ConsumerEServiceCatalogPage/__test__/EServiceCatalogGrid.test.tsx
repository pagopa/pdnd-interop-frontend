import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {
  CatalogQueryEService,
  CatalogQueryResult,
  CatalogQueryTemplateInstancesGroup,
} from '@/api/api.generatedTypes'

const { getDescriptorCatalogMock, getTemplateByIdMock } = vi.hoisted(() => ({
  getDescriptorCatalogMock: vi.fn(),
  getTemplateByIdMock: vi.fn(),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: { getDescriptorCatalog: getDescriptorCatalogMock },
}))
vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: { getSingleByEServiceTemplateId: getTemplateByIdMock },
}))

import { EServiceQueries } from '@/api/eservice'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { queryClient } from '@/config/query-client'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import { EServiceCatalogGrid } from '../components/EServiceCatalogGrid'

const eservice: CatalogQueryEService = {
  ...createMockEServiceCatalog(),
  resultType: 'eservice',
}

const templateGroup: CatalogQueryTemplateInstancesGroup = {
  resultType: 'template',
  id: 'template-id',
  name: 'Template group',
  description: 'Template group description',
  numInstances: 2,
}

const renderGrid = (catalog: Array<CatalogQueryResult>) =>
  renderWithApplicationContext(<EServiceCatalogGrid catalog={catalog} />, {
    withRouterContext: true,
    withReactQueryContext: true,
  })

describe('EServiceCatalogGrid', () => {
  beforeEach(() => {
    getDescriptorCatalogMock.mockReset()
    getTemplateByIdMock.mockReset()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('renders the no-results status when the catalog is empty', () => {
    renderGrid([])

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders the e-service and template group cards', () => {
    renderGrid([eservice, templateGroup])

    expect(screen.getByRole('heading', { name: eservice.name })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: templateGroup.name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'actions.inspectEService' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'list.inspectCollection' })).toBeInTheDocument()
  })

  it('prefetches the matching resource when its action receives keyboard focus', async () => {
    const user = userEvent.setup()
    const eserviceQueryFn = vi.fn().mockResolvedValue(undefined)
    const templateQueryFn = vi.fn().mockResolvedValue(undefined)

    vi.mocked(EServiceQueries.getDescriptorCatalog).mockReturnValue({
      queryKey: ['descriptor', eservice.id, eservice.activeDescriptor?.id],
      queryFn: eserviceQueryFn,
    } as never)
    vi.mocked(EServiceTemplateQueries.getSingleByEServiceTemplateId).mockReturnValue({
      queryKey: ['template', templateGroup.id],
      queryFn: templateQueryFn,
    } as never)

    renderGrid([eservice, templateGroup])

    await user.tab()
    await waitFor(() => expect(eserviceQueryFn).toHaveBeenCalledOnce())

    await user.tab()
    await waitFor(() => expect(templateQueryFn).toHaveBeenCalledOnce())
  })

  it('does not prefetch an e-service without an active descriptor', async () => {
    const user = userEvent.setup()
    const eserviceWithoutActiveDescriptor: CatalogQueryEService = {
      ...eservice,
      activeDescriptor: undefined,
    }

    renderGrid([eserviceWithoutActiveDescriptor])

    await user.tab()

    expect(EServiceQueries.getDescriptorCatalog).not.toHaveBeenCalled()
  })
})
