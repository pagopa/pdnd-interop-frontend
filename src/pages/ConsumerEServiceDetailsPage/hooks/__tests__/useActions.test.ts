import type { AgreementListEntry, CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { useQueries, useQuery } from '@tanstack/react-query'
import { mockUseJwt, mockUseParams, renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useDialogStore } from '@/stores/dialog.store'
import { useActions } from '../useActions'
import { createMockAgreementListingItem } from '../../../../../__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorCatalog } from '../../../../../__mocks__/data/eservice.mocks'
import type { Mock } from 'vitest'
import * as router from '@/router'
import type * as ReactQuery from '@tanstack/react-query'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQueries: vi.fn(),
  useQuery: vi.fn(),
}))

const TENANT_ID = 'consumer-tenant-id'
const TENANT_NAME = 'Consumer tenant'
const ESERVICE_ID = 'eservice-id'
const DESCRIPTOR_ID = 'descriptor-id'
const ACTIVE_DESCRIPTOR_ID = 'active-descriptor-id'
const AGREEMENT_ID = 'agreement-id'

const navigate = vi.fn()

type QueryFixtures = {
  descriptor?: CatalogEServiceDescriptor
  activeDescriptor?: CatalogEServiceDescriptor
  agreements?: AgreementListEntry[]
  delegators?: Array<{ id: string; name: string }>
  delegations?: Array<{ id: string }>
  isLoading?: boolean
}

const createDescriptor = (
  overrides: Parameters<typeof createMockEServiceDescriptorCatalog>[0] = {}
): CatalogEServiceDescriptor => {
  const defaultOverrides = {
    id: DESCRIPTOR_ID,
    state: 'PUBLISHED' as const,
    version: '1',
    eservice: {
      id: ESERVICE_ID,
      name: 'Test e-service',
      producer: { id: 'producer-tenant-id', name: 'Producer' },
      activeDescriptor: {
        id: ACTIVE_DESCRIPTOR_ID,
        state: 'PUBLISHED' as const,
        version: '2',
        audience: [],
      },
    },
  }
  return createMockEServiceDescriptorCatalog({
    ...defaultOverrides,
    ...overrides,
    eservice: {
      ...defaultOverrides.eservice,
      ...overrides.eservice,
    },
  })
}

function mockQueryResults({
  descriptor = createDescriptor(),
  activeDescriptor = createDescriptor({
    id: ACTIVE_DESCRIPTOR_ID,
    version: '2',
    eservice: { activeDescriptor: { id: ACTIVE_DESCRIPTOR_ID } },
  }),
  agreements = [],
  delegators = [],
  delegations = [],
  isLoading = false,
}: QueryFixtures = {}) {
  ;(useQueries as Mock).mockReturnValue([
    { data: { attributes: [] }, isLoading },
    { data: { attributes: [] }, isLoading: false },
    { data: { attributes: [] }, isLoading: false },
  ])
  ;(useQuery as Mock).mockImplementation((options: { queryKey: readonly unknown[] }) => {
    switch (options.queryKey[0]) {
      case 'EServiceGetDescriptorCatalog':
        return {
          data: options.queryKey[2] === ACTIVE_DESCRIPTOR_ID ? activeDescriptor : descriptor,
          isLoading: false,
        }
      case 'AgreementGetConsumerAgreementsList':
        return { data: agreements, isLoading: false }
      case 'DelegationGetConsumerDelegators':
        return { data: delegators, isLoading: false }
      case 'DelegationGetDelegationsList':
        return { data: delegations, isLoading: false }
      default:
        return { data: undefined, isLoading: false }
    }
  })
}

