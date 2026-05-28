import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DialogRequestRiskAnalysisCompilation } from '../DialogRequestRiskAnalysisCompilation'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const closeDialogMock = vi.fn()
const navigateMock = vi.fn()
const assignReviewerMock = vi.fn()
let isPendingMock = false

vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: closeDialogMock }),
  }
})

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

const defaultProps = {
  type: 'requestRiskAnalysisCompilation' as const,
  purposeId: 'purpose-id',
  reviewerId: 'reviewer-uuid-1',
  reviewerName: 'Mario Rossi',
}

const renderDialog = () =>
  renderWithApplicationContext(<DialogRequestRiskAnalysisCompilation {...defaultProps} />, {
    withReactQueryContext: true,
  })

describe('DialogRequestRiskAnalysisCompilation', () => {
  beforeEach(() => {
    isPendingMock = false
    closeDialogMock.mockReset()
    navigateMock.mockReset()
    assignReviewerMock.mockReset()
  })

  it('renders the dialog with title and description', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('renders the cancel and confirm CTAs', () => {
    renderDialog()

    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'confirm' })).toBeInTheDocument()
  })

  it('on cancel, closes the dialog without calling the mutation', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'cancel' }))

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(assignReviewerMock).not.toHaveBeenCalled()
  })

  it('on confirm, calls the mutation with the expected payload', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

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
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

    const [, options] = assignReviewerMock.mock.calls[0]
    options.onSuccess()

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-id' },
    })
  })

  it('does not close or navigate when the mutation does not invoke onSuccess (error path)', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

    expect(assignReviewerMock).toHaveBeenCalledTimes(1)
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('disables both CTAs while the mutation is pending', () => {
    isPendingMock = true
    renderDialog()

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
  })

  it('shows the loading indicator on the confirm CTA while the mutation is pending', () => {
    isPendingMock = true
    renderDialog()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  // userEvent refuses to click disabled buttons (pointer-events: none); fireEvent respects
  // browser semantics: click events on disabled buttons do not propagate to onClick.
  it('does not close the dialog when cancel is clicked while the mutation is pending', () => {
    isPendingMock = true
    renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'cancel' }))

    expect(closeDialogMock).not.toHaveBeenCalled()
  })
})
