import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceDetailsAlerts } from '../ProviderEServiceDetailsAlerts'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

const renderAlerts = (descriptor: ProducerEServiceDescriptor | undefined) =>
  renderWithApplicationContext(<ProviderEServiceDetailsAlerts descriptor={descriptor} />, {
    withRouterContext: true,
  })

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
})
