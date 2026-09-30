import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DialogRequestRiskAnalysisCompilation } from '../DialogRequestRiskAnalysisCompilation'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import i18n from '@/config/react-i18next'

vi.unmock('react-i18next')

const closeDialogMock = vi.fn()
const navigateMock = vi.fn()
const assignReviewerMock = vi.fn()
let isPendingMock = false

vi.mock('@/stores', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
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
  reviewerIds: ['reviewer-uuid-1'],
  reviewerNames: ['Mario Rossi'],
  hasRiskAnalysis: false,
}

const renderDialog = (overrides?: Partial<typeof defaultProps>) =>
  renderWithApplicationContext(
    <DialogRequestRiskAnalysisCompilation {...defaultProps} {...overrides} />,
    {
      withReactQueryContext: true,
    }
  )

describe('DialogRequestRiskAnalysisCompilation', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('it')
    isPendingMock = false
    closeDialogMock.mockReset()
    navigateMock.mockReset()
    assignReviewerMock.mockReset()
  })

  it('renders the dialog with title and description', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Richiedi compilazione e approvazione')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveTextContent(
      "Se confermi, assegnerai la compilazione e l'approvazione dell'analisi del rischio al valutatore Mario Rossi e non potrai più modificare questa scelta."
    )
    expect(screen.getByRole('dialog')).not.toHaveTextContent(
      'perderai tutte le informazioni dell’analisi del rischio già compilate'
    )
  })

  it.each([
    { reviewerNames: ['Mario Rossi'], assignmentText: 'Mario Rossi' },
    {
      reviewerNames: ['Mario Rossi', 'Anna Verdi'],
      assignmentText: 'Mario Rossi, Anna Verdi',
    },
  ])(
    'warns about losing existing risk analysis data for $reviewerNames',
    ({ reviewerNames, assignmentText }) => {
      renderDialog({ hasRiskAnalysis: true, reviewerNames })

      const dialog = screen.getByRole('dialog')
      expect(
        screen.getByText(
          `Se confermi, assegnerai la compilazione e l’approvazione dell’analisi del rischio a ${assignmentText} e perderai tutte le informazioni dell’analisi del rischio già compilate.`
        )
      ).toBeInTheDocument()
      expect(dialog).not.toHaveTextContent('non potrai più modificare questa scelta')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    }
  )

  it('renders the cancel and confirm CTAs', () => {
    renderDialog()

    expect(screen.getByRole('button', { name: 'Annulla' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Conferma' })).toBeInTheDocument()
  })

  it('on cancel, closes the dialog without calling the mutation', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'Annulla' }))

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(assignReviewerMock).not.toHaveBeenCalled()
  })

  it('on confirm, calls the mutation with the expected payload', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'Conferma' }))

    expect(assignReviewerMock).toHaveBeenCalledTimes(1)
    const [payload] = assignReviewerMock.mock.calls[0]
    expect(payload).toEqual({
      purposeId: 'purpose-id',
      reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
      reviewerIds: ['reviewer-uuid-1'],
    })
  })

  it('on confirm, forwards every selected reviewer', async () => {
    const user = userEvent.setup()
    renderDialog({
      reviewerIds: ['reviewer-uuid-1', 'reviewer-uuid-2'],
      reviewerNames: ['Mario Rossi', 'Anna Verdi'],
    })

    await user.click(screen.getByRole('button', { name: 'Conferma' }))

    const [payload] = assignReviewerMock.mock.calls[0]
    expect(payload).toEqual({
      purposeId: 'purpose-id',
      reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
      reviewerIds: ['reviewer-uuid-1', 'reviewer-uuid-2'],
    })
  })

  it('on mutation success, closes the dialog and navigates to the summary page', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'Conferma' }))

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

    await user.click(screen.getByRole('button', { name: 'Conferma' }))

    expect(assignReviewerMock).toHaveBeenCalledTimes(1)
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('disables both CTAs while the mutation is pending', () => {
    isPendingMock = true
    renderDialog()

    expect(screen.getByRole('button', { name: 'Annulla' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Conferma' })).toBeDisabled()
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

    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }))

    expect(closeDialogMock).not.toHaveBeenCalled()
  })
})
