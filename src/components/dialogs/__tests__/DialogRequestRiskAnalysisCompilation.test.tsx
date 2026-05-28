import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DialogRequestRiskAnalysisCompilation } from '../DialogRequestRiskAnalysisCompilation'

const closeDialogMock = vi.fn()
const navigateMock = vi.fn()
const assignReviewerMock = vi.fn()
let isPendingMock = false

vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: closeDialogMock }),
}))

vi.mock('@/router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useAssignRiskAnalysisReviewer: () => ({
      mutate: assignReviewerMock,
      isPending: isPendingMock,
    }),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (_ns: string, opts?: { keyPrefix?: string }) => ({
    t: (key: string, values?: Record<string, string>) => {
      const fullKey = opts?.keyPrefix ? `${opts.keyPrefix}.${key}` : key
      if (!values) return fullKey
      return `${fullKey}|${Object.entries(values)
        .map(([k, v]) => `${k}=${v}`)
        .join(',')}`
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const defaultProps = {
  type: 'requestRiskAnalysisCompilation' as const,
  purposeId: 'purpose-id',
  reviewerId: 'reviewer-uuid-1',
  reviewerName: 'Mario Rossi',
}

describe('DialogRequestRiskAnalysisCompilation', () => {
  beforeEach(() => {
    isPendingMock = false
    closeDialogMock.mockReset()
    navigateMock.mockReset()
    assignReviewerMock.mockReset()
  })

  it('renders title and description with the reviewer name interpolated', () => {
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogRequestRiskAnalysisCompilation.title')).toBeInTheDocument()
    expect(
      screen.getByText(
        /dialogRequestRiskAnalysisCompilation\.description.*reviewerName=Mario Rossi/
      )
    ).toBeInTheDocument()
  })

  it('renders the cancel and confirm CTAs', () => {
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.confirm' })).toBeInTheDocument()
  })

  it('on cancel, closes the dialog without calling the mutation', async () => {
    const user = userEvent.setup()
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'actions.cancel' }))

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(assignReviewerMock).not.toHaveBeenCalled()
  })

  it('on confirm, calls the mutation with the expected payload', async () => {
    const user = userEvent.setup()
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'actions.confirm' }))

    expect(assignReviewerMock).toHaveBeenCalledTimes(1)
    const [payload] = assignReviewerMock.mock.calls[0]
    expect(payload).toEqual({
      purposeId: 'purpose-id',
      reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
      reviewerIds: ['reviewer-uuid-1'],
    })
  })

  it('on mutation success, closes the dialog and navigates to the summary page', async () => {
    const user = userEvent.setup()
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'actions.confirm' }))

    const [, options] = assignReviewerMock.mock.calls[0]
    options.onSuccess()

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-id' },
    })
  })

  it('does not close or navigate when the mutation does not invoke onSuccess (error path)', async () => {
    const user = userEvent.setup()
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'actions.confirm' }))

    expect(assignReviewerMock).toHaveBeenCalledTimes(1)
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('disables the cancel CTA while the mutation is pending', () => {
    isPendingMock = true
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeDisabled()
  })

  it('does not close the dialog when cancel is clicked while the mutation is pending', () => {
    isPendingMock = true
    render(<DialogRequestRiskAnalysisCompilation {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'actions.cancel' }))

    expect(closeDialogMock).not.toHaveBeenCalled()
  })
})
