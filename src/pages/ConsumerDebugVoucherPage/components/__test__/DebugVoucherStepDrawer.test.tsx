import {
  createMockDebugVoucherResultPassed,
  createMockDebugVoucherResultStep,
} from '__mocks__/data/voucher.mocks'
import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import { render } from '@testing-library/react'
import DebugVoucherStepDrawer from '../DebugVoucherStepDrawer'

describe('DebugVoucherStepDrawer testing', () => {
  it('should match snapshot', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByText('stepDrawer.stepResultLabel')).toBeInTheDocument()

    expect(screen.getAllByRole('listitem').length).toBe(2)

    expect(screen.baseElement).toMatchSnapshot()
  })
})
