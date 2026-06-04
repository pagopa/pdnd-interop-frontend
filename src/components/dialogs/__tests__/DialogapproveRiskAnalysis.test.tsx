import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogApproveRiskAnalysis } from '../DialogApproveRiskAnalysis'
import * as router from '@/router'

const closeDialogMock = vi.fn()
const navigateMock = vi.fn()
const signRiskAnalysisMock = vi.fn()
const useSignRiskAnalysisMock = vi.fn()

vi.mock('@/stores', () => ({
  useDialog: () => ({
    closeDialog: closeDialogMock,
  }),
}))

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useSignRiskAnalysis: () => useSignRiskAnalysisMock(),
  },
}))

describe('DialogApproveRiskAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useSignRiskAnalysisMock.mockReturnValue({
      mutate: signRiskAnalysisMock,
      isPending: false,
    })
  })

  it('should render dialog informations', () => {
    render(<DialogApproveRiskAnalysis purposeId="test-purpose-id" type="approveRiskAnalysis" />)

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.confirm' })).toBeInTheDocument()
  })

  it('should close dialog when cancel is clicked', async () => {
    const user = userEvent.setup()

    render(<DialogApproveRiskAnalysis purposeId="test-purpose-id" type="approveRiskAnalysis" />)

    await user.click(
      screen.getByRole('button', {
        name: 'actions.cancel',
      })
    )

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })

  it('should call signRiskAnalysis when confirm is clicked', async () => {
    const user = userEvent.setup()

    render(<DialogApproveRiskAnalysis purposeId="test-purpose-id" type="approveRiskAnalysis" />)

    await user.click(
      screen.getByRole('button', {
        name: 'actions.confirm',
      })
    )

    expect(signRiskAnalysisMock).toHaveBeenCalledWith(
      {
        purposeId: 'test-purpose-id',
      },
      expect.any(Object)
    )

    expect(closeDialogMock).not.toHaveBeenCalled()
  })

  it('should navigate and close dialog on successful signing', async () => {
    const user = userEvent.setup()

    signRiskAnalysisMock.mockImplementation((_payload, options) => {
      options.onSuccess()
    })

    render(<DialogApproveRiskAnalysis purposeId="test-purpose-id" type="approveRiskAnalysis" />)

    await user.click(
      screen.getByRole('button', {
        name: 'actions.confirm',
      })
    )

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_APPROVAL_SUCCESS', {
      params: {
        purposeId: 'test-purpose-id',
      },
    })

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })

  it('should disable actions while request is pending', () => {
    useSignRiskAnalysisMock.mockReturnValue({
      mutate: signRiskAnalysisMock,
      isPending: true,
    })

    render(<DialogApproveRiskAnalysis purposeId="test-purpose-id" type="approveRiskAnalysis" />)

    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'actions.confirm' })).toBeDisabled()
  })
})
