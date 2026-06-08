import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogRejectRiskAnalysis } from '../DialogRejectRiskAnalysis'
import * as router from '@/router'

const closeDialogMock = vi.fn()
const navigateMock = vi.fn()
const rejectRiskAnalysisMock = vi.fn()
const useRejectRiskAnalysisMock = vi.fn()

vi.mock('@/stores', () => ({
  useDialog: () => ({
    closeDialog: closeDialogMock,
  }),
}))

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useRejectRiskAnalysis: () => useRejectRiskAnalysisMock(),
  },
}))

describe('DialogRejectRiskAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useRejectRiskAnalysisMock.mockReturnValue({
      mutate: rejectRiskAnalysisMock,
      isPending: false,
    })
  })

  it('should render dialog informations', () => {
    render(<DialogRejectRiskAnalysis purposeId="test-purpose-id" type="rejectRiskAnalysis" />)

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.confirm' })).toBeInTheDocument()
    expect(screen.getByLabelText('reasonField.label')).toBeInTheDocument()
  })

  it('should close dialog when cancel is clicked', async () => {
    const user = userEvent.setup()

    render(<DialogRejectRiskAnalysis purposeId="test-purpose-id" type="rejectRiskAnalysis" />)

    await user.click(
      screen.getByRole('button', {
        name: 'actions.cancel',
      })
    )

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })

  it('should call rejectRiskAnalysis when confirm is clicked', async () => {
    const user = userEvent.setup()

    render(<DialogRejectRiskAnalysis purposeId="test-purpose-id" type="rejectRiskAnalysis" />)

    await user.type(screen.getByLabelText('reasonField.label'), 'Motivazione di rifiuto valida')

    await user.click(
      screen.getByRole('button', {
        name: 'actions.confirm',
      })
    )

    expect(rejectRiskAnalysisMock).toHaveBeenCalledWith(
      {
        purposeId: 'test-purpose-id',
        rejectionReason: 'Motivazione di rifiuto valida',
      },
      expect.any(Object)
    )

    expect(closeDialogMock).not.toHaveBeenCalled()
  })

  it('should navigate and close dialog on successful rejection', async () => {
    const user = userEvent.setup()

    rejectRiskAnalysisMock.mockImplementation((_payload, options) => {
      options.onSuccess()
    })

    render(<DialogRejectRiskAnalysis purposeId="test-purpose-id" type="rejectRiskAnalysis" />)

    await user.type(screen.getByLabelText('reasonField.label'), 'Motivazione di rifiuto valida')

    await user.click(
      screen.getByRole('button', {
        name: 'actions.confirm',
      })
    )

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_REJECTION_SUCCESS', {
      params: {
        purposeId: 'test-purpose-id',
      },
    })

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })

  it('should disable actions while request is pending', () => {
    useRejectRiskAnalysisMock.mockReturnValue({
      mutate: rejectRiskAnalysisMock,
      isPending: true,
    })

    render(<DialogRejectRiskAnalysis purposeId="test-purpose-id" type="rejectRiskAnalysis" />)

    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'actions.confirm' })).toBeDisabled()
  })
})
