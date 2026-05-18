import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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

    expect(screen.getByText('missingProducerKeychain')).toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('shows a warning when an async eservice has an associated producer keychain without keys', () => {
    const descriptor = createMockEServiceDescriptorProviderAsync({
      eservice: {
        hasProducerKeychain: true,
        hasProducerKeychainKeys: false,
      },
    })

    renderWithApplicationContext(<ProviderEServiceDetailsAlerts descriptor={descriptor} />, {})

    expect(screen.getByText('missingProducerKeychainKeys')).toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychain')).not.toBeInTheDocument()
  })

  it('does not show producer keychain warnings when an async eservice has a keychain with keys', () => {
    const descriptor = createMockEServiceDescriptorProviderAsync({
      eservice: {
        hasProducerKeychain: true,
        hasProducerKeychainKeys: true,
      },
    })

    renderWithApplicationContext(<ProviderEServiceDetailsAlerts descriptor={descriptor} />, {})

    expect(screen.queryByText('missingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychainKeys')).not.toBeInTheDocument()
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

    expect(screen.queryByText('missingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychainKeys')).not.toBeInTheDocument()
  })
})
