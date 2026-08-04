import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PurposeEditStepAssignmentForm, {
  type PurposeEditStepAssignmentFormValues,
} from '../PurposeEditStepAssignmentForm'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { CompactUser, Purpose, RiskAnalysisReviewMode, User } from '@/api/api.generatedTypes'

const assignReviewerMock = vi.fn()
const openDialogMock = vi.fn()
const navigateMock = vi.fn()
const useAssignRiskAnalysisReviewerMock = vi.fn((..._args: Array<unknown>) => ({
  mutate: assignReviewerMock,
}))

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useAssignRiskAnalysisReviewer: (...args: Array<unknown>) =>
      useAssignRiskAnalysisReviewerMock(...args),
  },
}))

vi.mock('@/stores', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ openDialog: openDialogMock, closeDialog: vi.fn() }),
  }
})

vi.mock('@/router', () => ({
  Link: ({ children, ...props }: React.PropsWithChildren) => <a {...props}>{children}</a>,
  useNavigate: () => navigateMock,
}))

const mockReviewer: User = {
  userId: 'reviewer-uuid-1',
  tenantId: 'tenant-uuid',
  name: 'Mario',
  familyName: 'Rossi',
  roles: ['reviewer'],
}

const mockReviewer2: User = {
  userId: 'reviewer-uuid-2',
  tenantId: 'tenant-uuid',
  name: 'Anna',
  familyName: 'Verdi',
  roles: ['reviewer'],
}

const DEFAULT_VALUES: PurposeEditStepAssignmentFormValues = {
  reviewMode: 'ADMIN_WRITES_ADMIN_SIGNS',
  reviewerIds: [],
}

/** Builds a purpose that already carries a persisted assignment, i.e. the edit flow. */
function buildAssignedPurpose(
  reviewMode: RiskAnalysisReviewMode,
  reviewers: Array<CompactUser>
): Purpose {
  const base = createMockPurpose({ id: 'purpose-id' })
  return {
    ...base,
    reviewMode,
    reviewerWorkflow: { reviewers, signingState: 'ASSIGNED' },
  }
}

function renderComponent(overrides?: {
  purpose?: Purpose
  reviewers?: Array<User>
  isDelegate?: boolean
  selfcareUsersPageUrl?: string
  defaultValues?: PurposeEditStepAssignmentFormValues
  forward?: VoidFunction
  back?: VoidFunction
}) {
  const purpose = overrides?.purpose ?? createMockPurpose({ id: 'purpose-id' })
  return renderWithApplicationContext(
    <PurposeEditStepAssignmentForm
      purpose={purpose}
      reviewers={overrides?.reviewers ?? [mockReviewer, mockReviewer2]}
      isDelegate={overrides?.isDelegate ?? false}
      selfcareUsersPageUrl={overrides?.selfcareUsersPageUrl ?? 'https://selfcare.test/users'}
      defaultValues={overrides?.defaultValues ?? DEFAULT_VALUES}
      activeStep={1}
      forward={overrides?.forward ?? vi.fn()}
      back={overrides?.back ?? vi.fn()}
    />,
    { withReactQueryContext: true, withRouterContext: true }
  )
}

/** Opens the reviewers dropdown, picks the given names and closes it again. */
async function selectReviewers(user: ReturnType<typeof userEvent.setup>, names: Array<string>) {
  await user.click(screen.getByRole('combobox', { name: 'reviewerField.inputLabel' }))
  for (const name of names) {
    await user.click(await screen.findByRole('option', { name }))
  }
  await user.keyboard('{Escape}')
}

