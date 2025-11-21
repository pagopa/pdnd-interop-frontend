import React from 'react'
import { screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ConsumerPurposeTemplateEditPage from '../ConsumerPurposeTemplateEdit.page'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as useActiveStepModule from '@/hooks/useActiveStep'

vi.mock('@/hooks/useActiveStep', () => ({
  useActiveStep: vi.fn(() => ({
    activeStep: 0,
    forward: vi.fn(),
    back: vi.fn(),
  })),
}))

vi.mock('../components/PurposeTemplateEditStepGeneral/PurposeTemplateEditStepGeneral', () => ({
  PurposeTemplateEditStepGeneral: () => <div data-testid="step-general">Step General</div>,
}))

vi.mock(
  '../components/PurposeTemplateEditStepLinkedEServices/PurposeTemplateEditLinkedEService',
  () => ({
    PurposeTemplateEditLinkedEService: () => (
      <div data-testid="step-linked-eservices">Step Linked EServices</div>
    ),
  })
)

vi.mock(
  '../components/PurposeTemplateEditStepRiskAnalysis/PurposeTemplateEditRiskAnalysisForm',
  () => ({
    PurposeTemplateEditStepRiskAnalysis: () => (
      <div data-testid="step-risk-analysis">Step Risk Analysis</div>
    ),
  })
)

describe('ConsumerPurposeTemplateEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 0,
      forward: vi.fn(),
      back: vi.fn(),
    })
  })

  it('should render correctly with step 0 (general)', () => {
    renderWithApplicationContext(<ConsumerPurposeTemplateEditPage />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('step-general')).toBeInTheDocument()
  })

  it('should render step 1 (linked eservices) when activeStep is 1', () => {
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 1,
      forward: vi.fn(),
      back: vi.fn(),
    })

    renderWithApplicationContext(<ConsumerPurposeTemplateEditPage />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('step-linked-eservices')).toBeInTheDocument()
  })

  it('should render step 2 (risk analysis) when activeStep is 2', () => {
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 2,
      forward: vi.fn(),
      back: vi.fn(),
    })

    renderWithApplicationContext(<ConsumerPurposeTemplateEditPage />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('step-risk-analysis')).toBeInTheDocument()
  })

  it('should be a React functional component', () => {
    expect(ConsumerPurposeTemplateEditPage).toBeInstanceOf(Function)
  })
})
