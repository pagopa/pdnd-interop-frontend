import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogRejectAgreement } from '../DialogRejectAgreement'
import { DialogRejectDelegation } from '../DialogRejectDelegation'
import { DialogRejectPurposeVersion } from '../DialogRejectPurposeVersion'
import { DialogRejectDelegatedVersionDraft } from '../DialogRejectDelegatedVersionDraft'

const { closeDialogMock, rejectMutationMock, producerMock, consumerMock, navigateMock } =
  vi.hoisted(() => ({
    closeDialogMock: vi.fn(),
    rejectMutationMock: vi.fn(),
    producerMock: vi.fn(),
    consumerMock: vi.fn(),
    navigateMock: vi.fn(),
  }))

vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: closeDialogMock }),
}))

vi.mock('@/api/agreement', () => ({
  AgreementMutations: {
    useReject: () => ({ mutate: rejectMutationMock }),
  },
}))

vi.mock('@/api/delegation', () => ({
  DelegationMutations: {
    useRejectProducerDelegation: () => ({ mutate: producerMock }),
    useRejectConsumerDelegation: () => ({ mutate: consumerMock }),
  },
}))
vi.mock('@/api/purpose', () => ({
  PurposeMutations: { useRejectVersion: () => ({ mutate: rejectMutationMock }) },
}))
vi.mock('@/api/eservice', () => ({
  EServiceMutations: { useRejectDelegatedVersionDraft: () => ({ mutate: rejectMutationMock }) },
}))
vi.mock('@/router', () => ({ useNavigate: () => navigateMock }))

const reason = 'This is a sufficiently detailed rejection reason.'
const rejectionCases = [
  {
    name: 'agreement',
    renderDialog: () => <DialogRejectAgreement agreementId="agreement-id" type="rejectAgreement" />,
    mutation: rejectMutationMock,
    payload: { agreementId: 'agreement-id', reason },
  },
  ...(['DELEGATED_PRODUCER', 'DELEGATED_CONSUMER'] as const).map((delegationKind) => ({
    name: delegationKind,
    renderDialog: () => (
      <DialogRejectDelegation
        type="rejectDelegation"
        delegationId="delegation-id"
        delegationKind={delegationKind}
      />
    ),
    mutation: delegationKind === 'DELEGATED_PRODUCER' ? producerMock : consumerMock,
    payload: { delegationId: 'delegation-id', rejectionReason: reason },
  })),
  ...[false, true].map((isChangePlanRequest) => ({
    name: `purpose change plan ${isChangePlanRequest}`,
    renderDialog: () => (
      <DialogRejectPurposeVersion
        type="rejectPurposeVersion"
        purposeId="purpose-id"
        versionId="version-id"
        isChangePlanRequest={isChangePlanRequest}
      />
    ),
    mutation: rejectMutationMock,
    payload: { purposeId: 'purpose-id', versionId: 'version-id', rejectionReason: reason },
  })),
  {
    name: 'delegated draft',
    renderDialog: () => (
      <DialogRejectDelegatedVersionDraft
        type="rejectDelegatedVersionDraft"
        eserviceId="eservice-id"
        descriptorId="descriptor-id"
      />
    ),
    mutation: rejectMutationMock,
    payload: { eserviceId: 'eservice-id', descriptorId: 'descriptor-id', rejectionReason: reason },
  },
]

describe.each(rejectionCases)(
  '$name rejection lifecycle',
  ({ name, renderDialog, mutation, payload }) => {
    beforeEach(() => vi.resetAllMocks())

    it('validates required and short reasons without sending a mutation', async () => {
      const user = userEvent.setup()
      render(renderDialog())
      const submit = screen.getAllByRole('button').at(-1)!
      if (name.startsWith('DELEGATED_')) {
        expect(submit).toBeDisabled()
      } else {
        await user.click(submit)
        expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
      }
      await user.type(screen.getByRole('textbox'), 'short')
      await user.click(submit)
      expect(await screen.findByText('validation.string.minLength')).toBeInTheDocument()
      expect(mutation).not.toHaveBeenCalled()
      expect(closeDialogMock).not.toHaveBeenCalled()
    })

    it('retains the reason while pending or unsuccessful and closes only on success', async () => {
      const user = userEvent.setup()
      render(renderDialog())
      await user.type(screen.getByRole('textbox'), reason)
      await user.click(screen.getAllByRole('button').at(-1)!)
      await waitFor(() => expect(mutation).toHaveBeenCalledOnce())
      expect(mutation.mock.calls[0][0]).toEqual(payload)
      expect(closeDialogMock).not.toHaveBeenCalled()
      expect(navigateMock).not.toHaveBeenCalled()
      expect(screen.getByRole('textbox')).toHaveValue(reason)
      expect(producerMock).toHaveBeenCalledTimes(name === 'DELEGATED_PRODUCER' ? 1 : 0)
      expect(consumerMock).toHaveBeenCalledTimes(name === 'DELEGATED_CONSUMER' ? 1 : 0)
      act(() => mutation.mock.calls[0][1].onSuccess())
      expect(closeDialogMock).toHaveBeenCalledOnce()
      if (name === 'delegated draft') {
        expect(navigateMock).toHaveBeenCalledWith('PROVIDE_ESERVICE_LIST')
        expect(closeDialogMock.mock.invocationCallOrder[0]).toBeLessThan(
          navigateMock.mock.invocationCallOrder[0]
        )
      } else {
        expect(navigateMock).not.toHaveBeenCalled()
      }
    })

    it('cancels without submitting', async () => {
      const user = userEvent.setup()
      render(renderDialog())
      await user.click(screen.getAllByRole('button')[0])
      expect(closeDialogMock).toHaveBeenCalledOnce()
      expect(mutation).not.toHaveBeenCalled()
    })
  }
)

describe('DialogRejectAgreement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const submitValidReason = async () => {
    const user = userEvent.setup()
    render(<DialogRejectAgreement agreementId="agreement-id" type="rejectAgreement" />)

    await user.type(
      screen.getByRole('textbox', { name: /reason\.label/i }),
      'This is a sufficiently detailed rejection reason.'
    )
    await user.click(screen.getByRole('button', { name: /confirmLabel/i }))
  }

  it('keeps the dialog open when the mutation does not succeed', async () => {
    await submitValidReason()

    expect(rejectMutationMock).toHaveBeenCalledWith(
      { agreementId: 'agreement-id', reason: 'This is a sufficiently detailed rejection reason.' },
      { onSuccess: closeDialogMock }
    )
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the dialog after mutation success', async () => {
    rejectMutationMock.mockImplementation((_payload, options) => options.onSuccess())

    await submitValidReason()

    expect(closeDialogMock).toHaveBeenCalledOnce()
  })
})
