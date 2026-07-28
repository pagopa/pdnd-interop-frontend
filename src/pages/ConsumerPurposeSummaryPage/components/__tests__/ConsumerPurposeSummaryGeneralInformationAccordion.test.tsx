import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { ConsumerPurposeSummaryGeneralInformationAccordion } from '../ConsumerPurposeSummaryGeneralInformationAccordion'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { waitFor } from '@testing-library/react'

const useSuspenseQueryMock = vi.fn()
const remainingDailyCallsQueryFn = vi.fn().mockResolvedValue({
  remainingDailyCallsPerConsumer: 5,
  remainingDailyCallsTotal: 100,
})

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
})
