import { act, screen } from '@testing-library/react'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import {
  RiskAnalysisAlreadyApprovedError,
  RiskAnalysisAlreadyRejectedError,
} from '@/utils/errors.utils'
import { PurposeMutations } from '../purpose.mutations'
import { PurposeServices } from '../purpose.services'

vi.mock('../purpose.services', () => ({
  PurposeServices: {
    signRiskAnalysis: vi.fn(),
    rejectRiskAnalysis: vi.fn(),
    updateRiskAnalysis: vi.fn(),
  },
}))

describe.each([
  {
    action: 'approve',
    useMutation: () => {
      const { mutate } = PurposeMutations.useSignRiskAnalysis()
      return () => mutate({ purposeId: 'purpose-id', metadataVersionToSign: 3 })
    },
    service: PurposeServices.signRiskAnalysis,
    feedbackPrefix: 'outcome',
    genericFeedback: 'outcome.error',
  },
  {
    action: 'reject',
    useMutation: () => {
      const { mutate } = PurposeMutations.useRejectRiskAnalysis()
      return () => mutate({ purposeId: 'purpose-id', rejectionReason: 'A valid rejection reason' })
    },
    service: PurposeServices.rejectRiskAnalysis,
    feedbackPrefix: 'signRiskAnalysis.outcome',
    genericFeedback: 'rejectRiskAnalysis.outcome.error',
  },
  {
    action: 'save',
    useMutation: () => {
      const { mutate } = PurposeMutations.useUpdateRiskAnalysis()
      return () => mutate({ purposeId: 'purpose-id', version: '2.1', answers: {} })
    },
    service: PurposeServices.updateRiskAnalysis,
    feedbackPrefix: 'signRiskAnalysis.outcome',
    genericFeedback: 'updateRiskAnalysis.outcome.error',
  },
])('$action risk analysis', ({ useMutation, service, feedbackPrefix, genericFeedback }) => {
  it.each([
    { error: new RiskAnalysisAlreadyApprovedError(), feedback: 'alreadyApproved' },
    { error: new RiskAnalysisAlreadyRejectedError(), feedback: 'alreadyRejected' },
  ])('shows $feedback feedback after a concurrent conclusion', async ({ error, feedback }) => {
    vi.mocked(service).mockRejectedValueOnce(error)
    const { result } = renderHookWithApplicationContext(useMutation, {
      withReactQueryContext: true,
    })

    act(() => result.current())

    expect(await screen.findByText(`${feedbackPrefix}.${feedback}`)).toBeInTheDocument()
  })

  it('keeps generic feedback for an unrelated failure', async () => {
    vi.mocked(service).mockRejectedValueOnce(new Error('Network failure'))
    const { result } = renderHookWithApplicationContext(useMutation, {
      withReactQueryContext: true,
    })

    act(() => result.current())

    expect(await screen.findByText(genericFeedback)).toBeInTheDocument()
  })
})
