import type * as ReactQuery from '@tanstack/react-query'
import { useQueries, useQuery } from '@tanstack/react-query'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, mockUseParams, renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useConsumerEServiceActions } from '../useConsumerEServiceActions'
import { vi } from 'vitest'
import type { Mock } from 'vitest'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQuery: vi.fn(),
  useQueries: vi.fn(),
}))

const mockUseQuery = useQuery as Mock
const mockUseQueries = useQueries as Mock

let descriptor = createMockEServiceDescriptorCatalog({
  eservice: { isMine: true, hasCertifiedAttributes: true },
})
let agreements: unknown[] = []
let agreement: ReturnType<typeof createMockAgreement> | undefined
let isFetchingAgreements = false

function renderUseConsumerEServiceActionsHook() {
  return renderHookWithApplicationContext(() => useConsumerEServiceActions(), {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('useConsumerEServiceActions', () => {
  beforeEach(() => {
    descriptor = createMockEServiceDescriptorCatalog({
      eservice: { isMine: true, hasCertifiedAttributes: true },
    })
    agreements = []
    agreement = undefined
    isFetchingAgreements = false

    mockUseJwt({ isAdmin: true })
    mockUseParams({ eserviceId: descriptor.eservice.id, descriptorId: descriptor.id })

    mockUseQuery.mockImplementation(({ queryKey }: { queryKey: readonly unknown[] }) => {
      switch (queryKey[0]) {
        case 'EServiceGetDescriptorCatalog':
          return { data: descriptor }
        case 'AgreementGetConsumerAgreementsList':
          return { data: agreements, isFetching: isFetchingAgreements }
        case 'AgreementGetSingle':
          return { data: agreement }
        case 'DelegationGetConsumerDelegators':
        case 'DelegationGetDelegationsList':
          return { data: [] }
        default:
          return { data: undefined }
      }
    })
    mockUseQueries.mockReturnValue([
      { data: { attributes: [] } },
      { data: { attributes: [] } },
      { data: { attributes: [] } },
    ])
  })

  it('should not return actions for a non-admin user', () => {
    mockUseJwt({ isAdmin: false })

    const { result } = renderUseConsumerEServiceActionsHook()

    expect(result.current.primary).toBeUndefined()
    expect(result.current.secondary).toBeUndefined()
  })

  it('should return subscribe as the primary action when the current tenant can subscribe', () => {
    const { result } = renderUseConsumerEServiceActionsHook()

    expect(result.current.primary).toMatchObject({
      label: 'tableEServiceCatalog.subscribe',
      variant: 'contained',
      disabled: false,
    })
    expect(result.current.secondary).toBeUndefined()
  })

  it('should disable subscribe when the descriptor is suspended', () => {
    descriptor = createMockEServiceDescriptorCatalog({
      state: 'SUSPENDED',
      eservice: { isMine: true, hasCertifiedAttributes: true },
    })

    const { result } = renderUseConsumerEServiceActionsHook()

    expect(result.current.primary).toMatchObject({
      label: 'tableEServiceCatalog.subscribe',
      disabled: true,
      tooltip: 'tableEServiceCatalog.eserviceSuspendedTooltip',
    })
  })

  it('should prioritize upgrade and expose inspect as the secondary action', () => {
    descriptor = createMockEServiceDescriptorCatalog({
      eservice: {
        isSubscribed: true,
        agreements: [
          {
            id: 'agreement-id',
            state: 'ACTIVE',
            canBeUpgraded: true,
            consumerId: 'organizationId',
          },
        ],
      },
    })
    agreements = [
      {
        id: 'agreement-id',
        state: 'ACTIVE',
        canBeUpgraded: true,
        consumer: { id: 'organizationId' },
      },
    ]
    agreement = createMockAgreement()

    const { result } = renderUseConsumerEServiceActionsHook()

    expect(result.current.primary?.label).toBe('tableEServiceCatalog.upgradeToNewVersion')
    expect(result.current.secondary?.label).toBe('tableEServiceCatalog.inspect')
  })
})
