import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConsumerPurposePublishThankYouPage from '../ConsumerPurposePublishThankYou.page'
import { mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

const mockPurposeId = 'test-purpose-id'
mockUseParams({ purposeId: mockPurposeId })

const navigateMock = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ['purpose', id],
  },
}))

const useQueryMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

describe('ConsumerPurposePublishThankYouPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows loading state before stabilization', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'ACTIVE' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('loading')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'active.title' })).not.toBeInTheDocument()
  })

  it('shows loading state when purpose data is not available', () => {
    useQueryMock.mockReturnValue({ data: undefined, isLoading: true })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('renders active title and description after stabilization when purpose is ACTIVE', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'ACTIVE' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByRole('heading', { name: 'active.title' })).toBeInTheDocument()
    expect(screen.getByText('active.description')).toBeInTheDocument()
  })

  it('renders waiting for approval title after stabilization when purpose is WAITING_FOR_APPROVAL', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'WAITING_FOR_APPROVAL' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByRole('heading', { name: 'waitingForApproval.title' })).toBeInTheDocument()
    expect(screen.getByText('waitingForApproval.description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'waitingForApproval.action' })).toBeInTheDocument()
  })

  it('navigates to purpose details when close button is clicked', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()

    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'ACTIVE' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: 'action' })).toBeInTheDocument()
      },
      { timeout: 2000 }
    )

    await user.click(screen.getByRole('button', { name: 'action' }))

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_DETAILS', {
      params: { purposeId: mockPurposeId },
    })
  })
})
