import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProviderEServiceDescriptorAttributesSection } from '../components/ProviderEServiceDetailsTab/ProviderEServiceDescriptorAttributesSection'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

mockUseJwt({ currentRoles: ['admin'], isAdmin: true })

const mockNavigate = vi.fn()
vi.mock('@/router', () => ({
  useParams: vi.fn(() => ({
    eserviceId: 'eservice-id-123',
    descriptorId: 'descriptor-id-123',
  })),
  useNavigate: vi.fn(() => mockNavigate),
  useCurrentRoute: vi.fn(() => ({
    routeKey: 'PROVIDE_ESERVICE_LIST',
  })),
}))

vi.mock('@/hooks/useGetProducerDelegationUserRole', () => ({
  useGetProducerDelegationUserRole: () => ({
    isDelegator: false,
  }),
}))

const descriptorMock = {
  id: 'd1',
  audience: [],
  voucherLifespan: 10,
  dailyCallsPerConsumer: 100,
  dailyCallsTotal: 1000,
  agreementApprovalPolicy: 'AUTOMATIC',
  description: 'desc',
  templateRef: null,
  eservice: { id: 'e1' },
  attributes: {
    certified: [[{ id: 'a1', name: 'Attr 1', dailyCallsPerConsumer: 5 }]],
    verified: [],
    declared: [],
  },
}

vi.mock('@tanstack/react-query', async () => {
  const actual = (await vi.importActual('@tanstack/react-query')) as Record<string, unknown>
  return {
    ...actual,
    useSuspenseQuery: () => ({
      data: descriptorMock,
    }),
  }
})

const getDescriptorProvider = vi.fn()
const useUpdateVersion = vi.fn()
const useUpdateInstanceVersion = vi.fn()
const useUpdateVersionDraft = vi.fn()
const useUpdateDescriptorAttributes = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: () => ({ mutate: getDescriptorProvider }),
  },
  EServiceMutations: {
    useUpdateVersion: () => ({ mutate: useUpdateVersion }),
    useUpdateInstanceVersion: () => ({ mutate: useUpdateInstanceVersion }),
    useUpdateVersionDraft: () => ({ mutate: useUpdateVersionDraft }),
    useUpdateDescriptorAttributes: () => ({ mutate: useUpdateDescriptorAttributes }),
  },
}))

vi.mock('../components', () => ({
  UpdateAttributesDrawer: () => <div data-testid="update-attribute-drawer" />,
  UpdateDailyCallsDrawer: () => <div data-testid="update-daily-calls-drawer" />,
  CustomizeThresholdDrawer: () => <div data-testid="customize-threshold-drawer" />,
  AttributeGroupsListSection: () => <div data-testid="attribute-groups-list-section" />,
}))

describe('ProviderEServiceDescriptorAttributesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders thresholds correctly', () => {
    renderWithApplicationContext(<ProviderEServiceDescriptorAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('thresholds.dailyCallsPerConsumer.label')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()

    expect(screen.getByText('thresholds.dailyCallsTotal.label')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
  })
})
