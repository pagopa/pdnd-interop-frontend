import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { VoucherInstructionsGeneralFormAlertConsumer } from '../VoucherInstructionsGeneralFormAlertConsumer'
import type { Client, ClientPurpose, PublicKey } from '@/api/api.generatedTypes'

const useClientKindMock = vi.fn()
const useNavigateMock = vi.fn()
const useJwtMock = vi.fn()

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => useClientKindMock(),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => useJwtMock(),
  },
}))

vi.mock('@/router', () => ({
  useNavigate: () => useNavigateMock(),
}))

const navigateMock = vi.fn()

const baseProps = {
  client: { id: 'client-1', name: 'ClientName' } as Client,
  clientId: 'client-1',
  isFetchingClient: false,
  isFetchingKeys: false,
  purposes: [] as ClientPurpose[],
  clientKeys: [] as PublicKey[],
}

describe('VoucherInstructionsGeneralFormAlertConsumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNavigateMock.mockReturnValue(navigateMock)

    useJwtMock.mockReturnValue({
      isAdmin: false,
      jwt: undefined,
      currentRoles: [],
      isOperatorAPI: false,
      isOperatorSecurity: false,
      isSupport: false,
      isOrganizationAllowedToProduce: false,
      isOrganizationAllowedToDelegations: false,
      userEmail: undefined,
    })
  })

  it('returns null when clientId is null', () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    const { container } = render(
      <VoucherInstructionsGeneralFormAlertConsumer {...baseProps} clientId={null} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders noPurposesAndKeysLabel when no purposes and no keys', () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    render(
      <VoucherInstructionsGeneralFormAlertConsumer {...baseProps} purposes={[]} clientKeys={[]} />
    )

    expect(screen.getByText('noPurposesAndKeysLabel.title')).toBeInTheDocument()
    expect(screen.getByText('noPurposesAndKeysLabel.description')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders admin noPurposes label with action', () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    useJwtMock.mockReturnValue({
      isAdmin: true,
      jwt: undefined,
      currentRoles: [],
      isOperatorAPI: false,
      isOperatorSecurity: false,
      isSupport: false,
      isOrganizationAllowedToProduce: false,
      isOrganizationAllowedToDelegations: false,
      userEmail: undefined,
    })

    render(
      <VoucherInstructionsGeneralFormAlertConsumer
        {...baseProps}
        purposes={[]}
        clientKeys={[
          {
            keyId: 'key-1',
            name: 'keyName',
            user: { userId: 'user-1', name: 'UserName', familyName: 'UserFamilyName' },
            createdAt: new Date().toString(),
            isOrphan: false,
          },
        ]}
      />
    )

    expect(screen.getByText('noPurposesLabelAdmin.title')).toBeInTheDocument()
    expect(screen.getByText('noPurposesLabelAdmin.description')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders security noPurposes label without action', () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    render(
      <VoucherInstructionsGeneralFormAlertConsumer
        {...baseProps}
        purposes={[]}
        clientKeys={[
          {
            keyId: 'key-1',
            name: 'keyName',
            user: { userId: 'user-1', name: 'UserName', familyName: 'UserFamilyName' },
            createdAt: new Date().toString(),
            isOrphan: false,
          },
        ]}
      />
    )

    expect(screen.getByText('noPurposesLabelSecurity.title')).toBeInTheDocument()
    expect(screen.getByText('noPurposesLabelSecurity.description')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders noKeysLabel when only keys are missing', () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    render(
      <VoucherInstructionsGeneralFormAlertConsumer
        {...baseProps}
        purposes={[
          {
            purposeId: 'purpose-1',
            title: 'PurposeTitle',
            eservice: {
              id: 'eservice-1',
              name: 'EsserviceName',
              producer: {
                id: 'producer-1',
                name: 'ProducerName',
              },
            },
          },
        ]}
        clientKeys={[]}
      />
    )

    expect(screen.getByText('noKeysLabel.title')).toBeInTheDocument()
    expect(screen.getByText('noKeysLabel.description')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
