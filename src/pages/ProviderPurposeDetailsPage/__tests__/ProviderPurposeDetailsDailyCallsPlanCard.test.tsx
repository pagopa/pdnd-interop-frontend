import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { ProviderPurposeDetailsDailyCallsPlanCard } from '../components/ProviderPurposeDetailsDailyCallsPlanCard'
import React from 'react'

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

const defaultPurpose = {
  id: 'purpose-1',
  eservice: { id: 'eservice-1' },
  currentVersion: {
    id: 'v1',
    state: 'ACTIVE',
    dailyCalls: 100,
  },
  waitingForApprovalVersion: undefined,
  rejectedVersion: undefined,
}

const purposeWithWaitingForApproval = {
  ...defaultPurpose,
  waitingForApprovalVersion: { id: 'v2', dailyCalls: 200 },
}

const purposeWithRejected = {
  ...defaultPurpose,
  currentVersion: undefined,
  rejectedVersion: { id: 'v3', dailyCalls: 300 },
}

const purposeWithSuspended = {
  ...defaultPurpose,
  currentVersion: { id: 'v1', state: 'SUSPENDED', dailyCalls: 100 },
  waitingForApprovalVersion: { id: 'v2', dailyCalls: 200 },
}

describe('ProviderPurposeDetailsDailyCallsPlanCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ isAdmin: true, organizationId: 'org-1' })
    useQueryMock.mockReturnValue({ data: [] })
  })

  it('renders active plan when no waiting or rejected', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={defaultPurpose} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByText('title.activePlan')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders change plan with buttons', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithWaitingForApproval} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByText('title.waitingForApprovalPlan.changePlan')).toBeInTheDocument()

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()

    expect(screen.getByText('rejectVersionButtonLabel.label')).toBeInTheDocument()

    expect(screen.getByText('activateVersionButtonLabel.label')).toBeInTheDocument()
  })

  it('calls activateVersion on confirm click', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithWaitingForApproval} />,
      {
        withReactQueryContext: true,
      }
    )

    fireEvent.click(screen.getByText('activateVersionButtonLabel.label'))

    expect(activateVersionMock).toHaveBeenCalledWith({
      purposeId: 'purpose-1',
      versionId: 'v2',
    })
  })

  it('opens dialog on reject click', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithWaitingForApproval} />,
      {
        withReactQueryContext: true,
      }
    )

    fireEvent.click(screen.getByText('rejectVersionButtonLabel.label'))

    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'rejectPurposeVersion',
      purposeId: 'purpose-1',
      versionId: 'v2',
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

    fireEvent.click(screen.getByText('activateVersionButtonLabel.label'))

    expect(activateVersionMock).toHaveBeenCalledWith({
      purposeId: 'purpose-1',
      versionId: 'v2',
      delegationId: 'delegation-1',
    })
  })

  it('renders rejected new purpose', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithRejected} />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('title.rejectedPlan')).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
  })

  it('disables buttons if suspended', () => {
    renderWithApplicationContext(
      <ProviderPurposeDetailsDailyCallsPlanCard purpose={purposeWithSuspended} />,
      { withReactQueryContext: true }
    )

    const activateBtn = screen.getByText('activateVersionButtonLabel.label')

    expect(activateBtn).toBeDisabled()
  })
})
