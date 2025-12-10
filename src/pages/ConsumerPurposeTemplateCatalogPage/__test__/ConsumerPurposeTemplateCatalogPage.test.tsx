import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom' // Import MemoryRouter for routing context
import ConsumerPurposeTemplateCatalogPage from '../ConsumerPurposeTemplateCatalog.page'
import { PurposeTemplateCatalogGrid } from '../components/PurposeTemplateCatalogGrid'
import type { CatalogPurposeTemplates } from '@/api/api.generatedTypes'

const mockCatalogPurposeTemplates: CatalogPurposeTemplates = {
  results: [
    {
      id: 'a123e456-7890-12d3-a456-426614174000',
      targetTenantKind: 'PA',
      purposeTitle: 'Catalog for PA Tenant',
      purposeDescription: 'This catalog is designed for PA tenants to manage their resources.',
      creator: {
        id: 'org-123',
        name: 'Example Organization 1',
        kind: 'PA',
      },
    },
    {
      id: 'b234f567-8901-23e4-b567-527725351111',
      targetTenantKind: 'PRIVATE',
      purposeTitle: 'Private Tenant Catalog',
      purposeDescription: 'A private catalog for exclusive tenant use.',
      creator: {
        id: 'org-456',
        name: 'Example Organization 2',
        kind: 'PRIVATE',
      },
    },
  ],
  pagination: {
    totalCount: 2,
    limit: 10,
    offset: 0,
  },
}

describe('ConsumerPurposeTemplateCatalogPage', () => {
  const queryClient = new QueryClient()

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          {' '}
          <ConsumerPurposeTemplateCatalogPage />
        </MemoryRouter>
      </QueryClientProvider>
    )
  })

  it('should render the empty page when there are no purpose templates', () => {
    render(<PurposeTemplateCatalogGrid purposeTemplates={[]} />)
    expect(screen.getByText('noDataLabel')).toBeInTheDocument()
  })

  it('renders catalog titles correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PurposeTemplateCatalogGrid purposeTemplates={mockCatalogPurposeTemplates.results} />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(screen.getByText('Catalog for PA Tenant')).toBeInTheDocument()
    expect(screen.getByText('Private Tenant Catalog')).toBeInTheDocument()
  })
})
