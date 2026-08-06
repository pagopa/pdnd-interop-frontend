import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { RiskAnalysisDetailsAssignmentSection } from '../components/RiskAnalysisDetailsAssignmentSection'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, ReviewerWorkflow } from '@/api/api.generatedTypes'
import type { ConcludedSigningState } from '../types'

mockUseJwt({ isAdmin: false, isReviewer: true, jwt: { uid: 'reviewer-1' } })

const reviewers = [
  {
    userId: 'reviewer-1',
    name: 'Mario',
    familyName: 'Rossi',
    sentToReviewerAt: '2026-03-10T10:00:00.000Z',
  },
  {
    userId: 'reviewer-2',
    name: 'Luigi',
    familyName: 'Verdi',
    sentToReviewerAt: '2026-03-11T10:00:00.000Z',
  },
]

function renderSection(
  signingState: ConcludedSigningState,
  reviewerWorkflow: Partial<ReviewerWorkflow> = {}
) {
  const purpose: Purpose = {
    ...createMockPurpose(),
    reviewerWorkflow: { signingState, reviewers, ...reviewerWorkflow },
  }

  return renderWithApplicationContext(
    <RiskAnalysisDetailsAssignmentSection purpose={purpose} signingState={signingState} />,
    { withRouterContext: true, withReactQueryContext: true }
  )
}

describe('RiskAnalysisDetailsAssignmentSection', () => {
  it('should render assignment date, approval date and signer when approved', () => {
    renderSection('SIGNED', { signedBy: 'reviewer-2', signedAt: '2026-03-12T10:00:00.000Z' })

    expect(screen.getByText('assignmentSection.assignedAt.label')).toBeInTheDocument()
    expect(screen.getByText('10/03/2026')).toBeInTheDocument()

    expect(screen.getByText('assignmentSection.signedAt.label')).toBeInTheDocument()
    expect(screen.getByText('12/03/2026')).toBeInTheDocument()

    expect(screen.getByText('assignmentSection.signedBy.label')).toBeInTheDocument()
    expect(screen.getByText('Luigi Verdi')).toBeInTheDocument()

    expect(screen.queryByText('assignmentSection.assignedTo.label')).not.toBeInTheDocument()
  })

  it('should render assignment date and every assigned reviewer when rejected', () => {
    renderSection('REJECTED', { rejectedBy: 'reviewer-1', rejectionReason: 'reason' })

    expect(screen.getByText('assignmentSection.assignedAt.label')).toBeInTheDocument()
    expect(screen.getByText('10/03/2026')).toBeInTheDocument()

    expect(screen.getByText('assignmentSection.assignedTo.label')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi, Luigi Verdi')).toBeInTheDocument()

    expect(screen.queryByText('assignmentSection.signedAt.label')).not.toBeInTheDocument()
    expect(screen.queryByText('assignmentSection.signedBy.label')).not.toBeInTheDocument()
  })

  it('should fall back to a dash when the dates and the signer are missing', () => {
    renderSection('SIGNED', { reviewers: [] })

    expect(screen.getAllByText('-')).toHaveLength(3)
  })
})
