import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
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
  })

  it('renders nothing when purpose data is not available', () => {
    useQueryMock.mockReturnValue({ data: undefined, isLoading: true })

    const { container } = renderWithApplicationContext(
      <ConsumerPurposePublishThankYouPage />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(container.innerHTML).toBe('')
  })

  it('renders active title and description when purpose is ACTIVE', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'ACTIVE' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('heading', { name: 'active.title' })).toBeInTheDocument()
    expect(screen.getByText('active.description')).toBeInTheDocument()
  })

  it('renders waiting for approval title when purpose is WAITING_FOR_APPROVAL', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'WAITING_FOR_APPROVAL' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByRole('heading', { name: 'waitingForApproval.title' })
    ).toBeInTheDocument()
    expect(screen.getByText('waitingForApproval.description')).toBeInTheDocument()
  })

  it('renders close button', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'ACTIVE' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'action' })).toBeInTheDocument()
  })

  it('navigates to purpose details when close button is clicked', async () => {
    const user = userEvent.setup()

    useQueryMock.mockReturnValue({
      data: createMockPurpose({ currentVersion: { state: 'ACTIVE' } }),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposePublishThankYouPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'action' }))

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_DETAILS', {
      params: { purposeId: mockPurposeId },
    })
  })
})
