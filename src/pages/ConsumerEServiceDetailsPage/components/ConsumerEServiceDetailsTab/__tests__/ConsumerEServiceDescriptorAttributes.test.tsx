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
  createStandardCertifiedTenantAttribute,
  createVerifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createMockDescriptorAttribute,
  createMockAttribute,
} from '@/../__mocks__/data/attribute.mocks'
import { formatThousands } from '@/utils/format.utils'

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

const baseAttribute = createMockAttribute({ id: 'attr-1', name: 'Test Attribute' })

vi.mock('@/api/attribute', () => ({
  AttributeQueries: {
    getPartyCertifiedList: (orgId: string) => ['attribute', 'certified', orgId],
    getPartyVerifiedList: (orgId: string) => ['attribute', 'verified', orgId],
    getPartyDeclaredList: (orgId: string) => ['attribute', 'declared', orgId],
    getSingle: vi.fn((id: string) => ({
      queryKey: ['attribute', id],
      queryFn: vi.fn().mockReturnValue(baseAttribute),
    })),
  },
}))

const certifiedAttr = createMockDescriptorAttribute({ id: 'cert-attr-1', name: 'Cert Attr' })
const verifiedAttr = createMockDescriptorAttribute({
  id: 'ver-attr-1',
  name: 'Ver Attr',
  kind: 'VERIFIED',
})
const declaredAttr = createMockDescriptorAttribute({
  id: 'decl-attr-1',
  name: 'Decl Attr',
  kind: 'DECLARED',
})

const baseDescriptor = {
  id: 'descriptor-id-001',
  state: 'PUBLISHED',
  dailyCallsPerConsumer: 1000,
  dailyCallsTotal: 5000,
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
  ownedCertified?: ReturnType<typeof createStandardCertifiedTenantAttribute>[]
  ownedVerified?: ReturnType<typeof createVerifiedTenantAttribute>[]
  ownedDeclared?: ReturnType<typeof createDeclaredTenantAttribute>[]
  delegatedCertified?: ReturnType<typeof createStandardCertifiedTenantAttribute>[][]
  descriptorAttributes?: typeof baseDescriptor.attributes
}) {
  mockUseJwt()
  useSuspenseQueryMock.mockReturnValue({
    data: {
      ...baseDescriptor,
      attributes: overrides?.descriptorAttributes ?? baseDescriptor.attributes,
    },
  })
  useSuspenseQueriesMock.mockReset()
  useSuspenseQueriesMock
    .mockReturnValueOnce([
      { data: { attributes: overrides?.ownedCertified ?? [] } },
      { data: { attributes: overrides?.ownedVerified ?? [] } },
      { data: { attributes: overrides?.ownedDeclared ?? [] } },
    ])
    .mockReturnValueOnce(
      (overrides?.delegatedCertified ?? []).map((attributes) => ({ data: { attributes } }))
    )
}

function renderComponent(
  props: React.ComponentProps<typeof ConsumerEServiceDescriptorAttributes> = {}
) {
  return renderWithApplicationContext(<ConsumerEServiceDescriptorAttributes {...props} />, {
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
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
    })
    renderComponent()

    expect(screen.getAllByText('group.manage.success.consumer').length).toBeGreaterThanOrEqual(1)
  })

  it('should show warning text for unfulfilled verified attributes', () => {
    setupMocks({
      ownedCertified: [
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
    })
    renderComponent()

    expect(screen.getByText('group.manage.warning.verified.consumer')).toBeInTheDocument()
  })

  it('should show warning text for unfulfilled declared attributes', () => {
    setupMocks({
      ownedCertified: [
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
    })
    renderComponent()

    expect(screen.getByText('group.manage.warning.declared.consumer')).toBeInTheDocument()
  })

  it('should show success text when verified attribute is owned', () => {
    setupMocks({
      ownedCertified: [
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
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
      ownedCertified: [
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
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

  it('should show thresholds section with daily calls labels', () => {
    setupMocks()
    renderComponent()

    expect(screen.getByText('thresholds.title')).toBeInTheDocument()
    expect(screen.getByText('thresholds.dailyCallsPerConsumer.label')).toBeInTheDocument()
    expect(screen.getByText('thresholds.dailyCallsTotal.label')).toBeInTheDocument()
  })

  it('should show the custom threshold assigned to the consumer certified attribute', () => {
    setupMocks({
      ownedCertified: [
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
      ],
      descriptorAttributes: {
        ...baseDescriptor.attributes,
        certified: [[{ ...certifiedAttr, dailyCallsPerConsumer: 500 }]],
      },
    })
    renderComponent()

    expect(screen.getByText('thresholds.customized.title')).toBeInTheDocument()
    expect(screen.getByText('thresholds.customized.currentTenantLabel')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText(formatThousands(1000))).toBeInTheDocument()
  })

  it('should not show a custom threshold the consumer does not own', () => {
    setupMocks({
      descriptorAttributes: {
        ...baseDescriptor.attributes,
        certified: [[{ ...certifiedAttr, dailyCallsPerConsumer: 500 }]],
      },
    })
    renderComponent()

    expect(screen.getByText(formatThousands(1000))).toBeInTheDocument()
    expect(screen.queryByText('500')).not.toBeInTheDocument()
    expect(screen.queryByText('thresholds.customized.title')).not.toBeInTheDocument()
  })

  it('should show the custom threshold assigned to a consumer delegator', () => {
    setupMocks({
      delegatedCertified: [
        [
          createStandardCertifiedTenantAttribute({
            id: 'cert-attr-1',
            revocationTimestamp: undefined,
          }),
        ],
      ],
      descriptorAttributes: {
        ...baseDescriptor.attributes,
        certified: [[{ ...certifiedAttr, dailyCallsPerConsumer: 750 }]],
      },
    })
    renderComponent({ delegators: [{ id: 'delegator-id', name: 'Delegator' }] })

    expect(screen.getByText('thresholds.customized.title')).toBeInTheDocument()
    expect(screen.getByText('Delegator')).toBeInTheDocument()
    expect(screen.getByText('750')).toBeInTheDocument()
    expect(screen.getByText(formatThousands(1000))).toBeInTheDocument()
  })

  it('should show the highest custom threshold among the certified attributes owned by the consumer', () => {
    setupMocks({
      ownedCertified: [
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-1',
          revocationTimestamp: undefined,
        }),
        createStandardCertifiedTenantAttribute({
          id: 'cert-attr-2',
          revocationTimestamp: undefined,
        }),
      ],
      descriptorAttributes: {
        ...baseDescriptor.attributes,
        certified: [
          [{ ...certifiedAttr, dailyCallsPerConsumer: 500 }],
          [
            createMockDescriptorAttribute({
              id: 'cert-attr-2',
              name: 'Second certified attribute',
              dailyCallsPerConsumer: 750,
            }),
          ],
        ],
      },
    })
    renderComponent()

    expect(screen.getByText('750')).toBeInTheDocument()
    expect(screen.queryByText('500')).not.toBeInTheDocument()
  })
})
