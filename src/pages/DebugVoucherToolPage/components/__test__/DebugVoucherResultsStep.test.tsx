import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import { createMockDebugVoucherResultStep } from '@/../__mocks__/data/voucher.mocks'
import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import { DebugVoucherResultsStep } from '../DebugVoucherResultsStep'

describe('DebugVoucherResultsStep testing', () => {
  it('should setDebugVoucherStepDrawer function be called on click', () => {
    const setDebugVoucherStepDrawerMockFn = vi.fn()
    mockDebugVoucherContext({ setDebugVoucherStepDrawer: setDebugVoucherStepDrawerMockFn })

    const screen = render(
      <DebugVoucherResultsStep
        step={createMockDebugVoucherResultStep()}
        stepKey={'clientAssertionValidation'}
      />
    )

    expect(
      screen.getByRole('button', { name: 'label.clientAssertionValidation chipLabel.failed' })
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'label.clientAssertionValidation chipLabel.failed' })
    )

    expect(setDebugVoucherStepDrawerMockFn).toBeCalled()
  })
})
