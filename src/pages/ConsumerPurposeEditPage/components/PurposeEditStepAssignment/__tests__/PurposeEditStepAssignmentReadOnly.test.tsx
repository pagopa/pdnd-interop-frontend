import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PurposeEditStepAssignmentReadOnly from '../PurposeEditStepAssignmentReadOnly'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, RiskAnalysisReviewMode, User } from '@/api/api.generatedTypes'

const mockReviewer: User = {
  userId: 'reviewer-uuid-1',
  tenantId: 'tenant-uuid',
  name: 'Mario',
  familyName: 'Rossi',
  roles: ['reviewer'],
}

function buildPurpose(reviewMode: RiskAnalysisReviewMode, reviewerIds: string[]): Purpose {
  return {
    ...createMockPurpose({ id: 'purpose-id' }),
    reviewerWorkflow: {
      reviewMode,
      reviewerIds,
      signingState: 'ASSIGNED',
    },
  }
}

function renderComponent(overrides?: {
  purpose?: Purpose
  reviewers?: Array<User>
  forward?: VoidFunction
  back?: VoidFunction
}) {
  return renderWithApplicationContext(
    <PurposeEditStepAssignmentReadOnly
      purpose={
        overrides?.purpose ?? buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', ['reviewer-uuid-1'])
      }
      reviewers={overrides?.reviewers ?? [mockReviewer]}
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
    expect(screen.getByText('reviewModeField.options.selfWritesSelfSigns')).toBeInTheDocument()
    expect(screen.queryByText('readOnly.reviewerLabel')).not.toBeInTheDocument()
  })

  it('renders the "mode" row with the option-2 label and the "reviewer" row for ADMIN_WRITES_REVIEWER_SIGNS', () => {
    renderComponent({ purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', ['reviewer-uuid-1']) })

    expect(screen.getByText('readOnly.modeLabel')).toBeInTheDocument()
    expect(screen.getByText('reviewModeField.options.selfWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.getByText('readOnly.reviewerLabel')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })

  it('renders the "mode" row with the option-3 label and the "reviewer" row for REVIEWER_WRITES_REVIEWER_SIGNS', () => {
    renderComponent({
      purpose: buildPurpose('REVIEWER_WRITES_REVIEWER_SIGNS', ['reviewer-uuid-1']),
    })

    expect(screen.getByText('readOnly.modeLabel')).toBeInTheDocument()
    expect(
      screen.getByText('reviewModeField.options.reviewerWritesReviewerSigns')
    ).toBeInTheDocument()
    expect(screen.getByText('readOnly.reviewerLabel')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
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

  it('falls back to a placeholder when the assigned reviewer is not in the reviewers list', () => {
    renderComponent({
      purpose: buildPurpose('ADMIN_WRITES_REVIEWER_SIGNS', ['unknown-reviewer']),
      reviewers: [mockReviewer],
    })

    expect(screen.getByText('readOnly.reviewerLabel')).toBeInTheDocument()
    expect(screen.getByText('readOnly.reviewerUnknown')).toBeInTheDocument()
    expect(screen.queryByText('Mario Rossi')).not.toBeInTheDocument()
  })
})