function renderUseActions() {
  return renderHookWithApplicationContext(() => useActions(), {
    withReactQueryContext: true,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUseParams({ eserviceId: ESERVICE_ID, descriptorId: DESCRIPTOR_ID })
  vi.spyOn(router, 'useNavigate').mockReturnValue(navigate)
  mockUseJwt({
    jwt: {
      organization: { name: TENANT_NAME },
      organizationId: TENANT_ID,
    },
  })
  useDialogStore.setState({ dialog: null })
  mockQueryResults()
})

describe('useActions', () => {
  it('does not expose actions while required data is loading', () => {
    mockQueryResults({ isLoading: true })

    const { result } = renderUseActions()

    expect(result.current).toEqual({ primary: undefined, secondary: undefined })
  })

  it('does not expose actions for a non-admin user', () => {
    mockUseJwt({ isAdmin: false })

    const { result } = renderUseActions()

    expect(result.current.primary).toBeUndefined()
    expect(result.current.secondary).toBeUndefined()
  })

  it('offers subscribing when the tenant has no agreement and opens the confirmation dialog', () => {
    const { result } = renderUseActions()

    expect(result.current.primary?.variant).toBe('contained')
    expect(result.current.secondary).toBeUndefined()

    result.current.primary?.action()

    expect(useDialogStore.getState().dialog).toMatchObject({
      type: 'confirmCreateAgreement',
      eserviceId: ESERVICE_ID,
      consumerId: TENANT_ID,
      descriptorId: DESCRIPTOR_ID,
      producerId: 'producer-tenant-id',
    })
  })

  it('opens the confirmation dialog when the consumer owns the e-service', () => {
    mockQueryResults({
      descriptor: createDescriptor({
        eservice: { producer: { id: TENANT_ID } },
      }),
    })

    const { result } = renderUseActions()
    result.current.primary?.action()

    expect(useDialogStore.getState().dialog).toMatchObject({
      type: 'confirmCreateAgreement',
      eserviceId: ESERVICE_ID,
      consumerId: TENANT_ID,
      descriptorId: DESCRIPTOR_ID,
      producerId: TENANT_ID,
    })
  })

  it('navigates directly to the agreement editor for a single draft agreement', () => {
    mockQueryResults({
      agreements: [
        createMockAgreementListingItem({
          id: AGREEMENT_ID,
          state: 'DRAFT',
          consumer: { id: TENANT_ID, name: TENANT_NAME },
          descriptor: { id: DESCRIPTOR_ID, version: '1' },
        }),
      ],
    })

    const { result } = renderUseActions()
    result.current.primary?.action()

    expect(navigate).toHaveBeenCalledWith('SUBSCRIBE_AGREEMENT_EDIT', {
      params: { agreementId: AGREEMENT_ID },
    })
  })

  it('navigates directly to the agreement when inspecting a single active agreement', () => {
    mockQueryResults({
      agreements: [
        createMockAgreementListingItem({
          id: AGREEMENT_ID,
          state: 'ACTIVE',
          consumer: { id: TENANT_ID, name: TENANT_NAME },
          descriptor: { id: DESCRIPTOR_ID, version: '2' },
        }),
      ],
    })

    const { result } = renderUseActions()
    result.current.primary?.action()

    expect(navigate).toHaveBeenCalledWith('SUBSCRIBE_AGREEMENT_READ', {
      params: { agreementId: AGREEMENT_ID },
    })
  })

  it('opens the update confirmation dialog for a single upgradable agreement', () => {
    mockQueryResults({
      agreements: [
        createMockAgreementListingItem({
          id: AGREEMENT_ID,
          state: 'ACTIVE',
          consumer: { id: TENANT_ID, name: TENANT_NAME },
          descriptor: { id: DESCRIPTOR_ID, version: '1' },
        }),
      ],
    })

    const { result } = renderUseActions()
    result.current.primary?.action()

    expect(useDialogStore.getState().dialog).toMatchObject({
      type: 'confirmUpdateAgreement',
      agreement: {
        id: AGREEMENT_ID,
        consumerId: TENANT_ID,
        descriptorId: DESCRIPTOR_ID,
      },
      descriptor: { id: DESCRIPTOR_ID },
    })
  })

  it('opens the subscribe dialog with only consumers who do not already have an agreement', () => {
    mockQueryResults({
      agreements: [
        createMockAgreementListingItem({
          id: AGREEMENT_ID,
          state: 'PENDING',
          consumer: { id: 'delegator-id', name: 'Delegator' },
          descriptor: { id: DESCRIPTOR_ID, version: '1' },
        }),
      ],
      delegators: [{ id: 'delegator-id', name: 'Delegator' }],
    })

    const { result } = renderUseActions()
    result.current.secondary?.action()

    expect(useDialogStore.getState().dialog).toMatchObject({
      type: 'createAgreement',
      consumers: [{ id: TENANT_ID, name: TENANT_NAME }],
    })
  })

  it('groups available actions and opens an update dialog with only eligible consumers', () => {
    mockQueryResults({
      agreements: [
        createMockAgreementListingItem({
          id: AGREEMENT_ID,
          state: 'ACTIVE',
          consumer: { id: TENANT_ID, name: TENANT_NAME },
          descriptor: { id: DESCRIPTOR_ID, version: '1' },
        }),
        createMockAgreementListingItem({
          id: 'draft-agreement-id',
          state: 'DRAFT',
          consumer: { id: TENANT_ID, name: TENANT_NAME },
          descriptor: { id: DESCRIPTOR_ID, version: '1' },
        }),
      ],
      delegators: [{ id: 'delegator-id', name: 'Delegator' }],
    })

    const { result } = renderUseActions()

    expect(result.current.primary?.variant).toBe('contained')
    expect(result.current.menu).toHaveLength(2)

    result.current.primary?.action()

    expect(useDialogStore.getState().dialog).toMatchObject({
      type: 'updateAgreement',
      agreements: [{ id: AGREEMENT_ID, consumerId: TENANT_ID, descriptorId: DESCRIPTOR_ID }],
      consumers: [{ id: TENANT_ID, name: TENANT_NAME }],
    })
  })
})
