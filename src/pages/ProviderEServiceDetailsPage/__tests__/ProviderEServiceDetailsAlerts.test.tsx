import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
} from '../../../../__mocks__/data/eservice.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ProviderEServiceDetailsAlerts } from '../components/ProviderEServiceDetailsTab/ProviderEServiceDetailsAlerts'

describe('ProviderEServiceDetailsAlerts', () => {
  it('shows a warning when an async eservice has no associated producer keychain', () => {
    const descriptor = createMockEServiceDescriptorProviderAsync({
      eservice: {
        hasProducerKeychain: false,
        hasProducerKeychainKeys: false,
      },
    })

    renderWithApplicationContext(<ProviderEServiceDetailsAlerts descriptor={descriptor} />, {})

    expect(screen.getByText('providerMissingProducerKeychain')).toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('shows a warning when an async eservice has an associated producer keychain without keys', () => {
    const descriptor = createMockEServiceDescriptorProviderAsync({
      eservice: {
        hasProducerKeychain: true,
        hasProducerKeychainKeys: false,
      },
    })

    renderWithApplicationContext(<ProviderEServiceDetailsAlerts descriptor={descriptor} />, {})

    expect(screen.getByText('providerMissingProducerKeychainKeys')).toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychain')).not.toBeInTheDocument()
  })

  it('calls the keychains tab action from producer keychain alerts', async () => {
    const descriptor = createMockEServiceDescriptorProviderAsync({
      eservice: {
        hasProducerKeychain: true,
        hasProducerKeychainKeys: false,
      },
    })
    const onViewKeychains = vi.fn()

    renderWithApplicationContext(
      <ProviderEServiceDetailsAlerts descriptor={descriptor} onViewKeychains={onViewKeychains} />,
      {}
    )

    await userEvent.click(screen.getByRole('button', { name: 'viewProducerKeychains' }))

    expect(onViewKeychains).toHaveBeenCalledTimes(1)
  })

  it('does not show producer keychain warnings when an async eservice has a keychain with keys', () => {
    const descriptor = createMockEServiceDescriptorProviderAsync({
      eservice: {
        hasProducerKeychain: true,
        hasProducerKeychainKeys: true,
      },
    })

    renderWithApplicationContext(<ProviderEServiceDetailsAlerts descriptor={descriptor} />, {})

    expect(screen.queryByText('providerMissingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('does not show producer keychain warnings for sync eservices', () => {
    const descriptor = createMockEServiceDescriptorProvider({
      eservice: {
        asyncExchange: false,
        hasProducerKeychain: false,
        hasProducerKeychainKeys: false,
      },
    })

    renderWithApplicationContext(<ProviderEServiceDetailsAlerts descriptor={descriptor} />, {})

    expect(screen.queryByText('providerMissingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychainKeys')).not.toBeInTheDocument()
  })
})
