import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerEServiceDescriptorAttributes } from '../ConsumerEServiceDescriptorAttributes'
import {
  mockUseJwt,
  mockUseParams,
  mockUseCurrentRoute,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import {
  createCertifiedTenantAttribute,
  createVerifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createMockDescriptorAttribute,
} from '@/../__mocks__/data/attribute.mocks'

mockUseParams({
  eserviceId: 'eservice-id-001',
  descriptorId: 'descriptor-id-001',
})

mockUseCurrentRoute({ mode: 'consumer' })

const useSuspenseQueryMock = vi.fn()
const useSuspenseQueriesMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
    useSuspenseQueries: () => useSuspenseQueriesMock(),
  }
})

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorCatalog: (id: string, descriptorId: string) => [
      'eservice',
      'catalog',
      id,
      descriptorId,
    ],
  },
}))

vi.mock('@/api/attribute', () => ({
  AttributeQueries: {
    getPartyCertifiedList: (orgId: string) => ['attribute', 'certified', orgId],
    getPartyVerifiedList: (orgId: string) => ['attribute', 'verified', orgId],
    getPartyDeclaredList: (orgId: string) => ['attribute', 'declared', orgId],
  },
}))

const certifiedAttr = createMockDescriptorAttribute({ id: 'cert-attr-1', name: 'Cert Attr' })
const verifiedAttr = createMockDescriptorAttribute({ id: 'ver-attr-1', name: 'Ver Attr' })
const declaredAttr = createMockDescriptorAttribute({ id: 'decl-attr-1', name: 'Decl Attr' })

const baseDescriptor = {
  id: 'descriptor-id-001',
  state: 'PUBLISHED',
  eservice: {
    id: 'eservice-id-001',
    name: 'Test E-Service',
    producer: { id: 'producer-id-001', name: 'Producer' },
  },
  attributes: {
    certified: [[certifiedAttr]],
    verified: [[verifiedAttr]],
    declared: [[declaredAttr]],
  },
}

function setupMocks(overrides?: {
  ownedCertified?: ReturnType<typeof createCertifiedTenantAttribute>[]
  ownedVerified?: ReturnType<typeof createVerifiedTenantAttribute>[]
  ownedDeclared?: ReturnType<typeof createDeclaredTenantAttribute>[]
}) {
  mockUseJwt()
  useSuspenseQueryMock.mockReturnValue({ data: baseDescriptor })
  useSuspenseQueriesMock.mockReturnValue([
    { data: { attributes: overrides?.ownedCertified ?? [] } },
    { data: { attributes: overrides?.ownedVerified ?? [] } },
    { data: { attributes: overrides?.ownedDeclared ?? [] } },
  ])
}

function renderComponent() {
  return renderWithApplicationContext(<ConsumerEServiceDescriptorAttributes />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('ConsumerEServiceDescriptorAttributes', () => {
  it('should show error text for unfulfilled certified attributes', () => {
    setupMocks()
    renderComponent()

    expect(screen.getByText('group.manage.error.consumer')).toBeInTheDocument()
  })

  it('should show success text when certified attribute is owned', () => {
    setupMocks({
      ownedCertified: [
        createCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
    })
    renderComponent()

    expect(screen.getAllByText('group.manage.success.consumer').length).toBeGreaterThanOrEqual(1)
  })

  it('should show warning text for unfulfilled verified attributes', () => {
    setupMocks()
    renderComponent()

    expect(screen.getByText('group.manage.warning.verified.consumer')).toBeInTheDocument()
  })

  it('should show warning text for unfulfilled declared attributes', () => {
    setupMocks()
    renderComponent()

    expect(screen.getByText('group.manage.warning.declared.consumer')).toBeInTheDocument()
  })

  it('should show success text when verified attribute is owned', () => {
    setupMocks({
      ownedVerified: [
        createVerifiedTenantAttribute({
          id: 'ver-attr-1',
          verifiedBy: [{ id: 'producer-id-001', verificationDate: '2024-01-01T00:00:00.000Z' }],
          revokedBy: [],
        }),
      ],
    })
    renderComponent()

    expect(screen.getAllByText('group.manage.success.consumer').length).toBeGreaterThanOrEqual(1)
  })

  it('should show success text when declared attribute is owned', () => {
    setupMocks({
      ownedDeclared: [
        createDeclaredTenantAttribute({
          id: 'decl-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
    })
    renderComponent()

    expect(screen.getAllByText('group.manage.success.consumer').length).toBeGreaterThanOrEqual(1)
  })

  it('should show all three attribute sections', () => {
    setupMocks()
    renderComponent()

    expect(screen.getByText('certified.label')).toBeInTheDocument()
    expect(screen.getByText('verified.label')).toBeInTheDocument()
    expect(screen.getByText('declared.label')).toBeInTheDocument()
  })
})
