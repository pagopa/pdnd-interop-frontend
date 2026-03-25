import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { ProviderEServiceVoucherLifespanSection } from '../components/ProviderEServiceDetailsTab/ProviderEServiceTechnicalInfoSection/ProviderEServiceVoucherLifespanSection'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

mockUseJwt({ currentRoles: ['admin'], isAdmin: true })

const useUpdateVersion = vi.fn()
const useUpdateInstanceVersion = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateVersion: () => ({ mutate: useUpdateVersion }),
    useUpdateInstanceVersion: () => ({ mutate: useUpdateInstanceVersion }),
  },
}))

vi.mock('@/hooks/useGetProducerDelegationUserRole', () => ({
  useGetProducerDelegationUserRole: () => ({
    isDelegator: false,
  }),
}))

const openDrawer = vi.fn()
const closeDrawer = vi.fn()

vi.mock('@/hooks/useDrawerState', () => ({
  useDrawerState: () => ({
    isOpen: true,
    openDrawer,
    closeDrawer,
  }),
}))

const onSubmitMockRef: { current?: Function } = {}

vi.mock('@/components/shared/UpdateVoucherDrawer', () => ({
  UpdateVoucherDrawer: (props: {
    isEserviceFromTemplate?: boolean
    isOpen: boolean
    onClose: VoidFunction
    id: string
    subtitle: string
    voucherLifespan: number
    versionId?: string
    onSubmit: (id: string, voucherLifespan: number, versionId?: string) => void
  }) => {
    onSubmitMockRef.current = props.onSubmit
    return <div data-testid="update-voucher-drawer" />
  },
}))

vi.mock('@/utils/format.utils', () => ({
  secondsToMinutes: (value: number) => value / 60,
}))

const descriptorMock: ProducerEServiceDescriptor = {
  id: 'descriptor-1',
  voucherLifespan: 600,
  dailyCallsPerConsumer: 100,
  dailyCallsTotal: 1000,
  templateRef: undefined,
  eservice: {
    id: 'eservice-1',
    name: '',
    description: '',
    producer: { id: '1', tenantKind: 'PA' },
    technology: 'REST',
    mode: 'DELIVER',
    riskAnalysis: [],
    descriptors: [],
  },
  version: '',
  docs: [],
  state: 'DRAFT',
  audience: [],
  agreementApprovalPolicy: 'AUTOMATIC',
  attributes: {
    certified: [
      [
        {
          id: 'attr-1',
          name: 'Attribute 1',
          description: 'desc 1',
          explicitAttributeVerification: false,
        },
      ],
    ],
    declared: [],
    verified: [],
  },
}

describe('ProviderEServiceVoucherLifespanSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders voucher lifespan correctly', () => {
    renderWithApplicationContext(
      <ProviderEServiceVoucherLifespanSection descriptor={descriptorMock} />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('thresholds.voucherLifespan.label')).toBeInTheDocument()
    expect(screen.getByText(/10/)).toBeInTheDocument()
  })

  it('shows edit button when user is not delegator', () => {
    renderWithApplicationContext(
      <ProviderEServiceVoucherLifespanSection descriptor={descriptorMock} />,
      { withReactQueryContext: true }
    )

    const editButton = screen.getByText('actions.edit')
    expect(editButton).toBeInTheDocument()

    fireEvent.click(editButton)
    expect(openDrawer).toHaveBeenCalled()
  })

  it('calls updateVersion when submitting and is not from template', () => {
    renderWithApplicationContext(
      <ProviderEServiceVoucherLifespanSection descriptor={descriptorMock} />,
      { withReactQueryContext: true }
    )

    onSubmitMockRef.current?.('eservice-1', 300, 'descriptor-1')

    expect(useUpdateVersion).toHaveBeenCalledWith(
      {
        eserviceId: 'eservice-1',
        descriptorId: 'descriptor-1',
        voucherLifespan: 300,
        dailyCallsPerConsumer: 100,
        dailyCallsTotal: 1000,
      },
      expect.any(Object)
    )

    expect(useUpdateInstanceVersion).not.toHaveBeenCalled()
  })

  it('calls updateInstanceVersion when submitting and is from template', () => {
    const templateDescriptor = {
      ...descriptorMock,
      templateRef: {
        templateId: 'template-id-1',
        templateName: 'template-name-1',
        templateInterface: undefined,
      },
    }

    renderWithApplicationContext(
      <ProviderEServiceVoucherLifespanSection descriptor={templateDescriptor} />,
      { withReactQueryContext: true }
    )

    onSubmitMockRef.current?.('eservice-1', 300, 'descriptor-1')

    expect(useUpdateInstanceVersion).toHaveBeenCalledWith(
      {
        eserviceId: 'eservice-1',
        descriptorId: 'descriptor-1',
        dailyCallsPerConsumer: 100,
        dailyCallsTotal: 1000,
      },
      expect.any(Object)
    )

    expect(useUpdateVersion).not.toHaveBeenCalled()
  })
})
