import { act, screen } from '@testing-library/react'
import { queryClient } from '@/config/query-client'
import { PurposeQueries } from '../purpose.queries'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import {
  RiskAnalysisAlreadyApprovedError,
  RiskAnalysisAlreadyRejectedError,
} from '@/utils/errors.utils'
import { PurposeMutations } from '../purpose.mutations'
import { PurposeServices } from '../purpose.services'

vi.mock('../purpose.services', () => ({
  PurposeServices: {
    patchUpdatePurpose: vi.fn(),
    patchUpdateReversePurpose: vi.fn(),
    signRiskAnalysis: vi.fn(),
    rejectRiskAnalysis: vi.fn(),
    updateRiskAnalysis: vi.fn(),
  },
}))

describe.each([
  { mode: 'DELIVER', isReceive: false, service: PurposeServices.patchUpdatePurpose },
  { mode: 'RECEIVE', isReceive: true, service: PurposeServices.patchUpdateReversePurpose },
])('purpose metadata $mode', ({ isReceive, service }) => {
  it.each([
    { fields: { title: 'Updated purpose' }, feedback: 'successName' },
    { fields: { description: 'Updated purpose description' }, feedback: 'successDescription' },
    {
      fields: { title: 'Updated purpose', description: 'Updated purpose description' },
      feedback: 'successNameAndDescription',
    },
  ])('submits metadata and shows $feedback', async ({ fields, feedback }) => {
    vi.mocked(service).mockResolvedValueOnce({ id: 'purpose-id' })
    const query = PurposeQueries.getSingle('purpose-id')
    queryClient.setQueryData(query.queryKey, {
      ...createMockPurpose({ id: 'purpose-id' }),
      metadataVersion: undefined,
    })
    const { result } = renderHookWithApplicationContext(
      () => PurposeMutations.usePatchUpdatePurpose({ isReceive }),
      { withReactQueryContext: true }
    )

    await act(() => result.current.mutateAsync({ purposeId: 'purpose-id', ...fields }))

    expect(service).toHaveBeenCalledWith({ purposeId: 'purpose-id', ...fields })
    expect(await screen.findByText(`outcome.${feedback}`)).toBeInTheDocument()
    expect(queryClient.getQueryState(query.queryKey)?.isInvalidated).toBe(true)
  })

  it('shows error feedback on failure', async () => {
    vi.mocked(service).mockRejectedValueOnce(new Error('Network failure'))
    const { result } = renderHookWithApplicationContext(
      () => PurposeMutations.usePatchUpdatePurpose({ isReceive }),
      { withReactQueryContext: true }
    )

    act(() => result.current.mutate({ purposeId: 'purpose-id', title: 'Updated purpose' }))

    expect(await screen.findByText('outcome.error')).toBeInTheDocument()
  })
})

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
