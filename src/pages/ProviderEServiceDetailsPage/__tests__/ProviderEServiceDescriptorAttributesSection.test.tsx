import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

let isTemplateInstance = false

vi.mock('@tanstack/react-query', async () => {
  const actual = (await vi.importActual('@tanstack/react-query')) as Record<string, unknown>
  return {
    ...actual,
    useSuspenseQuery: () => ({
      data: {
        ...descriptorMock,
        templateRef: isTemplateInstance ? { templateVersionId: 'template-version-id' } : undefined,
      },
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
    isTemplateInstance = false
    mockUseJwt({ currentRoles: ['admin'], isAdmin: true, isViewer: false })
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

  it('shows the threshold edit action for admin users', () => {
    renderWithApplicationContext(<ProviderEServiceDescriptorAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('modify')).toBeInTheDocument()
  })

  it('hides the threshold actions for viewer users', async () => {
    const user = userEvent.setup()
    mockUseJwt({ isAdmin: false, isViewer: true })
    renderWithApplicationContext(<ProviderEServiceDescriptorAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(screen.queryByText('modify')).not.toBeInTheDocument()

    await user.click(screen.getByLabelText('iconButtonAriaLabel'))
    expect(
      screen.queryByRole('menuitem', { name: 'actions.removeThreshold' })
    ).not.toBeInTheDocument()
  })

  it('removes a customized threshold after confirmation', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<ProviderEServiceDescriptorAttributesSection />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByLabelText('iconButtonAriaLabel'))
    await user.click(screen.getByRole('menuitem', { name: 'actions.removeThreshold' }))

    expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'confirm' }))

    expect(useUpdateVersion).toHaveBeenCalledOnce()
    expect(useUpdateVersion.mock.calls[0][0].attributes.certified[0][0]).toEqual(
      expect.objectContaining({ dailyCallsPerConsumer: undefined })
    )
  })

  it('removes a customized threshold from a template instance', async () => {
    const user = userEvent.setup()
    isTemplateInstance = true
    renderWithApplicationContext(<ProviderEServiceDescriptorAttributesSection />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByLabelText('iconButtonAriaLabel'))
    await user.click(screen.getByRole('menuitem', { name: 'actions.removeThreshold' }))
    await user.click(screen.getByRole('button', { name: 'confirm' }))

    expect(useUpdateInstanceVersion).toHaveBeenCalledOnce()
    expect(useUpdateInstanceVersion.mock.calls[0][0].attributes.certified[0][0]).toEqual(
      expect.objectContaining({ dailyCallsPerConsumer: undefined })
    )
  })

  it('does not remove a customized threshold when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<ProviderEServiceDescriptorAttributesSection />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByLabelText('iconButtonAriaLabel'))
    await user.click(screen.getByRole('menuitem', { name: 'actions.removeThreshold' }))
    await user.click(screen.getByRole('button', { name: 'cancel' }))

    expect(useUpdateVersion).not.toHaveBeenCalled()
    expect(useUpdateInstanceVersion).not.toHaveBeenCalled()
  })
})
