import { act, screen } from '@testing-library/react'
import {
  renderHookWithApplicationContext,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { AxiosError, AxiosHeaders } from 'axios'
import userEvent from '@testing-library/user-event'
import { useErrorDataStore } from '@/stores/error-data.store'
import { DialogApproveRiskAnalysis } from '@/components/dialogs/DialogApproveRiskAnalysis'
import * as router from '@/router'
import { PurposeMutations } from '../purpose.mutations'
import { PurposeServices } from '../purpose.services'

vi.mock('../purpose.services', () => ({
  PurposeServices: {
    signRiskAnalysis: vi.fn(),
    rejectRiskAnalysis: vi.fn(),
    updateRiskAnalysis: vi.fn(),
    assignRiskAnalysisReviewer: vi.fn(),
    submitRiskAnalysis: vi.fn(),
    updateDraft: vi.fn(),
    updateDraftFromPurposeTemplate: vi.fn(),
  },
}))

function makeApiError(status: number, ...codes: string[]) {
  return new AxiosError('Request failed', undefined, undefined, undefined, {
    status,
    statusText: 'Request failed',
    data: { correlationId: 'correlation-id', errors: codes.map((code) => ({ code })) },
    headers: {},
    config: { headers: new AxiosHeaders() },
  })
}

const conflictCases = [
  { code: '008-0052', feedback: 'alreadyApproved' },
  { code: '008-0053', feedback: 'alreadyRejected' },
  { code: '008-0054', feedback: 'versionChanged' },
]

describe.each([
  {
    action: 'approve',
    useMutation: () => {
      const { mutate } = PurposeMutations.useSignRiskAnalysis()
      return () => mutate({ purposeId: 'purpose-id', metadataVersionToSign: 3 })
    },
    service: PurposeServices.signRiskAnalysis,
    genericFeedback: 'outcome.error',
  },
  {
    action: 'reject',
    useMutation: () => {
      const { mutate } = PurposeMutations.useRejectRiskAnalysis()
      return () => mutate({ purposeId: 'purpose-id', rejectionReason: 'A valid rejection reason' })
    },
    service: PurposeServices.rejectRiskAnalysis,
    genericFeedback: 'rejectRiskAnalysis.outcome.error',
  },
  {
    action: 'save',
    useMutation: () => {
      const { mutate } = PurposeMutations.useUpdateRiskAnalysis()
      return () => mutate({ purposeId: 'purpose-id', version: '2.1', answers: {} })
    },
    service: PurposeServices.updateRiskAnalysis,
    genericFeedback: 'updateRiskAnalysis.outcome.error',
  },
  ...(['none', 'create', 'edit'] as const).map((feedback) => ({
    action: `assign (${feedback})`,
    useMutation: () => {
      const { mutate } = PurposeMutations.useAssignRiskAnalysisReviewer({ feedback })
      return () =>
        mutate({
          purposeId: 'purpose-id',
          reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
          reviewerIds: ['id'],
        })
    },
    service: PurposeServices.assignRiskAnalysisReviewer,
    genericFeedback:
      feedback === 'edit'
        ? 'updateRiskAnalysisAssignment.outcome.error'
        : 'assignRiskAnalysisReviewer.outcome.error',
  })),
  {
    action: 'submit',
    useMutation: () => {
      const { mutate } = PurposeMutations.useSubmitRiskAnalysis()
      return () =>
        mutate({ purposeId: 'purpose-id', riskAnalysisForm: { version: '2.1', answers: {} } })
    },
    service: PurposeServices.submitRiskAnalysis,
    genericFeedback: 'outcome.error',
  },
  {
    action: 'update draft',
    useMutation: () => {
      const { mutate } = PurposeMutations.useUpdateDraft()
      return () =>
        mutate({
          purposeId: 'purpose-id',
          title: 'Purpose',
          description: 'Description',
          dailyCalls: 10,
          isFreeOfCharge: true,
          riskAnalysisForm: { version: '2.1', answers: {} },
        })
    },
    service: PurposeServices.updateDraft,
    genericFeedback: 'outcome.error',
  },
  {
    action: 'update draft from template',
    useMutation: () => {
      const { mutate } = PurposeMutations.useUpdateDraftFromPurposeTemplate()
      return () =>
        mutate({
          purposeId: 'purpose-id',
          purposeTemplateId: 'template-id',
          riskAnalysisForm: { version: '2.1', answers: {} },
        })
    },
    service: PurposeServices.updateDraftFromPurposeTemplate,
    genericFeedback: 'outcome.error',
  },
])('$action risk analysis', ({ useMutation, service, genericFeedback }) => {
  it.each(conflictCases)(
    'shows $feedback for HTTP 409 with code $code',
    async ({ code, feedback }) => {
      vi.mocked(service).mockRejectedValueOnce(makeApiError(409, code))
      const { result } = renderHookWithApplicationContext(useMutation, {
        withReactQueryContext: true,
      })

      act(() => result.current())

      expect(await screen.findByText(feedback)).toBeInTheDocument()
      expect(useErrorDataStore.getState()).toMatchObject({
        correlationId: 'correlation-id',
        errorCode: code,
      })
    }
  )

  it.each([
    { label: 'an unknown 409', error: makeApiError(409, '008-0001') },
    { label: 'a 409 without codes', error: makeApiError(409) },
    ...conflictCases.map(({ code }) => ({
      label: `a non-409 status with code ${code}`,
      error: makeApiError(500, code),
    })),
    { label: 'a network failure', error: new Error('Network failure') },
    { label: 'an AxiosError without a response', error: new AxiosError('Network failure') },
    {
      label: 'a non-Axios error with a conflict-shaped response',
      error: { response: { status: 409, data: { errors: [{ code: '008-0052' }] } } },
    },
  ])('keeps operation-specific feedback for $label', async ({ error }) => {
    vi.mocked(service).mockRejectedValueOnce(error)
    const { result } = renderHookWithApplicationContext(useMutation, {
      withReactQueryContext: true,
    })

    act(() => result.current())

    expect(await screen.findByText(genericFeedback)).toBeInTheDocument()
  })

  it('recognizes a risk analysis conflict after another problem code', async () => {
    vi.mocked(service).mockRejectedValueOnce(makeApiError(409, '008-0001', '008-0054'))
    const { result } = renderHookWithApplicationContext(useMutation, {
      withReactQueryContext: true,
    })

    act(() => result.current())

    expect(await screen.findByText('versionChanged')).toBeInTheDocument()
  })
})

describe('risk analysis approval conflict', () => {
  it.each(conflictCases)(
    'keeps the dialog open without retrying or navigating for $code',
    async ({ code, feedback }) => {
      const user = userEvent.setup()
      const navigate = vi.fn()
      vi.spyOn(router, 'useNavigate').mockReturnValue(navigate)
      vi.mocked(PurposeServices.signRiskAnalysis)
        .mockClear()
        .mockRejectedValueOnce(makeApiError(409, code))

      renderWithApplicationContext(
        <DialogApproveRiskAnalysis
          type="approveRiskAnalysis"
          purposeId="purpose-id"
          metadataVersionToSign={3}
        />,
        { withReactQueryContext: true }
      )

      await user.click(screen.getByRole('button', { name: 'actions.confirm' }))

      expect(await screen.findByText(feedback)).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'actions.confirm' })).toBeEnabled()
      expect(PurposeServices.signRiskAnalysis).toHaveBeenCalledExactlyOnceWith({
        purposeId: 'purpose-id',
        metadataVersionToSign: 3,
      })
      expect(navigate).not.toHaveBeenCalled()
    }
  )
})
