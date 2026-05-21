import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  createMockCatalogDescriptorEService,
  createMockEServiceDescriptorCatalog,
} from '@/../__mocks__/data/eservice.mocks'
import { ConsumerEServiceDetailsAlerts } from '../ConsumerEServiceDetailsAlerts'

const missingKeychainAlert = 'missingProducerKeychain'
const missingKeychainKeysAlert = 'missingProducerKeychainKeys'

function createDescriptor({
  asyncExchange,
  hasProducerKeychain,
  hasProducerKeychainKeys,
}: {
  asyncExchange: boolean
  hasProducerKeychain: boolean
  hasProducerKeychainKeys: boolean
}) {
  return createMockEServiceDescriptorCatalog({
    eservice: createMockCatalogDescriptorEService({
      asyncExchange,
      hasProducerKeychain,
      hasProducerKeychainKeys,
    }),
  })
}

describe('ConsumerEServiceDetailsAlerts', () => {
  it('should show a warning for async e-services without a producer keychain', () => {
    render(
      <ConsumerEServiceDetailsAlerts
        descriptor={createDescriptor({
          asyncExchange: true,
          hasProducerKeychain: false,
          hasProducerKeychainKeys: false,
        })}
      />
    )

    expect(screen.getByText(missingKeychainAlert)).toBeInTheDocument()
  })

  it('should show a warning for async e-services with a producer keychain but without keys', () => {
    render(
      <ConsumerEServiceDetailsAlerts
        descriptor={createDescriptor({
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: false,
        })}
      />
    )

    expect(screen.getByText(missingKeychainKeysAlert)).toBeInTheDocument()
  })

  it('should not show producer keychain warnings when async data exchange is available', () => {
    render(
      <ConsumerEServiceDetailsAlerts
        descriptor={createDescriptor({
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: true,
        })}
      />
    )

    expect(screen.queryByText(missingKeychainAlert)).not.toBeInTheDocument()
    expect(screen.queryByText(missingKeychainKeysAlert)).not.toBeInTheDocument()
  })

  it('should not show producer keychain warnings for sync e-services', () => {
    render(
      <ConsumerEServiceDetailsAlerts
        descriptor={createDescriptor({
          asyncExchange: false,
          hasProducerKeychain: false,
          hasProducerKeychainKeys: false,
        })}
      />
    )

    expect(screen.queryByText(missingKeychainAlert)).not.toBeInTheDocument()
    expect(screen.queryByText(missingKeychainKeysAlert)).not.toBeInTheDocument()
  })
})
