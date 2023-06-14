import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import { createMockDebugVoucherResultStep } from '__mocks__/data/voucher.mocks'
import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import { DebugVoucherResultsStep } from '../DebugVoucherResultsStep'

describe('DebugVoucherResultsStep testing', () => {
  it('should match snapshot if result is failed', () => {
    const screen = render(
      <DebugVoucherResultsStep
        step={createMockDebugVoucherResultStep()}
        stepKey={'publicKeyRetrieve'}
      />
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if step result is passed', () => {
    const screen = render(
      <DebugVoucherResultsStep
        step={createMockDebugVoucherResultStep({ result: 'PASSED', failures: [] })}
        stepKey={'platformStatesVerification'}
      />
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if step result is skipped', () => {
    const screen = render(
      <DebugVoucherResultsStep
        step={createMockDebugVoucherResultStep({ result: 'SKIPPED', failures: [] })}
        stepKey={'clientAssertionSignatureVerification'}
      />
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should setDebugVoucherStepDrawer function be called on click', () => {
    const setDebugVoucherStepDrawerMockFn = vi.fn()
    mockDebugVoucherContext({ setDebugVoucherStepDrawer: setDebugVoucherStepDrawerMockFn })

    const screen = render(
      <DebugVoucherResultsStep
        step={createMockDebugVoucherResultStep()}
        stepKey={'clientAssertionValidation'}
      />
    )

    expect(screen.getByText('label.clientAssertionValidation')).toBeInTheDocument()
    expect(screen.getByText('chipLabel.failed')).toBeInTheDocument()

    fireEvent.click(screen.getByText('chipLabel.failed'))

    expect(setDebugVoucherStepDrawerMockFn).toBeCalled()
  })
})
