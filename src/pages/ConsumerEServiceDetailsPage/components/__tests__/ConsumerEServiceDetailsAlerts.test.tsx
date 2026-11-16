import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import { ConsumerEServiceDetailsAlerts } from '../ConsumerEServiceDetailsAlerts'

const renderAlerts = (
  descriptor: ReturnType<typeof createMockEServiceDescriptorCatalog> | undefined
) =>
  renderWithApplicationContext(<ConsumerEServiceDetailsAlerts descriptor={descriptor} />, {
    withRouterContext: true,
  })

describe('ConsumerEServiceDetailsAlerts', () => {
  it('renders nothing when the descriptor is unavailable or has no alert', () => {
    const empty = renderAlerts(undefined)
    expect(empty.container).toBeEmptyDOMElement()

    const published = renderAlerts(createMockEServiceDescriptorCatalog({ state: 'PUBLISHED' }))
    expect(published.container).toBeEmptyDOMElement()
  })

  it('renders the descriptor state alert', () => {
    renderAlerts(createMockEServiceDescriptorCatalog({ state: 'SUSPENDED' }))

    expect(screen.getByRole('alert')).toHaveClass(/MuiAlert-standardError/)
  })

  it('warns when an async e-service has no producer keychain', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: { asyncExchange: true, hasProducerKeychain: false },
      })
    )

    expect(screen.getByText('missingProducerKeychain')).toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('warns when an async e-service producer keychain has no keys', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: {
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: false,
        },
      })
    )

    expect(screen.getByText('missingProducerKeychainKeys')).toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychain')).not.toBeInTheDocument()
  })

  it('does not warn when a sync e-service or a complete keychain is used', () => {
    const sync = renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: { asyncExchange: false, hasProducerKeychain: false },
      })
    )
    expect(sync.container).toBeEmptyDOMElement()

    const complete = renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: {
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: true,
        },
      })
    )
    expect(complete.container).toBeEmptyDOMElement()
  })
})
