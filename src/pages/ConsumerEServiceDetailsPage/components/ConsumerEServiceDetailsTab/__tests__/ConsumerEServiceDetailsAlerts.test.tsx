import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerEServiceDetailsAlerts } from '../ConsumerEServiceDetailsAlerts'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'

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
})
