import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogEditRiskAnalysisAssignment } from '../DialogEditRiskAnalysisAssignment'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { RiskAnalysisReviewMode } from '@/api/api.generatedTypes'

const closeDialogMock = vi.fn()
const onConfirmMock = vi.fn()

vi.mock('@/stores', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: closeDialogMock }),
  }
})

const defaultProps = {
  type: 'editRiskAnalysisAssignment' as const,
  fromMode: 'ADMIN_WRITES_ADMIN_SIGNS' as RiskAnalysisReviewMode,
  toMode: 'ADMIN_WRITES_REVIEWER_SIGNS' as RiskAnalysisReviewMode,
  addedReviewerNames: [] as Array<string>,
  removedReviewerNames: [] as Array<string>,
  onConfirm: onConfirmMock,
}

const renderDialog = (overrides?: Partial<typeof defaultProps>) =>
  renderWithApplicationContext(
    <DialogEditRiskAnalysisAssignment {...defaultProps} {...overrides} />,
    { withReactQueryContext: true }
  )

describe('DialogEditRiskAnalysisAssignment', () => {
  beforeEach(() => {
    closeDialogMock.mockReset()
    onConfirmMock.mockReset()
  })

  it('renders the dialog with its title and CTAs', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('editAssignmentDialog.title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'confirm' })).toBeInTheDocument()
  })

  describe('mode change copy', () => {
    it('announces the chosen mode when leaving the self-compilation mode', () => {
      renderDialog({
        fromMode: 'ADMIN_WRITES_ADMIN_SIGNS',
        toMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
      })

      expect(screen.getByText('editAssignmentDialog.modeChosen')).toBeInTheDocument()
      expect(screen.queryByText('editAssignmentDialog.modeTransition')).not.toBeInTheDocument()
    })

    it('frames the change as a transition between two modes otherwise', () => {
      renderDialog({
        fromMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        toMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
      })

      expect(screen.getByText('editAssignmentDialog.modeTransition')).toBeInTheDocument()
      expect(screen.queryByText('editAssignmentDialog.modeChosen')).not.toBeInTheDocument()
    })

    it('shows no mode copy at all when only the reviewers changed', () => {
      renderDialog({
        fromMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        toMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        addedReviewerNames: ['Anna Verdi'],
      })

      expect(screen.queryByText('editAssignmentDialog.modeTransition')).not.toBeInTheDocument()
      expect(screen.queryByText('editAssignmentDialog.modeChosen')).not.toBeInTheDocument()
    })
  })

  describe('reviewers blocks', () => {
    it('lists the added reviewers only when there are any', () => {
      renderDialog({ addedReviewerNames: ['Mario Rossi', 'Anna Verdi'] })

      expect(screen.getByText('editAssignmentDialog.selectedReviewersLabel')).toBeInTheDocument()
      expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
      expect(screen.getByText('Anna Verdi')).toBeInTheDocument()
      expect(
        screen.queryByText('editAssignmentDialog.removedReviewersLabel')
      ).not.toBeInTheDocument()
    })

    it('lists the removed reviewers only when there are any', () => {
      renderDialog({
        fromMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        toMode: 'ADMIN_WRITES_ADMIN_SIGNS',
        removedReviewerNames: ['Mario Rossi'],
      })

      expect(screen.getByText('editAssignmentDialog.removedReviewersLabel')).toBeInTheDocument()
      expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
      expect(
        screen.queryByText('editAssignmentDialog.selectedReviewersLabel')
      ).not.toBeInTheDocument()
    })

    it('shows both blocks when the same mode gains and loses a reviewer', () => {
      renderDialog({
        fromMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        toMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        addedReviewerNames: ['Anna Verdi'],
        removedReviewerNames: ['Mario Rossi'],
      })

      expect(screen.getByText('editAssignmentDialog.selectedReviewersLabel')).toBeInTheDocument()
      expect(screen.getByText('editAssignmentDialog.removedReviewersLabel')).toBeInTheDocument()
    })
  })

  describe('risk analysis loss warning', () => {
    const destructiveTransitions: Array<[RiskAnalysisReviewMode, RiskAnalysisReviewMode]> = [
      ['ADMIN_WRITES_ADMIN_SIGNS', 'REVIEWER_WRITES_REVIEWER_SIGNS'],
      ['ADMIN_WRITES_REVIEWER_SIGNS', 'REVIEWER_WRITES_REVIEWER_SIGNS'],
      ['REVIEWER_WRITES_REVIEWER_SIGNS', 'ADMIN_WRITES_ADMIN_SIGNS'],
      ['REVIEWER_WRITES_REVIEWER_SIGNS', 'ADMIN_WRITES_REVIEWER_SIGNS'],
    ]

    const preservingTransitions: Array<[RiskAnalysisReviewMode, RiskAnalysisReviewMode]> = [
      ['ADMIN_WRITES_ADMIN_SIGNS', 'ADMIN_WRITES_REVIEWER_SIGNS'],
      ['ADMIN_WRITES_REVIEWER_SIGNS', 'ADMIN_WRITES_ADMIN_SIGNS'],
      ['ADMIN_WRITES_ADMIN_SIGNS', 'ADMIN_WRITES_ADMIN_SIGNS'],
      ['ADMIN_WRITES_REVIEWER_SIGNS', 'ADMIN_WRITES_REVIEWER_SIGNS'],
      ['REVIEWER_WRITES_REVIEWER_SIGNS', 'REVIEWER_WRITES_REVIEWER_SIGNS'],
    ]

    it.each(destructiveTransitions)('warns when switching from %s to %s', (fromMode, toMode) => {
      renderDialog({ fromMode, toMode })

      expect(screen.getByText('editAssignmentDialog.riskAnalysisLossWarning')).toBeInTheDocument()
    })

    it.each(preservingTransitions)(
      'does not warn when switching from %s to %s',
      (fromMode, toMode) => {
        renderDialog({ fromMode, toMode })

        expect(
          screen.queryByText('editAssignmentDialog.riskAnalysisLossWarning')
        ).not.toBeInTheDocument()
      }
    )
  })

  it('on confirm, runs the callback and closes the dialog', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

    expect(onConfirmMock).toHaveBeenCalledTimes(1)
    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })

  it('on cancel, closes the dialog without running the callback', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'cancel' }))

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(onConfirmMock).not.toHaveBeenCalled()
  })
})
