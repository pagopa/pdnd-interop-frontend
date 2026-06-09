import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { RiskAnalysisForm } from '../RiskAnalysisForm'
import { createMockRiskAnalysisFormConfig } from '@/../__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const openDialogMock = vi.fn()
vi.mock('@/stores', () => ({
  useDialog: () => ({
    openDialog: openDialogMock,
    closeDialog: vi.fn(),
  }),
}))

describe('RiskAnalysisForm', () => {
  beforeEach(() => {
    openDialogMock.mockClear()
  })

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
        name: 'Question 2*',
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
        name: 'Question 2*',
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

  describe('reviewer-approval mode', () => {
    it('renders the primary "Richiedi approvazione" CTA and the secondary "Salva bozza e prosegui" CTA', () => {
      const screen = render(
        <RiskAnalysisForm
          defaultAnswers={{}}
          riskAnalysis={createMockRiskAnalysisFormConfig()}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          isReviewerApprovalMode
          onSaveDraft={vi.fn()}
        />
      )

      expect(
        screen.getByRole('button', { name: 'stepRiskAnalysis.requestApprovalBtn' })
      ).toBeEnabled()
      expect(
        screen.getByRole('button', { name: 'stepRiskAnalysis.saveDraftBtn' })
      ).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'endWithSaveBtn' })).not.toBeInTheDocument()
    })

    it('on invalid submit shows the global alert and inline "Compila per proseguire", without opening the dialog', async () => {
      const onSubmit = vi.fn()
      const screen = render(
        <RiskAnalysisForm
          defaultAnswers={{}}
          riskAnalysis={createMockRiskAnalysisFormConfig()}
          onSubmit={onSubmit}
          onCancel={vi.fn()}
          isReviewerApprovalMode
          onSaveDraft={vi.fn()}
        />
      )

      // Select 'Other' to reveal the required free-text Question 2, then submit
      // without filling it to trigger a `required` validation failure.
      fireEvent.click(screen.getByRole('radio', { name: 'Other' }))
      fireEvent.click(screen.getByRole('button', { name: 'stepRiskAnalysis.requestApprovalBtn' }))

      await waitFor(() => {
        expect(
          screen.getAllByText('stepRiskAnalysis.requiredFieldErrorReviewer').length
        ).toBeGreaterThan(0)
      })

      expect(screen.getByText('stepRiskAnalysis.requestApprovalAlert')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
      expect(openDialogMock).not.toHaveBeenCalled()
    })

    it('on valid submit opens the confirmation dialog and does not call onSubmit until proceed', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      const screen = render(
        <RiskAnalysisForm
          defaultAnswers={{}}
          riskAnalysis={createMockRiskAnalysisFormConfig()}
          onSubmit={onSubmit}
          onCancel={vi.fn()}
          isReviewerApprovalMode
          onSaveDraft={vi.fn()}
        />
      )

      fireEvent.click(screen.getByRole('radio', { name: 'Other' }))
      await user.type(screen.getByRole('textbox', { name: 'Question 2*' }), 'Some text')
      fireEvent.click(screen.getByRole('button', { name: 'stepRiskAnalysis.requestApprovalBtn' }))

      await waitFor(() => expect(openDialogMock).toHaveBeenCalledTimes(1))

      expect(onSubmit).not.toHaveBeenCalled()
      expect(screen.queryByText('stepRiskAnalysis.requestApprovalAlert')).not.toBeInTheDocument()

      const dialogPayload = openDialogMock.mock.calls[0][0]
      expect(dialogPayload).toMatchObject({
        type: 'basic',
        title: 'stepRiskAnalysis.requestApprovalDialog.title',
        description: 'stepRiskAnalysis.requestApprovalDialog.description',
        proceedLabel: 'stepRiskAnalysis.requestApprovalDialog.proceedLabel',
      })

      dialogPayload.onProceed()
      expect(onSubmit).toHaveBeenCalledWith({
        purpose: ['OTHER'],
        institutionalPurpose: ['Some text'],
      })
    })

    it('saves the draft without validating when the user clicks "Salva bozza e prosegui"', async () => {
      const onSubmit = vi.fn()
      const onSaveDraft = vi.fn()
      const user = userEvent.setup()
      const screen = render(
        <RiskAnalysisForm
          defaultAnswers={{}}
          riskAnalysis={createMockRiskAnalysisFormConfig()}
          onSubmit={onSubmit}
          onCancel={vi.fn()}
          isReviewerApprovalMode
          onSaveDraft={onSaveDraft}
        />
      )

      fireEvent.click(screen.getByRole('radio', { name: 'Other' }))
      await user.type(screen.getByRole('textbox', { name: 'Question 2*' }), 'Partial')
      fireEvent.click(screen.getByRole('button', { name: 'stepRiskAnalysis.saveDraftBtn' }))

      await waitFor(() =>
        expect(onSaveDraft).toHaveBeenCalledWith({
          purpose: ['OTHER'],
          institutionalPurpose: ['Partial'],
        })
      )

      expect(onSubmit).not.toHaveBeenCalled()
      expect(openDialogMock).not.toHaveBeenCalled()
      expect(screen.queryByText('stepRiskAnalysis.requestApprovalAlert')).not.toBeInTheDocument()
    })

    it('disables both CTAs while a save+submit is in flight', () => {
      const screen = render(
        <RiskAnalysisForm
          defaultAnswers={{}}
          riskAnalysis={createMockRiskAnalysisFormConfig()}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          isReviewerApprovalMode
          onSaveDraft={vi.fn()}
          isSubmitting
        />
      )

      expect(
        screen.getByRole('button', { name: 'stepRiskAnalysis.requestApprovalBtn' })
      ).toBeDisabled()
      expect(screen.getByRole('button', { name: 'stepRiskAnalysis.saveDraftBtn' })).toBeDisabled()
    })

    it('saves the draft even when a required field is left empty', async () => {
      const onSaveDraft = vi.fn()
      const screen = render(
        <RiskAnalysisForm
          defaultAnswers={{}}
          riskAnalysis={createMockRiskAnalysisFormConfig()}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
          isReviewerApprovalMode
          onSaveDraft={onSaveDraft}
        />
      )

      // Pick 'Other' to reveal Question 2 (required, empty) and click the draft
      // CTA: the save must go through even though the form would not validate.
      fireEvent.click(screen.getByRole('radio', { name: 'Other' }))
      fireEvent.click(screen.getByRole('button', { name: 'stepRiskAnalysis.saveDraftBtn' }))

      await waitFor(() => expect(onSaveDraft).toHaveBeenCalledTimes(1))
      expect(screen.queryByText('stepRiskAnalysis.requestApprovalAlert')).not.toBeInTheDocument()
    })
  })
})
