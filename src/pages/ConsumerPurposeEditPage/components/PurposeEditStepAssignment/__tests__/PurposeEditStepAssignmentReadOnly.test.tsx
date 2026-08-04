import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PurposeEditStepAssignmentReadOnly from '../PurposeEditStepAssignmentReadOnly'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type {
  CompactUser,
  Purpose,
  PurposeVersionState,
  RiskAnalysisReviewMode,
} from '@/api/api.generatedTypes'

const mockReviewer: CompactUser = {
  userId: 'reviewer-uuid-1',
  name: 'Mario',
  familyName: 'Rossi',
}

function buildPurpose(
  reviewMode: RiskAnalysisReviewMode,
  reviewers: Array<CompactUser>,
  versionState: PurposeVersionState = 'DRAFT'
): Purpose {
  const base = createMockPurpose({ id: 'purpose-id' })
  return {
    ...base,
    currentVersion: base.currentVersion && { ...base.currentVersion, state: versionState },
    reviewMode,
    reviewerWorkflow: {
      reviewers,
      signingState: 'SIGNED',
    },
  }
}

function renderComponent(overrides?: {
  purpose?: Purpose
  forward?: VoidFunction
  back?: VoidFunction
}) {
  return renderWithApplicationContext(
    <PurposeEditStepAssignmentReadOnly
      purpose={overrides?.purpose ?? buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [mockReviewer])}
      activeStep={1}
      forward={overrides?.forward ?? vi.fn()}
      back={overrides?.back ?? vi.fn()}
    />,
    { withReactQueryContext: true, withRouterContext: true }
  )
}

describe('PurposeEditStepAssignmentReadOnly', () => {
  it('renders only the "mode" row with the option-1 label when there is no reviewer workflow', () => {
    const purpose = { ...createMockPurpose({ id: 'purpose-id' }), reviewerWorkflow: undefined }
    renderComponent({ purpose })

    expect(screen.getByText('readOnly.modeLabel')).toBeInTheDocument()
    expect(
      screen.getByText('reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS')
    ).toBeInTheDocument()
    expect(screen.queryByText('readOnly.reviewerLabel')).not.toBeInTheDocument()
  })

  it('renders the "mode" row with the option-2 label and the "reviewer" row for ADMIN_WRITES_REVIEWER_SIGNS', () => {
    renderComponent({ purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [mockReviewer]) })

    expect(screen.getByText('readOnly.modeLabel')).toBeInTheDocument()
    expect(
      screen.getByText('reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS')
    ).toBeInTheDocument()
    expect(screen.getByText('readOnly.reviewerLabel')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })

  it('renders the "mode" row with the option-3 label and the "reviewer" row for REVIEWER_WRITES_REVIEWER_SIGNS', () => {
    renderComponent({
      purpose: buildPurpose('REVIEWER_WRITES_REVIEWER_SIGNS', [mockReviewer]),
    })

    expect(screen.getByText('readOnly.modeLabel')).toBeInTheDocument()
    expect(
      screen.getByText('reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS')
    ).toBeInTheDocument()
    expect(screen.getByText('readOnly.reviewerLabel')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })

  it('lists every assigned reviewer, not just the first one', () => {
    renderComponent({
      purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [
        mockReviewer,
        { userId: 'reviewer-uuid-2', name: 'Anna', familyName: 'Verdi' },
      ]),
    })

    expect(screen.getByText('Mario Rossi, Anna Verdi')).toBeInTheDocument()
  })

  it('explains the assignment is frozen because the risk analysis was approved, while the purpose is still a draft', () => {
    renderComponent({ purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [mockReviewer]) })

    expect(screen.getByText('readOnly.subtitle.signed')).toBeInTheDocument()
    expect(screen.queryByText('readOnly.subtitle.published')).not.toBeInTheDocument()
  })

  it('explains the assignment is frozen because the purpose has been published', () => {
    renderComponent({
      purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [mockReviewer], 'ACTIVE'),
    })

    expect(screen.getByText('readOnly.subtitle.published')).toBeInTheDocument()
    expect(screen.queryByText('readOnly.subtitle.signed')).not.toBeInTheDocument()
  })

  it('does not render any radio group, autocomplete or submit CTA', () => {
    renderComponent()

    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'forwardBtn' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'requestReviewerCompilationBtn' })
    ).not.toBeInTheDocument()
  })

  it('navigates between steps via the back and forward buttons without saving', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()
    const back = vi.fn()
    renderComponent({ forward, back })

    await user.click(screen.getByRole('button', { name: 'readOnly.forwardBtn' }))
    expect(forward).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'backWithoutSaveBtn' }))
    expect(back).toHaveBeenCalledTimes(1)
  })

  it('hides the reviewer row when the workflow carries no reviewer', () => {
    renderComponent({
      purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', []),
    })

    expect(screen.queryByText('readOnly.reviewerLabel')).not.toBeInTheDocument()
    expect(screen.queryByText('Mario Rossi')).not.toBeInTheDocument()
  })

  it('falls back to a placeholder when an assigned reviewer has no resolvable name', () => {
    renderComponent({
      purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [
        { userId: 'reviewer-uuid-3', name: '', familyName: '' },
      ]),
    })

    expect(screen.getByText('readOnly.reviewerLabel')).toBeInTheDocument()
    expect(screen.getByText('readOnly.reviewerUnknown')).toBeInTheDocument()
  })
})
