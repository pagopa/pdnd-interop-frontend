import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type * as ReactQuery from '@tanstack/react-query'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import PurposeTemplatesTab from '../PurposeTemplatesTab'

const { mockedGetCatalogPurposeTemplates } = vi.hoisted(() => ({
  mockedGetCatalogPurposeTemplates: vi.fn(),
}))

vi.mock('@/router', () => ({
  useParams: () => ({ eserviceId: 'eservice-id' }),
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
    return { data: { pagination: { totalCount: 3 } } }
  },
  keepPreviousData: {},
}))

describe('PurposeTemplatesTab', () => {
  it('renders purpose-template filters and scopes the query to the current e-service', () => {
    mockedGetCatalogPurposeTemplates.mockReturnValue({ queryKey: ['purpose-templates'] })

    renderWithApplicationContext(<PurposeTemplatesTab />, {
      withRouterContext: true,
      nuqsTestingAdapterProps: { hasMemory: true },
    })

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'filters.name.label' })).toBeInTheDocument()
    expect(screen.getAllByRole('combobox')).toHaveLength(2)
    expect(mockedGetCatalogPurposeTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ eserviceIds: ['eservice-id'] })
    )
  })
})
