import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { ProviderPurposeDetailsDailyCallsPlanCard } from '../components/ProviderPurposeDetailsDailyCallsPlanCard'
import { createMockPurpose } from '../../../../__mocks__/data/purpose.mocks'

mockUseJwt()

const activateVersionMock = vi.fn()
const openDialogMock = vi.fn()
const useQueryMock = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useActivateVersion: () => ({
      mutate: activateVersionMock,
    }),
  },
}))

vi.mock('@/stores', () => ({
  useDialog: () => ({
    openDialog: openDialogMock,
  }),
  useToastNotification: () => ({
    hideToast: vi.fn(),
  }),
  useToastNotificationStore: Object.assign(
    vi.fn((selector) => {
      const state = {
        isShown: false,
        message: '',
        severity: 'info' as const,
        showToast: vi.fn(),
      }
      return selector ? selector(state) : state
    }),
    {
      getState: () => ({
        showToast: vi.fn(),
      }),
    }
  ),
  useLoadingOverlayStore: Object.assign(
    vi.fn((selector) => {
      const state = {
        isLoadingOverlayShown: false,
        loadingOverlayMessage: '',
        showOverlay: vi.fn(),
        hideOverlay: vi.fn(),
      }
      return selector ? selector(state) : state
    }),
    {
      getState: () => ({
        showOverlay: vi.fn(),
        hideOverlay: vi.fn(),
      }),
    }
  ),
  useDialogStore: Object.assign(
    vi.fn((selector) => {
      const state = {
        dialog: null,
        openDialog: vi.fn(),
      }
      return selector ? selector(state) : state
    }),
    {
      getState: () => ({
        openDialog: vi.fn(),
      }),
    }
  ),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@/utils/format.utils', () => ({
  formatThousands: (v: number) => String(v),
}))

const defaultPurpose = createMockPurpose()

const purposeWithWaitingForApproval = {
  ...defaultPurpose,
  waitingForApprovalVersion: {
    id: 'v2',
    dailyCalls: 200,
    state: 'WAITING_FOR_APPROVAL' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
}

const purposeWithRejected = {
  ...defaultPurpose,
  currentVersion: undefined,
  rejectedVersion: {
    id: 'v3',
    dailyCalls: 300,
    state: 'REJECTED' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
}

const purposeWithSuspended = {
  ...defaultPurpose,
  currentVersion: {
    ...defaultPurpose.currentVersion!,
    state: 'SUSPENDED' as const,
  },
  waitingForApprovalVersion: {
    id: 'v2',
    dailyCalls: 200,
    state: 'SUSPENDED' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
}

describe('ProviderPurposeDetailsDailyCallsPlanCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useQueryMock.mockReturnValue({ data: [] })
  })

  it('renders active plan when no waiting or rejected', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={defaultPurpose} />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('title.activePlan')).toBeInTheDocument()
    expect(screen.getByText(String(defaultPurpose.currentVersion!.dailyCalls))).toBeInTheDocument()
  })

  it('renders change plan with buttons', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithWaitingForApproval} />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('title.waitingForApprovalPlan.changePlan')).toBeInTheDocument()

    expect(
      screen.getByText(String(purposeWithWaitingForApproval.currentVersion!.dailyCalls))
    ).toBeInTheDocument()

    expect(
      screen.getByText(String(purposeWithWaitingForApproval.waitingForApprovalVersion!.dailyCalls))
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'rejectVersionButtonLabel.label',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'activateVersionButtonLabel.label',
      })
    ).toBeInTheDocument()
  })

  it('calls activateVersion on confirm click', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithWaitingForApproval} />,
      { withReactQueryContext: true }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'activateVersionButtonLabel.label',
      })
    )

    expect(activateVersionMock).toHaveBeenCalledWith({
      purposeId: purposeWithWaitingForApproval.id,
      versionId: purposeWithWaitingForApproval.waitingForApprovalVersion!.id,
    })
  })

  it('opens dialog on reject click', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithWaitingForApproval} />,
      { withReactQueryContext: true }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'rejectVersionButtonLabel.label',
      })
    )

    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'rejectPurposeVersion',
      purposeId: purposeWithWaitingForApproval.id,
      versionId: purposeWithWaitingForApproval.waitingForApprovalVersion!.id,
      isChangePlanRequest: true,
    })
  })

  it('passes delegationId when delegation exists', () => {
    useQueryMock.mockReturnValue({
      data: [{ id: 'delegation-1' }],
    })

    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithWaitingForApproval} />,
      { withReactQueryContext: true }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'activateVersionButtonLabel.label',
      })
    )

    expect(activateVersionMock).toHaveBeenCalledWith({
      purposeId: purposeWithWaitingForApproval.id,
      versionId: purposeWithWaitingForApproval.waitingForApprovalVersion!.id,
      delegationId: 'delegation-1',
    })
  })

  it('renders rejected new purpose', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithRejected} />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('title.rejectedPlan')).toBeInTheDocument()

    expect(
      screen.getByText(String(purposeWithRejected.rejectedVersion!.dailyCalls))
    ).toBeInTheDocument()
  })

  it('disables buttons if suspended', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithSuspended} />,
      { withReactQueryContext: true }
    )

    const activateBtn = screen.getByRole('button', {
      name: 'activateVersionButtonLabel.label',
    })

    expect(activateBtn).toBeDisabled()
  })
})
