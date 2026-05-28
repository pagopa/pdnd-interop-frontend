import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PurposeEditStepAssignmentForm, {
  type PurposeEditStepAssignmentFormValues,
} from '../PurposeEditStepAssignmentForm'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { User } from '@/api/api.generatedTypes'

const assignReviewerMock = vi.fn()
const openDialogMock = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useAssignRiskAnalysisReviewer: () => ({ mutate: assignReviewerMock }),
  },
}))

vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ openDialog: openDialogMock, closeDialog: vi.fn() }),
  }
})

vi.mock('@/router', () => ({
  Link: ({ children, ...props }: React.PropsWithChildren) => <a {...props}>{children}</a>,
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
  reviewMode: 'selfWritesSelfSigns',
  reviewerId: undefined,
}

function renderComponent(overrides?: {
  reviewers?: Array<User>
  isDelegate?: boolean
  selfcareUsersPageUrl?: string
  defaultValues?: PurposeEditStepAssignmentFormValues
  forward?: VoidFunction
}) {
  const purpose = createMockPurpose({ id: 'purpose-id' })
  return renderWithApplicationContext(
    <PurposeEditStepAssignmentForm
      purpose={purpose}
      reviewers={overrides?.reviewers ?? [mockReviewer, mockReviewer2]}
      isDelegate={overrides?.isDelegate ?? false}
      selfcareUsersPageUrl={overrides?.selfcareUsersPageUrl ?? 'https://selfcare.test/users'}
      defaultValues={overrides?.defaultValues ?? DEFAULT_VALUES}
      activeStep={1}
      forward={overrides?.forward ?? vi.fn()}
      back={vi.fn()}
    />,
    { withReactQueryContext: true, withRouterContext: true }
  )
}

describe('PurposeEditStepAssignmentForm', () => {
  beforeEach(() => {
    assignReviewerMock.mockReset()
    openDialogMock.mockReset()
  })

  it('renders the 3 review mode options with the first one selected by default', () => {
    renderComponent()

    const selfWritesSelfSigns = screen.getByRole('radio', {
      name: 'reviewModeField.options.selfWritesSelfSigns',
    })
    const selfWritesReviewerSigns = screen.getByRole('radio', {
      name: 'reviewModeField.options.selfWritesReviewerSigns',
    })
    const reviewerWritesReviewerSigns = screen.getByRole('radio', {
      name: 'reviewModeField.options.reviewerWritesReviewerSigns',
    })

    expect(selfWritesSelfSigns).toBeChecked()
    expect(selfWritesReviewerSigns).not.toBeChecked()
    expect(reviewerWritesReviewerSigns).not.toBeChecked()
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
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesReviewerSigns' })
    )

    expect(
      screen.getByRole('combobox', {
        name: 'reviewerField.label.selfWritesReviewerSigns',
      })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'forwardBtn' }))
    expect(await screen.findByText('reviewerField.requiredError')).toBeInTheDocument()
    expect(assignReviewerMock).not.toHaveBeenCalled()
  })

  it('marks the reviewer autocomplete as required (asterisk on the label)', async () => {
    const user = userEvent.setup()
    const { container } = renderComponent()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesReviewerSigns' })
    )

    const label = screen.getByText('reviewerField.label.selfWritesReviewerSigns')
    expect(label.querySelector('.MuiFormLabel-asterisk')).toBeInTheDocument()
    expect(container.querySelector('input[required]')).toBeInTheDocument()
  })

  it('shows the "compiler" autocomplete with the reviewer required error when option 3 is selected, populated with the same list', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.reviewerWritesReviewerSigns' })
    )

    const autocomplete = screen.getByRole('combobox', {
      name: 'reviewerField.label.reviewerWritesReviewerSigns',
    })
    expect(autocomplete).toBeInTheDocument()

    await user.click(autocomplete)
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
    expect(screen.getByText('Anna Verdi')).toBeInTheDocument()
  })

  it('switches the primary CTA to "request compilation" when option 3 is selected', async () => {
    const user = userEvent.setup()
    renderComponent()

    expect(screen.getByRole('button', { name: 'forwardBtn' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'requestReviewerCompilationBtn' })
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.reviewerWritesReviewerSigns' })
    )

    expect(
      screen.getByRole('button', { name: 'requestReviewerCompilationBtn' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'forwardBtn' })).not.toBeInTheDocument()
  })

  it('uses the Save icon on the primary CTA for option 1 and 2, and the ArrowForward icon for option 3', async () => {
    const user = userEvent.setup()
    renderComponent()

    const forwardBtn = screen.getByRole('button', { name: 'forwardBtn' })
    expect(within(forwardBtn).getByTestId('SaveIcon')).toBeInTheDocument()
    expect(within(forwardBtn).queryByTestId('ArrowForwardIcon')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesReviewerSigns' })
    )
    const forwardBtn2 = screen.getByRole('button', { name: 'forwardBtn' })
    expect(within(forwardBtn2).getByTestId('SaveIcon')).toBeInTheDocument()
    expect(within(forwardBtn2).queryByTestId('ArrowForwardIcon')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.reviewerWritesReviewerSigns' })
    )
    const requestBtn = screen.getByRole('button', { name: 'requestReviewerCompilationBtn' })
    expect(within(requestBtn).getByTestId('ArrowForwardIcon')).toBeInTheDocument()
    expect(within(requestBtn).queryByTestId('SaveIcon')).not.toBeInTheDocument()
  })

  it('on submit with option 1, does not call the API and forwards', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()
    renderComponent({ reviewers: [mockReviewer], forward })

    await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

    expect(assignReviewerMock).not.toHaveBeenCalled()
    expect(forward).toHaveBeenCalled()
  })

  it('on submit with option 2 and a reviewer selected, calls the API and forwards on success', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()
    renderComponent({ reviewers: [mockReviewer], forward })

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesReviewerSigns' })
    )
    await user.click(
      screen.getByRole('combobox', { name: 'reviewerField.label.selfWritesReviewerSigns' })
    )
    await user.click(screen.getByText('Mario Rossi'))
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

  it('on submit with option 3 and a reviewer selected, opens the confirmation dialog without calling the API', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()
    renderComponent({ reviewers: [mockReviewer], forward })

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.reviewerWritesReviewerSigns' })
    )
    await user.click(
      screen.getByRole('combobox', { name: 'reviewerField.label.reviewerWritesReviewerSigns' })
    )
    await user.click(screen.getByText('Mario Rossi'))
    await user.click(screen.getByRole('button', { name: 'requestReviewerCompilationBtn' }))

    expect(assignReviewerMock).not.toHaveBeenCalled()
    expect(forward).not.toHaveBeenCalled()
    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'requestRiskAnalysisCompilation',
      purposeId: 'purpose-id',
      reviewerId: 'reviewer-uuid-1',
      reviewerName: 'Mario Rossi',
    })
  })

  it('after selecting option 2 with a reviewer and switching back to option 1, on submit does not call the API and only forwards', async () => {
    const user = userEvent.setup()
    const forward = vi.fn()
    renderComponent({ reviewers: [mockReviewer], forward })

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesReviewerSigns' })
    )
    await user.click(
      screen.getByRole('combobox', { name: 'reviewerField.label.selfWritesReviewerSigns' })
    )
    await user.click(screen.getByText('Mario Rossi'))

    await user.click(
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesSelfSigns' })
    )
    await user.click(screen.getByRole('button', { name: 'forwardBtn' }))

    expect(assignReviewerMock).not.toHaveBeenCalled()
    expect(forward).toHaveBeenCalled()
  })

  it('prefills the form from defaultValues so coming back to the step preserves the selection', () => {
    renderComponent({
      defaultValues: {
        reviewMode: 'selfWritesReviewerSigns',
        reviewerId: mockReviewer2.userId,
      },
    })

    expect(
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesReviewerSigns' })
    ).toBeChecked()
    expect(
      screen.getByRole('combobox', { name: 'reviewerField.label.selfWritesReviewerSigns' })
    ).toHaveValue('Anna Verdi')
  })

  it('shows the info alert and hides the form when the institution has no reviewers', () => {
    renderComponent({ reviewers: [] })

    expect(screen.getByText('noReviewersAlert.message')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'noReviewersAlert.linkLabel' })).toHaveAttribute(
      'href',
      'https://selfcare.test/users'
    )
    expect(
      screen.queryByRole('radio', { name: 'reviewModeField.options.selfWritesSelfSigns' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('backToListBtn')).toBeInTheDocument()
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
      screen.queryByRole('radio', { name: 'reviewModeField.options.selfWritesSelfSigns' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('backToListBtn')).toBeInTheDocument()
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
      screen.getByRole('radio', { name: 'reviewModeField.options.selfWritesSelfSigns' })
    ).toBeInTheDocument()
  })
})
