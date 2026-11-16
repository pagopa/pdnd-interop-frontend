import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type * as ReactQuery from '@tanstack/react-query'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import EntryRequirementsTab from '../EntryRequirementsTab'

const descriptor = createMockEServiceDescriptorCatalog({
  dailyCallsPerConsumer: 1200,
  dailyCallsTotal: 2500000,
})

vi.mock('@/router', () => ({
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: { useJwt: () => ({ jwt: { organizationId: 'organization-id' } }) },
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: { getDescriptorCatalog: vi.fn(() => ({ queryKey: ['descriptor'] })) },
}))

vi.mock('@/api/attribute', () => ({
  AttributeQueries: {
    getPartyCertifiedList: vi.fn(() => ({ queryKey: ['certified'] })),
    getPartyVerifiedList: vi.fn(() => ({ queryKey: ['verified'] })),
    getPartyDeclaredList: vi.fn(() => ({ queryKey: ['declared'] })),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useSuspenseQuery: () => ({ data: descriptor }),
  useSuspenseQueries: () => [
    { data: { attributes: [] } },
    { data: { attributes: [] } },
    { data: { attributes: [] } },
  ],
}))

describe('EntryRequirementsTab', () => {
  it('renders formatted thresholds and the attributes section', () => {
    mockUseJwt()
    renderWithApplicationContext(<EntryRequirementsTab />, { withRouterContext: true })

    expect(screen.getByText('sections.thresholds.fields.dailyCallsPerConsumer')).toBeInTheDocument()
    expect(screen.getByText('sections.thresholds.fields.dailyCallsTotal')).toBeInTheDocument()
    expect(screen.getByText('attributesGenericLabel')).toBeInTheDocument()
  })
})
