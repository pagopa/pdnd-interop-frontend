import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ByDelegationChip, ByDelegationChipSkeleton } from '../ByDelegationChip'
import type { DelegationWithCompactTenants } from '@/api/api.generatedTypes'

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
  it('renders the default chip label when tenantRole is undefined', () => {
    render(<ByDelegationChip />)
    expect(screen.getByText('byDelegationChip.label.default')).toBeInTheDocument()
  })

  it('renders the delegator chip label when tenantRole is DELEGATOR', () => {
    render(<ByDelegationChip tenantRole="DELEGATOR" />)
    expect(screen.getByText('byDelegationChip.label.delegator')).toBeInTheDocument()
  })

  it('renders the delegate chip label when tenantRole is DELEGATE', () => {
    render(<ByDelegationChip tenantRole="DELEGATE" />)
    expect(screen.getByText('byDelegationChip.label.delegate')).toBeInTheDocument()
  })

  it('does not show a tooltip when delegation is not provided', () => {
    const { container } = render(<ByDelegationChip tenantRole="DELEGATOR" />)
    expect(container.querySelector('[aria-label]')).toBeNull()
  })

  it('renders the chip directly without a Tooltip wrapper when delegation is not provided', () => {
    const { container } = render(<ByDelegationChip tenantRole="DELEGATOR" />)
    // The chip must be the first child of the container — no Tooltip span wrapper
    expect(container.firstElementChild).toHaveClass('MuiChip-root')
  })

  it('shows the delegator tooltip with the delegate name when tenantRole is DELEGATOR and delegation is provided', () => {
    render(<ByDelegationChip tenantRole="DELEGATOR" delegation={mockDelegation} />)
    expect(
      screen.getByLabelText('delegationTooltip.label.delegator:Ente Delegato')
    ).toBeInTheDocument()
  })

  it('shows the delegate tooltip with the delegator name when tenantRole is DELEGATE and delegation is provided', () => {
    render(<ByDelegationChip tenantRole="DELEGATE" delegation={mockDelegation} />)
    expect(
      screen.getByLabelText('delegationTooltip.label.delegate:Ente Delegante')
    ).toBeInTheDocument()
  })

  it('shows the default tooltip when tenantRole is undefined and delegation is provided', () => {
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
