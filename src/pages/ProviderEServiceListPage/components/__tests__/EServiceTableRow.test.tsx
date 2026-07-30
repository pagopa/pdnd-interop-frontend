import React from 'react'
import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceTableRow } from '../EServiceTableRow'
import { createMockEServiceProvider } from '@/../__mocks__/data/eservice.mocks'
import { createMockDelegationWithCompactTenants } from '@/../__mocks__/data/delegation.mocks'
import type * as ReactQuery from '@tanstack/react-query'

const { mockedUseQuery } = vi.hoisted(() => ({
  mockedUseQuery: vi.fn(),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQuery: mockedUseQuery,
  useQueryClient: () => ({ prefetchQuery: vi.fn() }),
}))

vi.mock('@/hooks/useGetProviderEServiceActions', () => ({
  useGetProviderEServiceActions: () => ({
    primaryAction: undefined,
    secondaryAction: undefined,
    menuActions: [],
  }),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getSingle: vi.fn(() => ({ queryKey: ['getSingle'] })),
    getDescriptorProvider: vi.fn(() => ({ queryKey: ['getDescriptorProvider'] })),
  },
}))

const MY_ORG_ID = 'my-org-id'

function renderRow(eservice: ReturnType<typeof createMockEServiceProvider>) {
  return renderWithApplicationContext(<EServiceTableRow eservice={eservice} />, {
    withRouterContext: true,
    withReactQueryContext: true,
  })
}

describe('EServiceTableRow', () => {
  beforeEach(() => {
    mockUseJwt({ isAdmin: true, jwt: { organizationId: MY_ORG_ID } })
    mockedUseQuery.mockReturnValue({ data: undefined })
  })

  it('renders the eservice name', () => {
    renderRow(createMockEServiceProvider({ name: 'My E-Service' }))
    expect(screen.getByText('My E-Service')).toBeInTheDocument()
  })

  it('does not render ByDelegationChip when there is no delegation', () => {
    renderRow(createMockEServiceProvider({ delegation: undefined }))
    expect(screen.queryByText('byDelegationChip.label.delegator')).not.toBeInTheDocument()
    expect(screen.queryByText('byDelegationChip.label.delegate')).not.toBeInTheDocument()
  })

  it('renders ByDelegationChip with DELEGATOR role when org is the delegator', () => {
    const delegation = createMockDelegationWithCompactTenants({
      delegator: { id: MY_ORG_ID, name: 'My Org' },
      delegate: { id: 'other-org-id', name: 'Other Org' },
    })
    renderRow(createMockEServiceProvider({ delegation }))
    expect(screen.getByText('label.delegator')).toBeInTheDocument()
  })

  it('renders ByDelegationChip with DELEGATE role when org is the delegate', () => {
    const delegation = createMockDelegationWithCompactTenants({
      delegator: { id: 'other-org-id', name: 'Other Org' },
      delegate: { id: MY_ORG_ID, name: 'My Org' },
    })
    renderRow(createMockEServiceProvider({ delegation }))
    expect(screen.getByText('label.delegate')).toBeInTheDocument()
  })

  it('renders the archiving tooltip on the status chip when activeDescriptor is ARCHIVING and archivableOn is set', () => {
    const eservice = createMockEServiceProvider({
      activeDescriptor: {
        id: 'desc-id',
        state: 'ARCHIVING',
        version: '1',
        audience: [],
        archivableOn: '2026-08-01T00:00:00Z',
      },
    })
    renderRow(eservice)
    // The global i18n mock returns the key itself; the tooltip aria-label is 'eservice'
    expect(screen.getByLabelText('eservice')).toBeInTheDocument()
  })

  it('does not render an archiving tooltip when activeDescriptor is ARCHIVING but archivableOn is not set', () => {
    const eservice = createMockEServiceProvider({
      activeDescriptor: {
        id: 'desc-id',
        state: 'ARCHIVING',
        version: '1',
        audience: [],
        archivableOn: undefined,
      },
    })
    renderRow(eservice)
    expect(screen.queryByLabelText(/scheduledArchivalTooltip/)).not.toBeInTheDocument()
  })

  it('does not render an archiving tooltip for a non-archiving active descriptor', () => {
    const eservice = createMockEServiceProvider({
      activeDescriptor: {
        id: 'desc-id',
        state: 'PUBLISHED',
        version: '1',
        audience: [],
        archivableOn: undefined,
      },
    })
    renderRow(eservice)
    expect(screen.queryByLabelText(/scheduledArchivalTooltip/)).not.toBeInTheDocument()
  })

  it('renders inspect button when there is an active descriptor', () => {
    const eservice = createMockEServiceProvider({
      activeDescriptor: { id: 'desc-id', state: 'PUBLISHED', version: '1', audience: [] },
    })
    renderRow(eservice)
    expect(screen.getByRole('link', { name: 'actions.inspect' })).toBeInTheDocument()
  })

  it('renders manageDraft button when there is no active descriptor (admin user)', () => {
    renderRow(createMockEServiceProvider({ activeDescriptor: undefined }))
    expect(screen.getByRole('link', { name: 'actions.manageDraft' })).toBeInTheDocument()
  })
})
