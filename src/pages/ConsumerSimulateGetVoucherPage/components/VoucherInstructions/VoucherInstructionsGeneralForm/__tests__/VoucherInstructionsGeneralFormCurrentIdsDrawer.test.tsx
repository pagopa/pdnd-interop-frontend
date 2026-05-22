import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsGeneralFormCurrentIdsDrawer } from '../VoucherInstructionsGeneralFormCurrentIdsDrawer'
import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, vi } from 'vitest'

const keychainMock = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: vi.fn(() => ({
      queryKey: ['purpose', 'purpose-1'],
      queryFn: async () => ({
        id: 'purpose-1',
        eservice: {
          id: 'purpose-eservice-1',
          descriptor: { id: 'descriptor-1' },
          producer: { id: 'producer-1' },
        },
        agreement: { id: 'agreement-1' },
        producer: { id: 'producer-1' },
        consumer: { id: 'consumer-1' },
      }),
    })),
  },
}))

vi.mock('@/api/keychain', () => ({
  KeychainQueries: {
    getSingle: (...args: unknown[]) => keychainMock(...args),
  },
}))

describe('VoucherInstructionsGeneralFormCurrentIdsDrawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    clientId: 'client-1',
    purposeId: 'purpose-1',
    eserviceId: 'eservice-1',
    producerKeychainId: 'keychain-1',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    keychainMock.mockReturnValue({
      queryKey: ['keychain', 'keychain-1'],
      queryFn: async () => ({
        id: 'keychain-1',
        producer: { id: 'keychain-producer-1' },
      }),
    })
  })

  it('renders title and subtitle', async () => {
    renderWithApplicationContext(
      <VoucherInstructionsGeneralFormCurrentIdsDrawer {...defaultProps} />,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('title')).toBeInTheDocument()
    expect(await screen.findByText('subtitle')).toBeInTheDocument()
  })

  it('renders purpose fields when data is present', async () => {
    renderWithApplicationContext(
      <VoucherInstructionsGeneralFormCurrentIdsDrawer {...defaultProps} />,
      { withReactQueryContext: true }
    )
    expect(await screen.findByText('purpose-eservice-1')).toBeInTheDocument()
    expect(await screen.findByText('client-1')).toBeInTheDocument()
    expect(await screen.findByText('purpose-1')).toBeInTheDocument()
    expect(await screen.findByText('agreement-1')).toBeInTheDocument()
    expect(await screen.findByText('producer-1')).toBeInTheDocument()
    expect(await screen.findByText('consumer-1')).toBeInTheDocument()
    expect(screen.queryByText('eservice-1')).not.toBeInTheDocument()
  })

  it('renders eserviceId, keychainId and producer keychain id props', async () => {
    renderWithApplicationContext(
      <VoucherInstructionsGeneralFormCurrentIdsDrawer {...defaultProps} purposeId="" />,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('keychain-1')).toBeInTheDocument()
    expect(await screen.findByText('eservice-1')).toBeInTheDocument()
    expect(await screen.findByText('keychain-producer-1')).toBeInTheDocument()
  })

  it('does not render keychain id, producer keychain id and eserviceId', async () => {
    keychainMock.mockReturnValueOnce({
      queryKey: ['keychain', 'empty'],
      queryFn: async () => ({
        id: '',
        producer: {
          id: '',
        },
      }),
    })

    renderWithApplicationContext(
      <VoucherInstructionsGeneralFormCurrentIdsDrawer
        {...defaultProps}
        purposeId=""
        eserviceId=""
        producerKeychainId=""
      />,
      { withReactQueryContext: true }
    )

    await waitFor(() => {
      expect(screen.queryByText('keychain-1')).not.toBeInTheDocument()
      expect(screen.queryByText('eservice-1')).not.toBeInTheDocument()
      expect(screen.queryByText('keychain-producer-1')).not.toBeInTheDocument()
    })
  })
})
