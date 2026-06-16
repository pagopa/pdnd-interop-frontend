import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PurposeEditStepGeneralForm from '../PurposeEditStepGeneralForm'
import type { PurposeEditStepGeneralFormValues } from '../PurposeEditStepGeneralForm'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

const updateDraftMock = vi.fn()
const updateDraftForReceiveMock = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useUpdateDraft: () => ({ mutate: updateDraftMock }),
    useUpdateDraftForReceiveEService: () => ({ mutate: updateDraftForReceiveMock }),
  },
}))

vi.mock('@/router', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  Link: vi.fn(({ children, ...props }: React.PropsWithChildren) => <a {...props}>{children}</a>),
}))

vi.mock('@/components/shared/PurposeLoadEstimationSection', () => ({
  PurposeLoadEstimationSection: () => <div data-testid="load-estimation-section" />,
}))

const defaultValues: PurposeEditStepGeneralFormValues = {
  title: 'Test purpose',
  description: 'A test purpose description',
  isFreeOfCharge: false,
  dailyCalls: 100,
}

function renderComponent(overrides?: {
  purposeMode?: 'DELIVER' | 'RECEIVE'
  isFreeOfCharge?: boolean
}) {
  const purpose = createMockPurpose({
    eservice: {
      id: 'eservice-id',
      name: 'Test Eservice',
      mode: overrides?.purposeMode ?? 'DELIVER',
      producer: { id: 'producer-id', name: 'Producer' },
      personalData: true,
      descriptor: { id: 'descriptor-id', state: 'PUBLISHED', version: '1', audience: [] },
    },
  })

  const values = {
    ...defaultValues,
    isFreeOfCharge: overrides?.isFreeOfCharge ?? defaultValues.isFreeOfCharge,
  }

  return renderWithApplicationContext(
    <PurposeEditStepGeneralForm
      purpose={purpose}
      defaultValues={values}
      activeStep={0}
      forward={vi.fn()}
      back={vi.fn()}
    />,
    { withReactQueryContext: true, withRouterContext: true }
  )
}

describe('PurposeEditStepGeneralForm', () => {
  it('should not show freeOfChargeReason field when isFreeOfCharge is NO', () => {
    renderComponent({ isFreeOfCharge: false })

    expect(
      screen.queryByRole('textbox', { name: 'edit.stepGeneral.freeOfChargeReasonField.label' })
    ).not.toBeInTheDocument()
  })

  it('should show freeOfChargeReason field when isFreeOfCharge is YES', () => {
    renderComponent({ isFreeOfCharge: true })

    expect(
      screen.getByRole('textbox', { name: 'edit.stepGeneral.freeOfChargeReasonField.label' })
    ).toBeInTheDocument()
  })

  it('should show freeOfChargeReason field when user selects YES', async () => {
    const user = userEvent.setup()
    renderComponent({ isFreeOfCharge: false })

    expect(
      screen.queryByRole('textbox', { name: 'edit.stepGeneral.freeOfChargeReasonField.label' })
    ).not.toBeInTheDocument()

    const freeOfChargeSwitch = screen.getByRole('checkbox', {
      name: 'edit.stepGeneral.isFreeOfChargeField.label',
    })
    await user.click(freeOfChargeSwitch)

    expect(
      screen.getByRole('textbox', { name: 'edit.stepGeneral.freeOfChargeReasonField.label' })
    ).toBeInTheDocument()
  })

  it('should show the correct forward button label for DELIVER mode', () => {
    renderComponent({ purposeMode: 'DELIVER' })

    expect(screen.getByRole('button', { name: 'edit.forwardWithSaveBtn' })).toBeInTheDocument()
  })

  it('should show the correct forward button label for RECEIVE mode', () => {
    renderComponent({ purposeMode: 'RECEIVE' })

    expect(screen.getByRole('button', { name: 'edit.endWithSaveBtn' })).toBeInTheDocument()
  })
})
