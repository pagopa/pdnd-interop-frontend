import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { EServiceQueries } from '@/api/eservice'
import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { queryClient } from '@/config/query-client'
import { mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceTemplateDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'
import ConsumerTemplateInstancesGroupPage from '../ConsumerTemplateInstancesGroup.page'

const { getProducersMock, queryCatalogListMock, getTemplateMock } = vi.hoisted(() => ({
  getProducersMock: vi.fn(),
  queryCatalogListMock: vi.fn(),
  getTemplateMock: vi.fn(),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getProducers: getProducersMock,
    queryCatalogList: queryCatalogListMock,
  },
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: { getSingleByEServiceTemplateId: getTemplateMock },
}))

vi.mock('@/components/layout/containers/NewPageContainer', () => ({
  NewPageContainer: ({
    children,
    title,
    description,
  }: {
    children: React.ReactNode
    title?: string
    description?: string
  }) => (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </main>
  ),
}))

vi.mock('@/components/shared/Filters/FiltersSection', () => ({
  FiltersSection: () => null,
}))

vi.mock('../../ConsumerEServiceCatalogPage/components', () => ({
  EServiceCatalogGrid: () => null,
  EServiceCatalogGridSkeleton: () => null,
}))

const templateId = 'template-id'
const pagination = { offset: 0, limit: 9, totalCount: 0 }

const renderPage = () =>
  renderWithApplicationContext(<ConsumerTemplateInstancesGroupPage />, {
    withRouterContext: true,
    withReactQueryContext: true,
  })

const setTemplateResponse = (template: EServiceTemplateDetails) => {
  getTemplateMock.mockReturnValue({
    queryKey: ['template', templateId],
    queryFn: () => Promise.resolve(template),
  } as never)
}

const lastCatalogQuery = () => {
  const calls = vi.mocked(EServiceQueries.queryCatalogList).mock.calls
  return calls[calls.length - 1][0]
}

describe('ConsumerTemplateInstancesGroupPage', () => {
  beforeEach(() => {
    mockUseParams({ templateInstancesGroupId: templateId })
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
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('queries the catalog with the template ID and default pagination and sorting', () => {
    setTemplateResponse(createMockEServiceTemplateDetails())

    renderPage()

    expect(lastCatalogQuery()).toEqual({
      limit: 9,
      offset: 0,
      templateId,
      sortBy: 'CREATED_AT_DESC',
    })
  })

  it('shows the banner link for the highest template version', async () => {
    setTemplateResponse(
      createMockEServiceTemplateDetails({
        name: 'Template name',
        creator: { name: 'Template producer' },
        versions: [
          { id: 'version-2', version: 2, state: 'PUBLISHED' },
          { id: 'version-1', version: 1, state: 'PUBLISHED' },
          { id: 'version-3', version: 3, state: 'PUBLISHED' },
        ],
      })
    )

    renderPage()

    expect(await screen.findByRole('heading', { name: 'Template name' })).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'buttonLabel' })).toHaveAttribute(
        'href',
        `/it/erogazione/catalogo-template/${templateId}/version-3`
      )
    )
  })

  it('does not render the template banner when there are no versions', async () => {
    setTemplateResponse(createMockEServiceTemplateDetails({ versions: [] }))

    renderPage()

    expect(await screen.findByRole('heading', { name: 'template-name' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'buttonLabel' })).not.toBeInTheDocument()
  })
})
