import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerEServiceDetailsAlerts } from '../ConsumerEServiceDetailsAlerts'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockCatalogDescriptorEService,
  createMockEServiceDescriptorCatalog,
} from '@/../__mocks__/data/eservice.mocks'

const renderAlerts = (descriptor: CatalogEServiceDescriptor | undefined) =>
  renderWithApplicationContext(<ConsumerEServiceDetailsAlerts descriptor={descriptor} />, {
    withRouterContext: true,
  })

describe('ConsumerEServiceDetailsAlerts', () => {
  it('renders nothing when descriptor is undefined', () => {
    const { container } = renderAlerts(undefined)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the descriptor state has no matching alert spec (PUBLISHED)', () => {
    const { container } = renderAlerts(createMockEServiceDescriptorCatalog({ state: 'PUBLISHED' }))
    expect(container).toBeEmptyDOMElement()
  })

  it('renders an alert with error severity when state is SUSPENDED', () => {
    renderAlerts(createMockEServiceDescriptorCatalog({ state: 'SUSPENDED' }))
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardError/)
  })

  it('renders an alert with info severity when state is DEPRECATED', () => {
    renderAlerts(createMockEServiceDescriptorCatalog({ state: 'DEPRECATED' }))
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardInfo/)
  })

  it('renders an alert with info severity when state is ARCHIVING + scope DESCRIPTOR', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        state: 'ARCHIVING',
        archivingSchedule: { scope: 'DESCRIPTOR', archivableOn: '2026-12-01T00:00:00.000Z' },
      })
    )
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardInfo/)
  })

  it('renders an alert with error severity when state is ARCHIVING_SUSPENDED + scope ESERVICE', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        state: 'ARCHIVING_SUSPENDED',
        archivingSchedule: { scope: 'ESERVICE', archivableOn: '2026-12-01T00:00:00.000Z' },
      })
    )
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardError/)
  })

  it('shows a warning for async e-services without a producer keychain', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: createMockCatalogDescriptorEService({
          asyncExchange: true,
          hasProducerKeychain: false,
          hasProducerKeychainKeys: false,
        }),
      })
    )
    expect(screen.getByText('missingProducerKeychain')).toBeInTheDocument()
  })

  it('shows a warning for async e-services with a producer keychain but without keys', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: createMockCatalogDescriptorEService({
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: false,
        }),
      })
    )
    expect(screen.getByText('missingProducerKeychainKeys')).toBeInTheDocument()
  })

  it('does not show producer keychain warnings when async data exchange is available', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: createMockCatalogDescriptorEService({
          asyncExchange: true,
          hasProducerKeychain: true,
          hasProducerKeychainKeys: true,
        }),
      })
    )
    expect(screen.queryByText('missingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('does not show producer keychain warnings for sync e-services', () => {
    renderAlerts(
      createMockEServiceDescriptorCatalog({
        eservice: createMockCatalogDescriptorEService({
          asyncExchange: false,
          hasProducerKeychain: false,
          hasProducerKeychainKeys: false,
        }),
      })
    )
    expect(screen.queryByText('missingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('missingProducerKeychainKeys')).not.toBeInTheDocument()
  })
})
