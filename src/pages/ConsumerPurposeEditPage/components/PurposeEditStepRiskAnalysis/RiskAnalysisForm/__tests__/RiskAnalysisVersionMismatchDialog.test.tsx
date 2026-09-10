import React from 'react'
import { render, screen } from '@testing-library/react'
import { RiskAnalysisVersionMismatchDialog } from '../RiskAnalysisVersionMismatchDialog'
import { vi } from 'vitest'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'

describe('RiskAnalysisVersionMismatchDialog', () => {
  it('should call onProceed when clicking on proceed button', () => {
    const onProceed = vi.fn()
    const result = render(
      <RiskAnalysisVersionMismatchDialog onProceed={onProceed} onRefuse={vi.fn()} />
    )
    result.getByRole('button', { name: 'proceedButtonLabel' }).click()
    expect(onProceed).toHaveBeenCalled()
  })

  it('should call onRefuse when clicking on refuse button', () => {
    const onRefuse = vi.fn()
    const result = render(
      <RiskAnalysisVersionMismatchDialog onProceed={vi.fn()} onRefuse={onRefuse} />
    )
    result.getByRole('button', { name: 'cancelButtonLabel' }).click()
    expect(onRefuse).toHaveBeenCalled()
  })

  it('should disable proceed button for support users', () => {
    render(
      <SupportActionGuardProvider isSupport>
        <RiskAnalysisVersionMismatchDialog onProceed={vi.fn()} onRefuse={vi.fn()} />
      </SupportActionGuardProvider>
    )

    expect(screen.getByRole('button', { name: 'proceedButtonLabel' })).toBeDisabled()
  })
})
