import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ConsumerPurposeDetailsAssignmentSection } from '../ConsumerPurposeDetailsAssignmentSection'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

mockUseJwt()

const translationMock = vi.fn((key: string) => key)

vi.mock('react-i18next', async () => {
  const actual = await import('@/../__mocks__/react-i18next')
  return {
    ...actual,
    useTranslation: () => ({ ...actual.useTranslation(), t: translationMock }),
  }
})

const reviewerId = 'b7f6b32e-6252-4994-ac7b-47622e674e5a'
const otherReviewerId = 'c1a2b3c4-d5e6-4789-9abc-def012345678'

describe('ConsumerPurposeDetailsAssignmentSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the autonomy mode and no reviewer when there is no reviewer workflow', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsAssignmentSection
        purpose={createMockPurpose({ reviewerWorkflow: undefined })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.autonomy')).toBeInTheDocument()
    expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
  })

  it('shows the assigned mode and the reviewer name and surname', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsAssignmentSection
        purpose={createMockPurpose({
          riskAnalysisReviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          reviewerWorkflow: {
            reviewers: [{ userId: reviewerId, name: 'Mario', familyName: 'Rossi' }],
            signingState: 'ASSIGNED',
          },
        })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.adminWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })

  it('shows every assigned reviewer as a comma separated list', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsAssignmentSection
        purpose={createMockPurpose({
          riskAnalysisReviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          reviewerWorkflow: {
            reviewers: [
              { userId: reviewerId, name: 'Mario', familyName: 'Rossi' },
              { userId: otherReviewerId, name: 'Luigi', familyName: 'Verdi' },
            ],
            signingState: 'ASSIGNED',
          },
        })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi, Luigi Verdi')).toBeInTheDocument()
  })

  it('does not show the reviewer row when the reviewer workflow has no reviewers', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsAssignmentSection
        purpose={createMockPurpose({
          riskAnalysisReviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          reviewerWorkflow: {
            signingState: 'ASSIGNED',
          },
        })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.adminWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
  })

  it('keeps unavailable assigned reviewers visible and counts them in the label', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsAssignmentSection
        purpose={createMockPurpose({
          riskAnalysisReviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          reviewerWorkflow: {
            reviewers: [
              { userId: reviewerId, name: '  ', familyName: '\t' },
              { userId: otherReviewerId, name: 'Luigi', familyName: 'Verdi' },
            ],
            signingState: 'ASSIGNED',
          },
        })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('reviewerUnknown, Luigi Verdi')).toBeInTheDocument()
    expect(translationMock).toHaveBeenCalledWith('reviewer.label', { count: 2 })
  })

  it('keeps the reviewer row when its only assigned reviewer has no available name', () => {
    renderWithApplicationContext(
      <ConsumerPurposeDetailsAssignmentSection
        purpose={createMockPurpose({
          riskAnalysisReviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          reviewerWorkflow: {
            reviewers: [{ userId: reviewerId, name: '', familyName: '' }],
            signingState: 'ASSIGNED',
          },
        })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText('reviewerUnknown')).toBeInTheDocument()
    expect(translationMock).toHaveBeenCalledWith('reviewer.label', { count: 1 })
  })
})
