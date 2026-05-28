import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerEServiceDetailsAlerts } from '../ConsumerEServiceDetailsAlerts'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const makeDescriptor = (
  overrides: Partial<CatalogEServiceDescriptor> = {}
): CatalogEServiceDescriptor =>
  ({
    id: 'descriptor-1',
    state: 'PUBLISHED',
    version: '1',
    audience: ['aud'],
    voucherLifespan: 60,
    dailyCallsPerConsumer: 100,
    dailyCallsTotal: 1000,
    serverUrls: [],
    docs: [],
    interface: undefined,
    eservice: {} as CatalogEServiceDescriptor['eservice'],
    attributes: { certified: [], declared: [], verified: [] },
    ...overrides,
  }) as unknown as CatalogEServiceDescriptor

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
    const { container } = renderAlerts(makeDescriptor({ state: 'PUBLISHED' }))
    expect(container).toBeEmptyDOMElement()
  })

  it('renders an alert with error severity when state is SUSPENDED', () => {
    renderAlerts(makeDescriptor({ state: 'SUSPENDED' }))
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardError/)
  })

  it('renders an alert with info severity when state is DEPRECATED', () => {
    renderAlerts(makeDescriptor({ state: 'DEPRECATED' }))
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardInfo/)
  })

  it('renders an alert with info severity when state is ARCHIVING + scope DESCRIPTOR', () => {
    renderAlerts(
      makeDescriptor({
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
      makeDescriptor({
        state: 'ARCHIVING_SUSPENDED',
        archivingSchedule: { scope: 'ESERVICE', archivableOn: '2026-12-01T00:00:00.000Z' },
      })
    )
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass(/MuiAlert-standardError/)
  })
})
