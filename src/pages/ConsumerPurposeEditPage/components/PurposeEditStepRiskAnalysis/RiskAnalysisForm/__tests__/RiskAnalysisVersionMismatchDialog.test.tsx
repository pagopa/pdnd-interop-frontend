import React from 'react'
import { render } from '@testing-library/react'
import { RiskAnalysisVersionMismatchDialog } from '../RiskAnalysisVersionMismatchDialog'
import { vi } from 'vitest'

describe('RiskAnalysisVersionMismatchDialog', () => {
  it('should match snapshot', () => {
    const screen = render(
      <RiskAnalysisVersionMismatchDialog onProceed={vi.fn()} onRefuse={vi.fn()} />
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should call onProceed when clicking on proceed button', () => {
    const onProceed = vi.fn()
    const screen = render(
      <RiskAnalysisVersionMismatchDialog onProceed={onProceed} onRefuse={vi.fn()} />
    )
    screen.getByRole('button', { name: 'proceedButtonLabel' }).click()
    expect(onProceed).toHaveBeenCalled()
  })

  it('should call onRefuse when clicking on refuse button', () => {
    const onRefuse = vi.fn()
    const screen = render(
      <RiskAnalysisVersionMismatchDialog onProceed={vi.fn()} onRefuse={onRefuse} />
    )
    screen.getByRole('button', { name: 'cancelButtonLabel' }).click()
    expect(onRefuse).toHaveBeenCalled()
  })
})
