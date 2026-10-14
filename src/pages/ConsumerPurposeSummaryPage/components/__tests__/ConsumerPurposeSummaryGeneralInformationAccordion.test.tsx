import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { ConsumerPurposeSummaryGeneralInformationAccordion } from '../ConsumerPurposeSummaryGeneralInformationAccordion'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { waitFor } from '@testing-library/react'
import { screen } from '@testing-library/react'
import { formatDateStringNumeric } from '@/utils/format.utils'

const useSuspenseQueryMock = vi.fn()
const remainingDailyCallsQueryFn = vi.fn().mockResolvedValue({
  remainingDailyCallsPerConsumer: 5,
  remainingDailyCallsTotal: 100,
})
const reviewer1Id = 'reviewer-1-id'
const reviewer2Id = 'reviewer-2-id'
const reviewer1AssignmentDate = '2026-01-10T12:00:00.000Z'
const reviewer2AssignmentDate = '2026-02-20T12:00:00.000Z'

vi.mock('@/router', () => ({
  Link: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()

  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ['purpose', id],
    getRemainingDailyCalls: ({ purposeId }: { purposeId: string }) => ({
      queryKey: ['remainingDailyCalls', purposeId],
      queryFn: remainingDailyCallsQueryFn,
    }),
  },
}))

vi.mock('@/hooks/useGetPurposeInfoAlert', () => ({
  useGetPurposeInfoAlert: () => undefined,
}))

describe('ConsumerPurposeSummaryGeneralInformationAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useSuspenseQueryMock.mockReturnValue({
      data: createMockPurpose(),
    })

    remainingDailyCallsQueryFn.mockResolvedValue({
      remainingDailyCallsPerConsumer: 5,
      remainingDailyCallsTotal: 100,
    })
  })

  it('should execute remainingDailyCalls query when user is not reviewer', async () => {
    mockUseJwt({ isReviewer: false })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryGeneralInformationAccordion purposeId="purpose-id" />,
      {
        withReactQueryContext: true,
      }
    )

    await waitFor(() => {
      expect(remainingDailyCallsQueryFn).toHaveBeenCalledTimes(1)
    })
  })

  it('should not execute remainingDailyCalls query when user is reviewer', async () => {
    mockUseJwt({ isReviewer: true })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryGeneralInformationAccordion purposeId="purpose-id" />,
      {
        withReactQueryContext: true,
      }
    )

    await waitFor(() => {
      expect(remainingDailyCallsQueryFn).not.toHaveBeenCalled()
    })
  })

  it('should not show assignment section when user is not reviewer', async () => {
    mockUseJwt({ isReviewer: false })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryGeneralInformationAccordion purposeId="purpose-id" />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.queryByText('assignmentSection.assignmentDate.label')).not.toBeInTheDocument()
    expect(screen.queryByText('assignmentSection.reviewers.label')).not.toBeInTheDocument()
  })

  it('should show assignment section when user is reviewer', async () => {
    mockUseJwt({ isReviewer: true, jwt: { uid: reviewer2Id } })

    useSuspenseQueryMock.mockReturnValue({
      data: createMockPurpose({
        reviewerWorkflow: {
          reviewers: [
            {
              userId: reviewer1Id,
              name: 'Mario',
              familyName: 'Rossi',
              sentToReviewerAt: reviewer1AssignmentDate,
            },
            {
              userId: reviewer2Id,
              name: 'Luigi',
              familyName: 'Verdi',
              sentToReviewerAt: reviewer2AssignmentDate,
            },
          ],
        },
      }),
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryGeneralInformationAccordion purposeId="purpose-id" />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.queryByText('assignmentSection.assignmentDate.label')).toBeInTheDocument()
    expect(screen.queryByText('assignmentSection.reviewers.label')).toBeInTheDocument()
    expect(screen.getByText(formatDateStringNumeric(reviewer2AssignmentDate))).toBeInTheDocument()
    expect(
      screen.queryByText(formatDateStringNumeric(reviewer1AssignmentDate))
    ).not.toBeInTheDocument()
    expect(screen.getByText('Mario Rossi, Luigi Verdi')).toBeInTheDocument()
  })
})
