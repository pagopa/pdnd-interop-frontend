import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { RiskAnalysisFormTemplate } from '../RiskAnalysisFormTemplate'
import { useRiskAnalysisFormTemplate } from '@/hooks/useRiskAnalysisFormTemplate'

// --- mocks ---
vi.mock('@/hooks/useRiskAnalysisFormTemplate', () => ({
  useRiskAnalysisFormTemplate: vi.fn(),
}))

vi.mock('@/components/shared/RiskAnalysisFormComponents', () => ({
  RiskAnalysisFormComponents: vi.fn(() => <div data-testid="form-components" />),
}))

vi.mock('@/components/shared/StepActions', () => ({
  StepActions: vi.fn(({ back, forward }) => (
    <div>
      <button onClick={back.onClick} data-testid="back-button">
        {back.label}
      </button>
      <button onClick={forward.onClick} type={forward.type} data-testid="forward-button">
        {forward.label}
      </button>
    </div>
  )),
}))

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => key,
  })),
}))

describe('RiskAnalysisFormTemplate', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  const defaultAnswers = {
    q1: {
      id: 'answer-id-1',
      values: ['answer1'],
      editable: false,
      suggestedValues: [],
    },
  }

  const riskAnalysis = {
    version: '1',
    questions: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const mockHandleSubmit = vi.fn((callback) => (e: React.FormEvent) => {
      e.preventDefault()
      callback({
        validAnswers: { q1: ['answer1'] },
        assignToTemplateUsers: { q1: false },
        annotations: {},
        suggestedValues: {},
      })
    })

    ;(useRiskAnalysisFormTemplate as Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      questions: {},
    })

    render(
      <RiskAnalysisFormTemplate
        defaultAnswers={defaultAnswers}
        riskAnalysis={riskAnalysis}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handlesPersonalData={true}
      />
    )

    expect(screen.getByTestId('form-components')).toBeInTheDocument()
    expect(screen.getByTestId('back-button')).toBeInTheDocument()
    expect(screen.getByTestId('forward-button')).toBeInTheDocument()
  })

  it('calls onCancel when back button is clicked', async () => {
    const user = userEvent.setup()
    const mockHandleSubmit = vi.fn()

    ;(useRiskAnalysisFormTemplate as Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      questions: {},
    })

    render(
      <RiskAnalysisFormTemplate
        defaultAnswers={defaultAnswers}
        riskAnalysis={riskAnalysis}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handlesPersonalData={true}
      />
    )

    const backButton = screen.getByTestId('back-button')
    await user.click(backButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup()
    const mockHandleSubmit = vi.fn((callback) => (e: React.FormEvent) => {
      e.preventDefault()
      callback({
        validAnswers: { q1: ['answer1'] },
        assignToTemplateUsers: { q1: false },
        annotations: {},
        suggestedValues: {},
      })
    })

    ;(useRiskAnalysisFormTemplate as Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      questions: {},
    })

    render(
      <RiskAnalysisFormTemplate
        defaultAnswers={defaultAnswers}
        riskAnalysis={riskAnalysis}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handlesPersonalData={true}
      />
    )

    const forwardButton = screen.getByTestId('forward-button')
    await user.click(forwardButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        version: '1',
        answers: {
          q1: {
            values: ['answer1'],
            editable: false,
            suggestedValues: [],
          },
        },
      })
    })
  })

  it('transforms answers correctly when editable is true', async () => {
    const user = userEvent.setup()
    const mockHandleSubmit = vi.fn((callback) => (e: React.FormEvent) => {
      e.preventDefault()
      callback({
        validAnswers: { q1: ['answer1'] },
        assignToTemplateUsers: { q1: true },
        annotations: {},
        suggestedValues: {},
      })
    })

    ;(useRiskAnalysisFormTemplate as Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      questions: {},
    })

    render(
      <RiskAnalysisFormTemplate
        defaultAnswers={defaultAnswers}
        riskAnalysis={riskAnalysis}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handlesPersonalData={true}
      />
    )

    const forwardButton = screen.getByTestId('forward-button')
    await user.click(forwardButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        version: '1',
        answers: {
          q1: {
            values: [],
            editable: true,
            suggestedValues: [],
          },
        },
      })
    })
  })

  it('includes annotation when provided', async () => {
    const user = userEvent.setup()
    const mockHandleSubmit = vi.fn((callback) => (e: React.FormEvent) => {
      e.preventDefault()
      callback({
        validAnswers: { q1: ['answer1'] },
        assignToTemplateUsers: { q1: false },
        annotations: { q1: { text: 'annotation text' } },
        suggestedValues: {},
      })
    })

    ;(useRiskAnalysisFormTemplate as Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      questions: {},
    })

    render(
      <RiskAnalysisFormTemplate
        defaultAnswers={defaultAnswers}
        riskAnalysis={riskAnalysis}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handlesPersonalData={true}
      />
    )

    const forwardButton = screen.getByTestId('forward-button')
    await user.click(forwardButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        version: '1',
        answers: {
          q1: {
            values: ['answer1'],
            editable: false,
            annotation: { text: 'annotation text' },
            suggestedValues: [],
          },
        },
      })
    })
  })

  it('handles suggestedValues correctly', async () => {
    const user = userEvent.setup()
    const mockHandleSubmit = vi.fn((callback) => (e: React.FormEvent) => {
      e.preventDefault()
      callback({
        validAnswers: { q1: ['answer1'] },
        assignToTemplateUsers: { q1: false },
        annotations: {},
        suggestedValues: { q1: ['suggested1', 'suggested2'] },
      })
    })

    ;(useRiskAnalysisFormTemplate as Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      questions: {},
    })

    render(
      <RiskAnalysisFormTemplate
        defaultAnswers={defaultAnswers}
        riskAnalysis={riskAnalysis}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handlesPersonalData={true}
      />
    )

    const forwardButton = screen.getByTestId('forward-button')
    await user.click(forwardButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        version: '1',
        answers: {
          q1: {
            values: [],
            editable: false,
            suggestedValues: ['suggested1', 'suggested2'],
          },
        },
      })
    })
  })
})