describe('PurposeEditStepAssignmentForm', () => {
  beforeEach(() => {
    assignReviewerMock.mockReset()
    openDialogMock.mockReset()
    navigateMock.mockReset()
    useAssignRiskAnalysisReviewerMock.mockClear()
  })

  it('renders the 3 review mode options with the first one selected by default', () => {
    renderComponent()

    expect(
      screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS' })
    ).toBeChecked()
    expect(
      screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
    ).not.toBeChecked()
    expect(
      screen.getByRole('radio', { name: 'reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS' })
    ).not.toBeChecked()
  })

  it('does not show the reviewer autocomplete when the first option is selected', () => {
    renderComponent()
    expect(
      screen.queryByRole('combobox', {
        name: /reviewerField.label/,
      })
    ).not.toBeInTheDocument()
  })

  it('shows the "approver" autocomplete with the reviewer required error when option 2 is selected', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
    )
    expect(
      screen.getByText('reviewerField.label.ADMIN_WRITES_REVIEWER_SIGNS')
    ).toBeInTheDocument()

    expect(screen.getByRole('combobox', { name: 'reviewerField.inputLabel' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'forwardBtn' }))
    expect(await screen.findByText('reviewerField.requiredError')).toBeInTheDocument()
    expect(assignReviewerMock).not.toHaveBeenCalled()
  })

  it('marks the reviewer autocomplete as required (asterisk on the label)', async () => {
    const user = userEvent.setup()
    const { container } = renderComponent()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
    )

    const label = screen.getByText('reviewerField.inputLabel')
    expect(label.querySelector('.MuiFormLabel-asterisk')).toBeInTheDocument()
    expect(container.querySelector('input[required]')).toBeInTheDocument()
  })

  it('shows the "compiler" autocomplete when option 3 is selected, populated with the same list', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS' })
    )
    expect(
      screen.getByText('reviewerField.label.REVIEWER_WRITES_REVIEWER_SIGNS')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'reviewerField.inputLabel' }))
    expect(await screen.findByRole('option', { name: 'Mario Rossi' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Anna Verdi' })).toBeInTheDocument()
  })

  it('switches the primary CTA to "request compilation" when option 3 is selected', async () => {
    const user = userEvent.setup()
    renderComponent()

    expect(screen.getByRole('button', { name: 'forwardBtn' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'requestReviewerCompilationBtn' })
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS' })
    )

    expect(
      screen.getByRole('button', { name: 'requestReviewerCompilationBtn' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'forwardBtn' })).not.toBeInTheDocument()
  })

  it('uses the Save icon on the primary CTA for option 1 and 2, and the Send icon for option 3', async () => {
    const user = userEvent.setup()
    renderComponent()

    const forwardBtn = screen.getByRole('button', { name: 'forwardBtn' })
    expect(within(forwardBtn).getByTestId('SaveIcon')).toBeInTheDocument()
    expect(within(forwardBtn).queryByTestId('SendIcon')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
    )
    const forwardBtn2 = screen.getByRole('button', { name: 'forwardBtn' })
    expect(within(forwardBtn2).getByTestId('SaveIcon')).toBeInTheDocument()
    expect(within(forwardBtn2).queryByTestId('SendIcon')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS' })
    )
    const requestBtn = screen.getByRole('button', { name: 'requestReviewerCompilationBtn' })
    expect(within(requestBtn).getByTestId('SendIcon')).toBeInTheDocument()
    expect(within(requestBtn).queryByTestId('SaveIcon')).not.toBeInTheDocument()
  })

  describe('first compilation', () => {
    it('asks for no success feedback, since the first assignment is silent', () => {
      renderComponent()

      expect(useAssignRiskAnalysisReviewerMock).toHaveBeenCalledWith({ feedback: 'none' })
    })

    it('on submit with option 1, persists the self-compilation mode without reviewers and forwards', async () => {
      const user = userEvent.setup()
      const forward = vi.fn()
      renderComponent({ reviewers: [mockReviewer], forward })

      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(assignReviewerMock).toHaveBeenCalledWith(
        {
          purposeId: 'purpose-id',
          reviewMode: 'ADMIN_WRITES_ADMIN_SIGNS',
          reviewerIds: undefined,
        },
        expect.objectContaining({ onSuccess: forward })
      )
      expect(openDialogMock).not.toHaveBeenCalled()
    })

    it('on submit with option 2 and a reviewer selected, calls the API and forwards on success', async () => {
      const user = userEvent.setup()
      const forward = vi.fn()
      renderComponent({ reviewers: [mockReviewer], forward })

      await user.click(
        screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
      )
      await selectReviewers(user, ['Mario Rossi'])
      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(assignReviewerMock).toHaveBeenCalledWith(
        {
          purposeId: 'purpose-id',
          reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          reviewerIds: ['reviewer-uuid-1'],
        },
        expect.objectContaining({ onSuccess: forward })
      )
    })

    it('sends every selected reviewer, not just the first one', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(
        screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
      )
      await selectReviewers(user, ['Mario Rossi', 'Anna Verdi'])
      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(assignReviewerMock).toHaveBeenCalledWith(
        expect.objectContaining({ reviewerIds: ['reviewer-uuid-1', 'reviewer-uuid-2'] }),
        expect.anything()
      )
    })

    it('on submit with option 3, opens the compilation dialog without calling the API', async () => {
      const user = userEvent.setup()
      const forward = vi.fn()
      renderComponent({ forward })

      await user.click(
        screen.getByRole('radio', {
          name: 'reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS',
        })
      )
      await selectReviewers(user, ['Mario Rossi', 'Anna Verdi'])
      await user.click(screen.getByRole('button', { name: 'requestReviewerCompilationBtn' }))

      expect(assignReviewerMock).not.toHaveBeenCalled()
      expect(forward).not.toHaveBeenCalled()
      expect(openDialogMock).toHaveBeenCalledWith({
        type: 'requestRiskAnalysisCompilation',
        purposeId: 'purpose-id',
        reviewerIds: ['reviewer-uuid-1', 'reviewer-uuid-2'],
        reviewerNames: ['Mario Rossi', 'Anna Verdi'],
      })
    })

    it('drops the selected reviewers when switching back to option 1 before submitting', async () => {
      const user = userEvent.setup()
      const forward = vi.fn()
      renderComponent({ reviewers: [mockReviewer], forward })

      await user.click(
        screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
      )
      await selectReviewers(user, ['Mario Rossi'])
      await user.click(
        screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS' })
      )
      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(assignReviewerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          reviewMode: 'ADMIN_WRITES_ADMIN_SIGNS',
          reviewerIds: undefined,
        }),
        expect.anything()
      )
    })
  })

  describe('edit of an existing assignment', () => {
    const assignedPurpose = () =>
      buildAssignedPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [
        { userId: mockReviewer.userId, name: 'Mario', familyName: 'Rossi' },
      ])

    const editDefaultValues: PurposeEditStepAssignmentFormValues = {
      reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
      reviewerIds: [mockReviewer.userId],
    }

    it('asks for the edit feedback so the dedicated snackbar is shown', () => {
      renderComponent({ purpose: assignedPurpose(), defaultValues: editDefaultValues })

      expect(useAssignRiskAnalysisReviewerMock).toHaveBeenCalledWith({ feedback: 'edit' })
    })

    it('opens the confirmation dialog with the mode change and the added reviewer, without calling the API', async () => {
      const user = userEvent.setup()
      renderComponent({ purpose: assignedPurpose(), defaultValues: editDefaultValues })

      await selectReviewers(user, ['Anna Verdi'])
      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(assignReviewerMock).not.toHaveBeenCalled()
      expect(openDialogMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'editRiskAnalysisAssignment',
          fromMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          toMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          addedReviewerNames: ['Anna Verdi'],
          removedReviewerNames: [],
        })
      )
    })

    it('reports the dropped reviewers as removed when the new mode needs none', async () => {
      const user = userEvent.setup()
      renderComponent({ purpose: assignedPurpose(), defaultValues: editDefaultValues })

      await user.click(
        screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS' })
      )
      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(openDialogMock).toHaveBeenCalledWith(
        expect.objectContaining({
          fromMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          toMode: 'ADMIN_WRITES_ADMIN_SIGNS',
          addedReviewerNames: [],
          removedReviewerNames: ['Mario Rossi'],
        })
      )
    })

    it('runs the mutation only when the dialog is confirmed', async () => {
      const user = userEvent.setup()
      const forward = vi.fn()
      renderComponent({ purpose: assignedPurpose(), defaultValues: editDefaultValues, forward })

      await user.click(
        screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS' })
      )
      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(assignReviewerMock).not.toHaveBeenCalled()

      openDialogMock.mock.calls[0][0].onConfirm()

      expect(assignReviewerMock).toHaveBeenCalledWith(
        {
          purposeId: 'purpose-id',
          reviewMode: 'ADMIN_WRITES_ADMIN_SIGNS',
          reviewerIds: undefined,
        },
        expect.objectContaining({ onSuccess: forward })
      )
    })

    it('goes to the summary instead of the next step when the new mode is the reviewer compilation', async () => {
      const user = userEvent.setup()
      renderComponent({ purpose: assignedPurpose(), defaultValues: editDefaultValues })

      await user.click(
        screen.getByRole('radio', {
          name: 'reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS',
        })
      )
      await user.click(screen.getByRole('button', { name: 'requestReviewerCompilationBtn' }))

      openDialogMock.mock.calls[0][0].onConfirm()
      assignReviewerMock.mock.calls[0][1].onSuccess()

      expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
        params: { purposeId: 'purpose-id' },
      })
    })

    it('skips the dialog and just moves on when nothing was changed', async () => {
      const user = userEvent.setup()
      const forward = vi.fn()
      renderComponent({ purpose: assignedPurpose(), defaultValues: editDefaultValues, forward })

      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(openDialogMock).not.toHaveBeenCalled()
      expect(assignReviewerMock).not.toHaveBeenCalled()
      expect(forward).toHaveBeenCalled()
    })
  })

  describe('reviewer removed from the institution', () => {
    const removedReviewer: CompactUser = {
      userId: 'removed-uuid',
      name: 'Luca',
      familyName: 'Neri',
    }
    const purposeWithRemovedReviewer = () =>
      buildAssignedPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [removedReviewer])
    const defaultValues: PurposeEditStepAssignmentFormValues = {
      reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
      reviewerIds: [removedReviewer.userId],
    }

    it('keeps the removed reviewer visible as a selected chip', () => {
      renderComponent({ purpose: purposeWithRemovedReviewer(), defaultValues })

      expect(screen.getByText('Luca Neri')).toBeInTheDocument()
    })

    it('does not offer the removed reviewer among the dropdown options', async () => {
      const user = userEvent.setup()
      renderComponent({ purpose: purposeWithRemovedReviewer(), defaultValues })

      await user.click(screen.getByRole('combobox', { name: 'reviewerField.inputLabel' }))

      expect(await screen.findByRole('option', { name: 'Mario Rossi' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Luca Neri' })).not.toBeInTheDocument()
    })

    it('blocks the submit with a singular error while the removed reviewer is still selected', async () => {
      const user = userEvent.setup()
      renderComponent({ purpose: purposeWithRemovedReviewer(), defaultValues })

      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(await screen.findByText('reviewerField.removedError')).toBeInTheDocument()
      expect(assignReviewerMock).not.toHaveBeenCalled()
      expect(openDialogMock).not.toHaveBeenCalled()
    })

    it('blocks the submit when more than one assigned reviewer was removed', async () => {
      const user = userEvent.setup()
      const otherRemoved: CompactUser = {
        userId: 'removed-uuid-2',
        name: 'Sara',
        familyName: 'Gialli',
      }
      renderComponent({
        purpose: buildAssignedPurpose('ADMIN_WRITES_REVIEWER_SIGNS', [
          removedReviewer,
          otherRemoved,
        ]),
        defaultValues: {
          reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
          reviewerIds: [removedReviewer.userId, otherRemoved.userId],
        },
      })

      await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

      expect(await screen.findByText('reviewerField.removedError')).toBeInTheDocument()
      expect(assignReviewerMock).not.toHaveBeenCalled()
    })
  })

  it('prefills the form from defaultValues so coming back to the step preserves the selection', () => {
    renderComponent({
      defaultValues: {
        reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        reviewerIds: [mockReviewer2.userId],
      },
    })

    expect(
      screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS' })
    ).toBeChecked()
    expect(screen.getByText('Anna Verdi')).toBeInTheDocument()
  })

  it('shows the info alert and hides the form when the institution has no reviewers', () => {
    renderComponent({ reviewers: [] })

    expect(screen.getByText('noReviewersAlert.message')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'noReviewersAlert.linkLabel' })).toHaveAttribute(
      'href',
      'https://selfcare.test/users'
    )
    expect(
      screen.queryByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'backWithoutSaveBtn' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'forwardBtn' })).toBeInTheDocument()
  })

  it('on submit with no reviewers, does not call the API and forwards', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()
    renderComponent({ reviewers: [], forward })

    await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

    expect(assignReviewerMock).not.toHaveBeenCalled()
    expect(forward).toHaveBeenCalled()
  })

  it('shows the delegate warning alert and hides the form when the institution is a delegate', () => {
    renderComponent({ isDelegate: true })

    expect(screen.getByText('delegateAlert')).toBeInTheDocument()
    expect(
      screen.queryByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'backWithoutSaveBtn' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'forwardBtn' })).toBeInTheDocument()
  })

  it('on submit as delegate, does not call the API and forwards', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()
    renderComponent({ isDelegate: true, forward })

    await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

    expect(assignReviewerMock).not.toHaveBeenCalled()
    expect(forward).toHaveBeenCalled()
  })

  it('does not show the alert and renders the form when the institution has at least one reviewer', () => {
    renderComponent({ reviewers: [mockReviewer] })

    expect(screen.queryByText('noReviewersAlert.message')).not.toBeInTheDocument()
    expect(screen.queryByText('delegateAlert')).not.toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: 'reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS' })
    ).toBeInTheDocument()
  })

  it('calls back() when the secondary CTA is clicked', async () => {
    const user = userEvent.setup()
    const back = vi.fn()
    renderComponent({ back })

    await user.click(screen.getByRole('button', { name: 'backWithoutSaveBtn' }))

    expect(back).toHaveBeenCalledTimes(1)
  })
})
