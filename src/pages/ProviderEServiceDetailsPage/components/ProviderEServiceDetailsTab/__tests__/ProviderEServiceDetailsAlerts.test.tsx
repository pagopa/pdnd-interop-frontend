import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProviderEServiceDetailsAlerts } from '../ProviderEServiceDetailsAlerts'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
} from '@/../__mocks__/data/eservice.mocks'

const renderAlerts = (
  descriptor: ProducerEServiceDescriptor | undefined,
  onViewKeychains?: VoidFunction
) =>
  renderWithApplicationContext(
    <ProviderEServiceDetailsAlerts descriptor={descriptor} onViewKeychains={onViewKeychains} />,
    {
      withRouterContext: true,
    }
  )

describe('ProviderEServiceDetailsAlerts', () => {
  it('renders nothing when descriptor is undefined', () => {
    const { container } = renderAlerts(undefined)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the descriptor state has no matching alert spec (PUBLISHED)', () => {
    const { container } = renderAlerts(createMockEServiceDescriptorProvider({ state: 'PUBLISHED' }))
    expect(container).toBeEmptyDOMElement()
  })

  it('renders an alert with error severity when state is SUSPENDED', () => {
    renderAlerts(createMockEServiceDescriptorProvider({ state: 'SUSPENDED' }))
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardError/)
  })

  it('renders an alert with info severity when state is ARCHIVED + scope ESERVICE', () => {
    renderAlerts(
      createMockEServiceDescriptorProvider({
        state: 'ARCHIVED',
        archivingSchedule: { scope: 'ESERVICE' },
        archivedAt: '2026-12-01T00:00:00.000Z',
      })
    )
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardInfo/)
  })

  it('renders an alert with error severity when state is ARCHIVING_SUSPENDED + scope DESCRIPTOR', () => {
    renderAlerts(
      createMockEServiceDescriptorProvider({
        state: 'ARCHIVING_SUSPENDED',
        archivingSchedule: { scope: 'DESCRIPTOR', archivableOn: '2026-12-01T00:00:00.000Z' },
      })
    )
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardError/)
  })

  it('shows a warning when an async eservice has no associated producer keychain', () => {
    renderAlerts(
      createMockEServiceDescriptorProviderAsync({
        eservice: {
          hasProducerKeychain: false,
          hasProducerKeychainKeys: false,
        },
      })
    )
    expect(screen.getByText('providerMissingProducerKeychain')).toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('shows a warning when an async eservice has an associated producer keychain without keys', () => {
    renderAlerts(
      createMockEServiceDescriptorProviderAsync({
        eservice: {
          hasProducerKeychain: true,
          hasProducerKeychainKeys: false,
        },
      })
    )
    expect(screen.getByText('providerMissingProducerKeychainKeys')).toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychain')).not.toBeInTheDocument()
  })

  it('calls the keychains tab action from producer keychain alerts', async () => {
    const onViewKeychains = vi.fn()
    renderAlerts(
      createMockEServiceDescriptorProviderAsync({
        eservice: {
          hasProducerKeychain: true,
          hasProducerKeychainKeys: false,
        },
      }),
      onViewKeychains
    )

    await userEvent.click(screen.getByRole('button', { name: 'viewProducerKeychains' }))

    expect(onViewKeychains).toHaveBeenCalledTimes(1)
  })

  it('does not show producer keychain warnings when an async eservice has a keychain with keys', () => {
    renderAlerts(
      createMockEServiceDescriptorProviderAsync({
        eservice: {
          hasProducerKeychain: true,
          hasProducerKeychainKeys: true,
        },
      })
    )
    expect(screen.queryByText('providerMissingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychainKeys')).not.toBeInTheDocument()
  })

  it('does not show producer keychain warnings for sync eservices', () => {
    renderAlerts(
      createMockEServiceDescriptorProvider({
        eservice: {
          asyncExchange: false,
          hasProducerKeychain: false,
          hasProducerKeychainKeys: false,
        },
      })
    )
    expect(screen.queryByText('providerMissingProducerKeychain')).not.toBeInTheDocument()
    expect(screen.queryByText('providerMissingProducerKeychainKeys')).not.toBeInTheDocument()
  })
})
