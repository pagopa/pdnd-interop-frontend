import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ByDelegationChip, ByDelegationChipSkeleton } from '../ByDelegationChip'
import type { DelegationWithCompactTenants } from '@/api/api.generatedTypes'

const mockUseJwt = vi.fn(() => ({ jwt: { organizationId: 'delegator-id' } }))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => mockUseJwt(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (_ns: string, opts?: { keyPrefix?: string }) => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const full = opts?.keyPrefix ? `${opts.keyPrefix}.${key}` : key
      if (params?.delegate) return `${full}:${params.delegate}`
      if (params?.delegator) return `${full}:${params.delegator}`
      return full
    },
    i18n: { language: 'it', changeLanguage: vi.fn() },
  }),
}))

const mockDelegation: DelegationWithCompactTenants = {
  id: 'delegation-1',
  delegator: { id: 'delegator-id', name: 'Ente Delegante' },
  delegate: { id: 'delegate-id', name: 'Ente Delegato' },
}

describe('ByDelegationChip', () => {
  it('renders the default chip label when delegation is undefined', () => {
    render(<ByDelegationChip />)
    expect(screen.getByText('byDelegationChip.label.default')).toBeInTheDocument()
  })

  it('renders the delegator chip label when jwt organization matches delegator', () => {
    render(<ByDelegationChip delegation={mockDelegation} />)
    expect(screen.getByText('byDelegationChip.label.delegator')).toBeInTheDocument()
  })

  it('renders the delegate chip label when jwt organization matches delegate', () => {
    mockUseJwt.mockReturnValueOnce({ jwt: { organizationId: 'delegate-id' } })
    render(<ByDelegationChip delegation={mockDelegation} />)
    expect(screen.getByText('byDelegationChip.label.delegate')).toBeInTheDocument()
  })

  it('does not show a tooltip when delegation is not provided', () => {
    const { container } = render(<ByDelegationChip />)
    expect(container.querySelector('[aria-label]')).toBeNull()
  })

  it('renders the chip directly without a Tooltip wrapper when delegation is not provided', () => {
    const { container } = render(<ByDelegationChip />)
    // The chip must be the first child of the container — no Tooltip span wrapper
    expect(container.firstElementChild).toHaveClass('MuiChip-root')
  })

  it('shows the delegator tooltip with the delegate name when jwt organization matches delegator', () => {
    render(<ByDelegationChip delegation={mockDelegation} />)
    expect(
      screen.getByLabelText('delegationTooltip.label.delegator:Ente Delegato')
    ).toBeInTheDocument()
  })

  it('shows the delegate tooltip with the delegator name when jwt organization matches delegate', () => {
    mockUseJwt.mockReturnValueOnce({ jwt: { organizationId: 'delegate-id' } })
    render(<ByDelegationChip delegation={mockDelegation} />)
    expect(
      screen.getByLabelText('delegationTooltip.label.delegate:Ente Delegante')
    ).toBeInTheDocument()
  })

  it('shows the default tooltip when jwt organization matches neither delegate nor delegator', () => {
    mockUseJwt.mockReturnValueOnce({ jwt: { organizationId: 'unknown-org-id' } })
    render(<ByDelegationChip delegation={mockDelegation} />)
    expect(screen.getByLabelText('delegationTooltip.label.default')).toBeInTheDocument()
  })
})

describe('ByDelegationChipSkeleton', () => {
  it('renders a skeleton placeholder', () => {
    const { container } = render(<ByDelegationChipSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument()
  })
})
