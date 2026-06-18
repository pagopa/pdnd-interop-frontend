import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PurposeEditStepGeneralForm from '../PurposeEditStepGeneralForm'
import type { PurposeEditStepGeneralFormValues } from '../PurposeEditStepGeneralForm'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

const updateDraftMock = vi.fn()
const updateDraftForReceiveMock = vi.fn()
const navigateMock = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useUpdateDraft: () => ({ mutate: updateDraftMock }),
    useUpdateDraftForReceiveEService: () => ({ mutate: updateDraftForReceiveMock }),
  },
}))

vi.mock('@/router', () => ({
  useNavigate: vi.fn(() => navigateMock),
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  it('submits with DELIVER mode and calls updateDraft with riskAnalysisForm', async () => {
    const user = userEvent.setup()
    const forwardMock = vi.fn()

    const purpose = createMockPurpose({
      id: 'purpose-id',
      eservice: {
        id: 'eservice-id',
        name: 'Test Eservice',
        mode: 'DELIVER',
        producer: { id: 'producer-id', name: 'Producer' },
        personalData: true,
        descriptor: { id: 'descriptor-id', state: 'PUBLISHED', version: '1', audience: [] },
      },
    })

    renderWithApplicationContext(
      <PurposeEditStepGeneralForm
        purpose={purpose}
        defaultValues={{
          ...defaultValues,
          title: 'Valid title for submit',
          description: 'Valid description that is long enough',
          isFreeOfCharge: true,
          freeOfChargeReason: 'Valid reason for free of charge flow',
        }}
        activeStep={0}
        forward={forwardMock}
        back={vi.fn()}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'edit.forwardWithSaveBtn' }))

    await waitFor(() => {
      expect(updateDraftForReceiveMock).not.toHaveBeenCalled()
      expect(updateDraftMock).toHaveBeenCalledTimes(1)
      expect(updateDraftMock).toHaveBeenCalledWith(
        expect.objectContaining({
          purposeId: 'purpose-id',
          title: 'Valid title for submit',
          description: 'Valid description that is long enough',
          isFreeOfCharge: true,
          freeOfChargeReason: 'Valid reason for free of charge flow',
          dailyCalls: 100,
          riskAnalysisForm: purpose.riskAnalysisForm,
        }),
        expect.objectContaining({ onSuccess: forwardMock })
      )
    })
  })

  it('submits with RECEIVE mode and navigates to summary on success', async () => {
    const user = userEvent.setup()

    const purpose = createMockPurpose({
      id: 'purpose-receive',
      eservice: {
        id: 'eservice-id',
        name: 'Test Eservice',
        mode: 'RECEIVE',
        producer: { id: 'producer-id', name: 'Producer' },
        personalData: true,
        descriptor: { id: 'descriptor-id', state: 'PUBLISHED', version: '1', audience: [] },
      },
    })

    renderWithApplicationContext(
      <PurposeEditStepGeneralForm
        purpose={purpose}
        defaultValues={{
          ...defaultValues,
          title: 'Valid title for submit',
          description: 'Valid description that is long enough',
          isFreeOfCharge: true,
          freeOfChargeReason: 'Valid reason for free of charge flow',
        }}
        activeStep={0}
        forward={vi.fn()}
        back={vi.fn()}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'edit.endWithSaveBtn' }))

    expect(updateDraftMock).not.toHaveBeenCalled()
    expect(updateDraftForReceiveMock).toHaveBeenCalledTimes(1)
    expect(updateDraftForReceiveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        purposeId: 'purpose-receive',
        title: 'Valid title for submit',
        description: 'Valid description that is long enough',
        isFreeOfCharge: true,
        freeOfChargeReason: 'Valid reason for free of charge flow',
        dailyCalls: 100,
      }),
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )

    const onSuccess = updateDraftForReceiveMock.mock.calls[0]?.[1]?.onSuccess
    expect(onSuccess).toBeTypeOf('function')
    onSuccess?.()

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-receive' },
    })
  })

  it('calls forward when DELIVER update succeeds', async () => {
    const user = userEvent.setup()
    const forwardMock = vi.fn()

    const purpose = createMockPurpose({
      id: 'purpose-id-clear-reason',
      eservice: {
        id: 'eservice-id',
        name: 'Test Eservice',
        mode: 'DELIVER',
        producer: { id: 'producer-id', name: 'Producer' },
        personalData: true,
        descriptor: { id: 'descriptor-id', state: 'PUBLISHED', version: '1', audience: [] },
      },
    })

    renderWithApplicationContext(
      <PurposeEditStepGeneralForm
        purpose={purpose}
        defaultValues={{
          ...defaultValues,
          title: 'Valid title for submit',
          description: 'Valid description that is long enough',
          isFreeOfCharge: true,
          freeOfChargeReason: 'Valid reason for free of charge flow',
        }}
        activeStep={0}
        forward={forwardMock}
        back={vi.fn()}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'edit.forwardWithSaveBtn' }))

    await waitFor(() => {
      expect(updateDraftMock).toHaveBeenCalledTimes(1)
    })

    const onSuccess = updateDraftMock.mock.calls[0]?.[1]?.onSuccess
    expect(onSuccess).toBe(forwardMock)
    onSuccess?.()
    expect(forwardMock).toHaveBeenCalledTimes(1)
  })
})
