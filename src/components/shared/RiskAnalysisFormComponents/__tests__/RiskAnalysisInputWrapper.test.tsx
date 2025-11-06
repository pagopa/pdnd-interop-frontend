import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RiskAnalysisInputWrapper from '../RiskAnalysisInputWrapper'
import { RiskAnalysisAnswerComponent } from '@/pages/ConsumerPurposeTemplateEditPage/components/PurposeTemplateEditStepRiskAnalysis/RiskAnalysisForm/RiskAnalysisAnswerComponent'

// --- mocks ---
vi.mock('@/components/layout/containers', () => ({
  SectionContainer: vi.fn(({ children, component, ...props }) => (
    <div data-testid={`section-container-${component || 'div'}`} {...props}>
      {children}
    </div>
  )),
}))

vi.mock(
  '@/pages/ConsumerPurposeTemplateEditPage/components/PurposeTemplateEditStepRiskAnalysis/RiskAnalysisForm/RiskAnalysisAnswerComponent',
  () => ({
    RiskAnalysisAnswerComponent: vi.fn(() => <div data-testid="answer-component" />),
  })
)

describe('RiskAnalysisInputWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with basic props', () => {
    render(
      <RiskAnalysisInputWrapper label="Test Label" questionKey="test-key">
        <input data-testid="test-input" />
      </RiskAnalysisInputWrapper>
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByTestId('test-input')).toBeInTheDocument()
  })

  it('renders infoLabel when provided', () => {
    render(
      <RiskAnalysisInputWrapper label="Test Label" infoLabel="Info text" questionKey="test-key">
        <input />
      </RiskAnalysisInputWrapper>
    )

    expect(screen.getByText('Info text')).toBeInTheDocument()
  })

  it('renders helperText when provided', () => {
    render(
      <RiskAnalysisInputWrapper label="Test Label" helperText="Helper text" questionKey="test-key">
        <input />
      </RiskAnalysisInputWrapper>
    )

    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  it('renders error when provided', () => {
    render(
      <RiskAnalysisInputWrapper label="Test Label" error="Error message" questionKey="test-key">
        <input />
      </RiskAnalysisInputWrapper>
    )

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('renders as fieldset when isInputGroup is true', () => {
    render(
      <RiskAnalysisInputWrapper label="Test Label" isInputGroup questionKey="test-key">
        <input />
      </RiskAnalysisInputWrapper>
    )

    expect(screen.getByTestId('section-container-fieldset')).toBeInTheDocument()
  })

  it('renders RiskAnalysisAnswerComponent when isFromPurposeTemplate is true', () => {
    render(
      <RiskAnalysisInputWrapper
        label="Test Label"
        isFromPurposeTemplate
        type="creator"
        questionKey="q1"
        questionType="SINGLE"
      >
        <input />
      </RiskAnalysisInputWrapper>
    )

    expect(screen.getByTestId('answer-component')).toBeInTheDocument()
    expect(RiskAnalysisAnswerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        question: 'Test Label',
        questionKey: 'q1',
        questionType: 'SINGLE',
      }),
      expect.any(Object)
    )
  })

  it('does not render RiskAnalysisAnswerComponent when isFromPurposeTemplate is false', () => {
    render(
      <RiskAnalysisInputWrapper
        label="Test Label"
        isFromPurposeTemplate={false}
        questionKey="test-key"
      >
        <input />
      </RiskAnalysisInputWrapper>
    )

    expect(screen.queryByTestId('answer-component')).not.toBeInTheDocument()
  })

  it('applies proper styling when isFromPurposeTemplate is true', () => {
    const { container } = render(
      <RiskAnalysisInputWrapper label="Test Label" isFromPurposeTemplate questionKey="test-key">
        <input />
      </RiskAnalysisInputWrapper>
    )

    const innerSection = container.querySelector('[data-testid="section-container-div"]')
    expect(innerSection).toBeInTheDocument()
  })
})
