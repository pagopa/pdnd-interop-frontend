import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import { vi } from 'vitest'
import { DebugVoucherResults } from '../DebugVoucherResults'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockDebugVoucherRequest,
  createMockDebugVoucherResultPassed,
  createMockDebugVoucherResultStep,
} from '@/../__mocks__/data/voucher.mocks'

describe('DebugVoucherResults testing', () => {
  it('should render correctly if isOpen is false', () => {
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: { isOpen: false, selectedStep: undefined },
    })

    renderWithApplicationContext(<DebugVoucherResults />, {})

    expect(screen.queryByText('stepDrawer.stepResultLabel')).not.toBeInTheDocument()
  })

  it('should render correctly if isOpen is true', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed(),
      request: createMockDebugVoucherRequest(),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
      goToNextStep: vi.fn(),
    })

    renderWithApplicationContext(<DebugVoucherResults />, {})

    expect(screen.queryByText('stepDrawer.stepResultLabel')).toBeInTheDocument()
  })

  it('should handleMakeNewRequestMockFn function be called when newRequestButton is clicked', () => {
    const handleMakeNewRequestMockFn = vi.fn()
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: { isOpen: false, selectedStep: undefined },
      handleMakeNewRequest: handleMakeNewRequestMockFn,
    })

    renderWithApplicationContext(<DebugVoucherResults />, {})

    const newRequestButton = screen.getByRole('button', { name: 'newRequestBtn' })

    expect(newRequestButton).toBeInTheDocument()

    fireEvent.click(newRequestButton)

    expect(handleMakeNewRequestMockFn).toBeCalled()
  })
})
