import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConsumerAgreementVersionAlerts } from '../ConsumerAgreementVersionAlerts'
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
    eservice: { archivingReason: undefined } as CatalogEServiceDescriptor['eservice'],
    attributes: { certified: [], declared: [], verified: [] },
    ...overrides,
  }) as unknown as CatalogEServiceDescriptor

const renderAlerts = (descriptor: CatalogEServiceDescriptor | undefined) =>
  renderWithApplicationContext(<ConsumerAgreementVersionAlerts descriptor={descriptor} />, {
    withRouterContext: true,
  })

describe('ConsumerAgreementVersionAlerts', () => {
  it('renders nothing when descriptor is undefined', () => {
    const { container } = renderAlerts(undefined)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing for PUBLISHED state (no matching pattern)', () => {
    const { container } = renderAlerts(makeDescriptor({ state: 'PUBLISHED' }))
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a single info alert when state is DEPRECATED', () => {
    renderAlerts(makeDescriptor({ state: 'DEPRECATED' }))
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0]).toHaveClass(/MuiAlert-standardInfo/)
  })

  it('renders a single warning alert when state is ARCHIVING + scope DESCRIPTOR (no see-details action)', () => {
    renderAlerts(
      makeDescriptor({
        state: 'ARCHIVING',
        archivingSchedule: { scope: 'DESCRIPTOR', archivableOn: '2026-12-01T00:00:00.000Z' },
      })
    )
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0]).toHaveClass(/MuiAlert-standardWarning/)
    expect(screen.queryByRole('button', { name: 'seeDetails' })).toBeNull()
  })

  it('renders two alerts and a see-details button when state is ARCHIVING + scope ESERVICE', () => {
    renderAlerts(
      makeDescriptor({
        state: 'ARCHIVING',
        archivingSchedule: { scope: 'ESERVICE', archivableOn: '2026-12-01T00:00:00.000Z' },
      })
    )
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveClass(/MuiAlert-standardWarning/)
    expect(alerts[1]).toHaveClass(/MuiAlert-standardInfo/)
    expect(screen.getByRole('button', { name: 'seeDetails' })).toBeInTheDocument()
  })

  it('renders two alerts (error + warning) when state is ARCHIVING_SUSPENDED + scope ESERVICE', () => {
    renderAlerts(
      makeDescriptor({
        state: 'ARCHIVING_SUSPENDED',
        archivingSchedule: { scope: 'ESERVICE', archivableOn: '2026-12-01T00:00:00.000Z' },
      })
    )
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveClass(/MuiAlert-standardError/)
    expect(alerts[1]).toHaveClass(/MuiAlert-standardWarning/)
  })

  it('renders an error alert when state is SUSPENDED', () => {
    renderAlerts(makeDescriptor({ state: 'SUSPENDED' }))
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0]).toHaveClass(/MuiAlert-standardError/)
  })

  it('renders an error alert when state is ARCHIVED + scope DESCRIPTOR (default branch)', () => {
    renderAlerts(
      makeDescriptor({
        state: 'ARCHIVED',
        archivingSchedule: { scope: 'DESCRIPTOR' },
        archivedAt: '2026-12-01T00:00:00.000Z',
      })
    )
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0]).toHaveClass(/MuiAlert-standardError/)
  })

  it('opens the drawer when the see-details button is clicked (ARCHIVING_SUSPENDED + ESERVICE)', async () => {
    renderAlerts(
      makeDescriptor({
        state: 'ARCHIVING_SUSPENDED',
        archivingSchedule: { scope: 'ESERVICE', archivableOn: '2026-12-01T00:00:00.000Z' },
        eservice: {
          archivingReason: 'Mandato amministrativo',
        } as CatalogEServiceDescriptor['eservice'],
      })
    )
    await userEvent.click(screen.getByRole('button', { name: 'seeDetails' }))
    expect(screen.getByText('Mandato amministrativo')).toBeInTheDocument()
  })
})
