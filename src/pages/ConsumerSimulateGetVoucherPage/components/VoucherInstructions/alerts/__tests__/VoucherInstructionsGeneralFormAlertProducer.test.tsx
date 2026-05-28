import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { VoucherInstructionsGeneralFormAlertProducer } from '../VoucherInstructionsGeneralFormAlertProducer'
import { useNavigate } from '@/router'
import type { CompactEService, ProducerKeychain, PublicKey } from '@/api/api.generatedTypes'

vi.mock('@/router', () => ({
  useNavigate: vi.fn(),
}))

const useNavigateMock = vi.mocked(useNavigate)
const navigateMock = vi.fn()

const baseProps = {
  producerKeychain: { id: 'kc-1', name: 'Keychain' } as ProducerKeychain,
  producerKeychainId: 'kc-1',
  isFetchingPublicKey: false,
  isFetchingEservices: false,
  eservices: [] as CompactEService[],
  publicKeys: [] as PublicKey[],
}

describe('VoucherInstructionsGeneralFormAlertProducer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNavigateMock.mockReturnValue(navigateMock)
  })

  it('returns null when producerKeychainId is null', () => {
    const { container } = render(
      <VoucherInstructionsGeneralFormAlertProducer {...baseProps} producerKeychainId={null} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders noEServicesAndPublicKeysLabel when no eservices and no keys', () => {
    render(
      <VoucherInstructionsGeneralFormAlertProducer {...baseProps} eservices={[]} publicKeys={[]} />
    )

    expect(screen.getByText('noEServicesAndPublicKeysLabel.title')).toBeInTheDocument()
    expect(screen.getByText('noEServicesAndPublicKeysLabel.description')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders noEServicesLabel when only eservices are missing', () => {
    render(
      <VoucherInstructionsGeneralFormAlertProducer
        {...baseProps}
        eservices={[]}
        publicKeys={[
          {
            keyId: 'key-1',
            name: 'keyName',
            user: { userId: 'u1', name: 'Name', familyName: 'Surname' },
            createdAt: new Date().toString(),
            isOrphan: false,
          },
        ]}
      />
    )

    expect(screen.getByText('noEServicesLabel.title')).toBeInTheDocument()
    expect(screen.getByText('noEServicesLabel.description')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders noPublicKeysLabel when only public keys are missing', () => {
    render(
      <VoucherInstructionsGeneralFormAlertProducer
        {...baseProps}
        eservices={[
          {
            id: 'es-1',
            name: 'Service',
            producer: { id: 'p1', name: 'Producer' },
          },
        ]}
        publicKeys={[]}
      />
    )

    expect(screen.getByText('noPublicKeysLabel.title')).toBeInTheDocument()
    expect(screen.getByText('noPublicKeysLabel.description')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
