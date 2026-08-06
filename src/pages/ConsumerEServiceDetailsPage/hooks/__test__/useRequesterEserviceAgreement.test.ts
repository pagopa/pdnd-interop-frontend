import type { Agreement, AgreementListEntry } from '@/api/api.generatedTypes'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useRequesterEserviceAgreement } from '../useRequesterEserviceAgreement'
import {
  createMockAgreement,
  createMockAgreementListingItem,
} from '../../../../../__mocks__/data/agreement.mocks'
import type { Mock } from 'vitest'
import type * as ReactQuery from '@tanstack/react-query'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQuery: vi.fn(),
}))

vi.mock('@/hooks/useDescriptorAttributesPartyOwnership', () => ({
  useDescriptorAttributesPartyOwnership: vi.fn(),
}))

import { useQuery } from '@tanstack/react-query'
import { useDescriptorAttributesPartyOwnership } from '@/hooks/useDescriptorAttributesPartyOwnership'

const REQUESTER_TENANT_ID = 'requester-tenant-id'

const mockQueries = ({
  agreements = [],
  isLoading = false,
  upgradeableAgreement = undefined,
}: {
  agreements?: Array<AgreementListEntry>
  isLoading?: boolean
  upgradeableAgreement?: Agreement | undefined
}) => {
  ;(useQuery as Mock).mockImplementation((options: { queryKey: ReadonlyArray<unknown> }) => {
    if (options.queryKey[0] === 'AgreementGetConsumerAgreementsList') {
      return { data: agreements, isLoading }
    }
    return { data: upgradeableAgreement }
  })
}

const mockAttributesOwnership = ({
  hasAllCertifiedAttributes = true,
  hasAllDeclaredAttributes = true,
  hasAllVerifiedAttributes = true,
} = {}) => {
  ;(useDescriptorAttributesPartyOwnership as Mock).mockReturnValue({
    hasAllCertifiedAttributes,
    hasAllDeclaredAttributes,
    hasAllVerifiedAttributes,
  })
}

function renderUseRequesterEserviceAgreementHook(
  params?: Partial<Parameters<typeof useRequesterEserviceAgreement>[0]>
) {
  return renderHookWithApplicationContext(
    () =>
      useRequesterEserviceAgreement({
        eserviceId: 'eservice-id',
        activeDescriptorId: 'active-descriptor-id',
        requesterTenantId: REQUESTER_TENANT_ID,
        isReviewer: false,
        ...params,
      }),
    { withReactQueryContext: true }
  )
}

beforeEach(() => {
  mockAttributesOwnership()
})

describe('useRequesterEserviceAgreement', () => {
  it('returns undefined for a reviewer (the agreements query is disabled, no data and not loading)', () => {
    mockQueries({ agreements: [], isLoading: false })
    const { result } = renderUseRequesterEserviceAgreementHook({ isReviewer: true })
    expect(result.current).toBeUndefined()
  })

  it('blocks subscribe while the agreements query is still loading', () => {
    mockQueries({ agreements: [], isLoading: true })
    const { result } = renderUseRequesterEserviceAgreementHook()
    expect(result.current).toEqual({ blocksSubscribe: true, upgrade: undefined })
  })

  it('returns undefined when the requester has no blocking agreement', () => {
    mockQueries({
      agreements: [
        createMockAgreementListingItem({
          id: 'archived-id',
          consumer: { id: REQUESTER_TENANT_ID },
          state: 'ARCHIVED',
          canBeUpgraded: false,
        }),
      ],
    })
    const { result } = renderUseRequesterEserviceAgreementHook()
    expect(result.current).toBeUndefined()
  })

  it('blocks subscribe without an upgrade when the blocking agreement is not upgradeable', () => {
    mockQueries({
      agreements: [
        createMockAgreementListingItem({
          id: 'agreement-id',
          consumer: { id: REQUESTER_TENANT_ID },
          state: 'ACTIVE',
          canBeUpgraded: false,
        }),
      ],
    })
    const { result } = renderUseRequesterEserviceAgreementHook()
    expect(result.current).toEqual({ blocksSubscribe: true, upgrade: undefined })
  })

  it('returns the upgrade payload when the requester has an upgradeable agreement and owns all attributes', () => {
    const upgradeableAgreement = createMockAgreement({
      id: 'upgradeable-id',
      state: 'ACTIVE',
      eservice: { version: '1', activeDescriptor: { state: 'PUBLISHED', version: '2' } },
    })
    mockQueries({
      agreements: [
        createMockAgreementListingItem({
          id: 'upgradeable-id',
          consumer: { id: REQUESTER_TENANT_ID },
          state: 'ACTIVE',
          canBeUpgraded: true,
        }),
      ],
      upgradeableAgreement,
    })
    const { result } = renderUseRequesterEserviceAgreementHook()
    expect(result.current).toEqual({
      blocksSubscribe: true,
      upgrade: {
        agreement: upgradeableAgreement,
        hasMissingAttributes: false,
        hasAllCertifiedAttributes: true,
      },
    })
  })

  it('flags missing attributes in the upgrade payload when the requester does not own them', () => {
    const upgradeableAgreement = createMockAgreement({
      id: 'upgradeable-id',
      state: 'ACTIVE',
      eservice: { version: '1', activeDescriptor: { state: 'PUBLISHED', version: '2' } },
    })
    mockAttributesOwnership({
      hasAllCertifiedAttributes: false,
      hasAllDeclaredAttributes: false,
      hasAllVerifiedAttributes: true,
    })
    mockQueries({
      agreements: [
        createMockAgreementListingItem({
          id: 'upgradeable-id',
          consumer: { id: REQUESTER_TENANT_ID },
          state: 'ACTIVE',
          canBeUpgraded: true,
        }),
      ],
      upgradeableAgreement,
    })
    const { result } = renderUseRequesterEserviceAgreementHook()
    expect(result.current).toEqual({
      blocksSubscribe: true,
      upgrade: {
        agreement: upgradeableAgreement,
        hasMissingAttributes: true,
        hasAllCertifiedAttributes: false,
      },
    })
  })
})
