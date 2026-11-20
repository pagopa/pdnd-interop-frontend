import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type * as ReactQuery from '@tanstack/react-query'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import PurposeTemplatesTab from '../PurposeTemplatesTab'

const { mockedGetCatalogPurposeTemplates, mockedTemplatesData } = vi.hoisted(() => ({
  mockedGetCatalogPurposeTemplates: vi.fn(),
  mockedTemplatesData: { current: undefined as unknown },
}))

vi.mock('@/router', () => ({
  useParams: () => ({ eserviceId: 'eservice-id' }),
  useNavigate: () => vi.fn(),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getProducers: vi.fn(() => ({ queryKey: ['producers'] })),
  },
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getCatalogPurposeTemplates: mockedGetCatalogPurposeTemplates,
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQuery: (options: { queryKey?: string[] }) => {
    if (options.queryKey?.[0] === 'producers') {
      return { data: { results: [{ id: 'producer-id', name: 'Producer' }] } }
    }
    return { data: mockedTemplatesData.current }
  },
  keepPreviousData: {},
}))

const renderTab = () =>
  renderWithApplicationContext(<PurposeTemplatesTab />, {
    withRouterContext: true,
    nuqsTestingAdapterProps: { hasMemory: true },
  })

describe('PurposeTemplatesTab', () => {
  beforeEach(() => {
    mockedGetCatalogPurposeTemplates.mockReturnValue({ queryKey: ['purpose-templates'] })
    mockedTemplatesData.current = { results: [], pagination: { totalCount: 0 } }
  })

  it('renders purpose-template filters and scopes the query to the current e-service', () => {
    renderTab()

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'filters.name.label' })).toBeInTheDocument()
    expect(screen.getAllByRole('combobox')).toHaveLength(2)
    expect(mockedGetCatalogPurposeTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ eserviceIds: ['eservice-id'] })
    )
  })

  it('renders the empty state when there are no purpose templates', () => {
    renderTab()

    expect(screen.getByText('empty.title')).toBeInTheDocument()
    expect(screen.getByText('empty.description')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renders a table row for each purpose template', () => {
    mockedTemplatesData.current = {
      results: [
        {
          id: 'template-1',
          purposeTitle: 'Template title',
          creator: { id: 'c1', name: 'Creator name' },
          targetTenantKind: 'PA',
        },
      ],
      pagination: { totalCount: 1 },
    }

    renderTab()

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Template title')).toBeInTheDocument()
    expect(screen.getByText('Creator name')).toBeInTheDocument()
    expect(screen.getByText('table.columns.recipient.value.PA')).toBeInTheDocument()
    expect(screen.queryByText('empty.title')).not.toBeInTheDocument()
  })

  it('requests the next page when navigating the pagination', async () => {
    const user = userEvent.setup()
    mockedTemplatesData.current = {
      results: [
        {
          id: 'template-1',
          purposeTitle: 'Template title',
          creator: { id: 'c1', name: 'Creator name' },
          targetTenantKind: 'PA',
        },
      ],
      pagination: { totalCount: 25 },
    }

    renderTab()

    expect(mockedGetCatalogPurposeTemplates).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 10, offset: 0 })
    )

    await user.click(screen.getByRole('button', { name: /next page/i }))

    await waitFor(() =>
      expect(mockedGetCatalogPurposeTemplates).toHaveBeenLastCalledWith(
        expect.objectContaining({ limit: 10, offset: 10 })
      )
    )
  })
})
