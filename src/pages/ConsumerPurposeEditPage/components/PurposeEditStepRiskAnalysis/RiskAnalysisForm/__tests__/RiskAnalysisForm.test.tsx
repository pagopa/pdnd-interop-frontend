import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { RiskAnalysisForm } from '../RiskAnalysisForm'
import { createMockRiskAnalysisFormConfig } from '@/../__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('RiskAnalysisForm', () => {
  it('should update the questions accordingly', async () => {
    const screen = render(
      <RiskAnalysisForm
        defaultAnswers={{}}
        riskAnalysis={createMockRiskAnalysisFormConfig()}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.queryByRole('textbox', { name: '' })).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('radio', {
        name: 'Other',
      })
    )

    expect(
      screen.getByRole('textbox', {
        name: 'Question 2 (riskAnalysis.formComponents.validation.required)',
      })
    ).toBeInTheDocument()
  })

  it('should submit the form with the correct values', async () => {
    const onSubmit = vi.fn()
    const screen = render(
      <RiskAnalysisForm
        defaultAnswers={{}}
        riskAnalysis={createMockRiskAnalysisFormConfig()}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    )

    const user = userEvent.setup()

    fireEvent.click(
      screen.getByRole('radio', {
        name: 'Other',
      })
    )

    await user.type(
      screen.getByRole('textbox', {
        name: 'Question 2 (riskAnalysis.formComponents.validation.required)',
      }),
      'Some text'
    )
    fireEvent.click(screen.getByRole('button', { name: 'endWithSaveBtn' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        purpose: ['OTHER'],
        institutionalPurpose: ['Some text'],
      })
    })
  })
})
