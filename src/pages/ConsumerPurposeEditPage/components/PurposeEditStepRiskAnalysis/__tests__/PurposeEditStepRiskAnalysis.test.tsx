import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { PurposeEditStepRiskAnalysis } from '../PurposeEditStepRiskAnalysis'
import {
  createMockPurpose,
  createMockRiskAnalysisFormConfig,
} from '@/../__mocks__/data/purpose.mocks'
import type {
  Purpose,
  PurposeUpdateContent,
  ReviewerWorkflow,
  RiskAnalysisFormConfig,
  RiskAnalysisSubmissionSeed,
} from '@/api/api.generatedTypes'

const navigateMock = vi.fn()
vi.mock('@/router', () => ({
  useParams: () => ({ purposeId: 'purpose-123' }),
  useNavigate: () => navigateMock,
}))

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

type UpdateDraftPayload = { purposeId: string } & PurposeUpdateContent
type SubmitRiskAnalysisPayload = { purposeId: string } & RiskAnalysisSubmissionSeed
type MutateOptions = { onSuccess?: () => void; onError?: (err: unknown) => void }

const updateDraftMock = vi.fn<[UpdateDraftPayload, MutateOptions], void>()
const submitRiskAnalysisMock = vi.fn<[SubmitRiskAnalysisPayload, MutateOptions], void>()
vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (purposeId: string) => ({ queryKey: ['PurposeGetSingle', purposeId] }),
    getRiskAnalyisLatestOrSpecificVersion: (params: unknown) => ({
      queryKey: ['PurposeGetRiskAnalysis', params],
    }),
  },
  PurposeMutations: {
    useUpdateDraft: () => ({ mutate: updateDraftMock, isPending: false }),
    useSubmitRiskAnalysis: () => ({ mutate: submitRiskAnalysisMock, isPending: false }),
  },
}))

type RiskAnalysisFormSpyProps = {
  isReviewerApprovalMode?: boolean
  onSubmit: (answers: Record<string, string[]>) => void
  onSaveDraft?: (answers: Record<string, string[]>) => void
  isRejected?: boolean
}

const formSpy = vi.fn<[RiskAnalysisFormSpyProps], null>()
vi.mock('../RiskAnalysisForm/RiskAnalysisForm', () => ({
  RiskAnalysisForm: (props: RiskAnalysisFormSpyProps) => formSpy(props),
  RiskAnalysisFormSkeleton: () => <div data-testid="skeleton" />,
}))

function mockQueries(
  purpose: Purpose | undefined,
  riskAnalysis: RiskAnalysisFormConfig | undefined
) {
  ;(useQuery as Mock).mockImplementation((options: { queryKey: Array<unknown> }) => {
    const [key] = options.queryKey
    if (key === 'PurposeGetSingle') return { data: purpose }
    if (key === 'PurposeGetRiskAnalysis') return { data: riskAnalysis }
    return { data: undefined }
  })
}

function buildPurpose(reviewerWorkflow?: ReviewerWorkflow): Purpose {
  return {
    ...createMockPurpose({ id: 'purpose-123' }),
    ...(reviewerWorkflow ? { reviewerWorkflow } : {}),
  }
}

function getLastFormProps(): RiskAnalysisFormSpyProps {
  return formSpy.mock.calls[formSpy.mock.calls.length - 1]![0]
}

describe('PurposeEditStepRiskAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the skeleton until purpose and riskAnalysis are loaded', () => {
    mockQueries(undefined, undefined)

    const screen = render(
      <PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />
    )

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    expect(formSpy).not.toHaveBeenCalled()
  })

  it('in option 1 (no reviewerWorkflow) renders editable with no chip, subtitle or read-only', () => {
    mockQueries(buildPurpose(), createMockRiskAnalysisFormConfig())

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    expect(getLastFormProps().isReviewerApprovalMode).toBe(false)
    expect(getLastFormProps().onSaveDraft).toBeUndefined()
    expect(getLastFormProps().isRejected).toBeFalsy()
  })

  it('passes isReviewerApprovalMode=true with onSaveDraft when reviewMode is ADMIN_WRITES_REVIEWER_SIGNS', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'DRAFT',
      }),
      createMockRiskAnalysisFormConfig()
    )

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    expect(getLastFormProps().isReviewerApprovalMode).toBe(true)
    expect(typeof getLastFormProps().onSaveDraft).toBe('function')
  })

  it('in option 2 awaiting approval shows the read-only summary with the submitted chip and subtitle, not the editable form', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'SUBMITTED',
      }),
      createMockRiskAnalysisFormConfig()
    )

    const screen = render(
      <PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />
    )

    expect(formSpy).not.toHaveBeenCalled()
    expect(screen.getByText('status.riskAnalysis.SUBMITTED')).toBeInTheDocument()
    expect(screen.getByText('stepRiskAnalysis.readOnlySubtitle.SUBMITTED')).toBeInTheDocument()
    // the compiled answers are shown as a read-only summary (question + given answer)
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('option 1')).toBeInTheDocument()
  })

  it('in option 2 approved shows the read-only summary with the approved chip and subtitle, not the editable form', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'SIGNED',
      }),
      createMockRiskAnalysisFormConfig()
    )

    const screen = render(
      <PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />
    )

    expect(formSpy).not.toHaveBeenCalled()
    expect(screen.getByText('status.riskAnalysis.SIGNED')).toBeInTheDocument()
    expect(screen.getByText('stepRiskAnalysis.readOnlySubtitle.SIGNED')).toBeInTheDocument()
  })

  it('in option 2 rejected keeps the form editable, flags the rejected alert and stays in approval mode', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'REJECTED',
      }),
      createMockRiskAnalysisFormConfig()
    )

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    expect(getLastFormProps().isRejected).toBe(true)
    expect(getLastFormProps().isReviewerApprovalMode).toBe(true)
  })

  it('in option 3 before the reviewer compiled shows only the info card, not the form', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'ASSIGNED',
      }),
      createMockRiskAnalysisFormConfig()
    )

    const screen = render(
      <PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />
    )

    expect(formSpy).not.toHaveBeenCalled()
    expect(screen.getByText('stepRiskAnalysis.readOnlySubtitle.ASSIGNED')).toBeInTheDocument()
    expect(screen.getByText('status.riskAnalysis.ASSIGNED')).toBeInTheDocument()
    // everything but the info card is hidden: no answers summary, no editable form
    expect(screen.queryByText('Question 1')).not.toBeInTheDocument()
  })

  it('in option 3 after the reviewer signed shows the read-only summary with the approved chip, not the editable form', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'SIGNED',
      }),
      createMockRiskAnalysisFormConfig()
    )

    const screen = render(
      <PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />
    )

    expect(formSpy).not.toHaveBeenCalled()
    expect(screen.getByText('status.riskAnalysis.SIGNED')).toBeInTheDocument()
    expect(screen.getByText('stepRiskAnalysis.readOnlySubtitle.SIGNED')).toBeInTheDocument()
    // the values compiled by the reviewer are visible in the read-only summary
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('option 1')).toBeInTheDocument()
  })

  it('in a read-only state the forward CTA stays accessible and navigates to the summary', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'SIGNED',
      }),
      createMockRiskAnalysisFormConfig()
    )

    const screen = render(
      <PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'endWithSaveBtn' }))
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-123' },
    })
  })

  it('in option 1 saves the draft and navigates to summary on form onSubmit', () => {
    const purpose = buildPurpose()
    const riskAnalysis = createMockRiskAnalysisFormConfig()
    mockQueries(purpose, riskAnalysis)

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    const answers = { purpose: ['OTHER'], institutionalPurpose: ['text'] }
    getLastFormProps().onSubmit(answers)

    expect(updateDraftMock).toHaveBeenCalledTimes(1)
    const [payload, options] = updateDraftMock.mock.calls[0]
    expect(payload).toMatchObject({
      purposeId: purpose.id,
      title: purpose.title,
      description: purpose.description,
      riskAnalysisForm: { version: riskAnalysis.version, answers },
    })
    expect(submitRiskAnalysisMock).not.toHaveBeenCalled()

    options.onSuccess!()
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-123' },
    })
  })

  it('in option 2 chains save then submit then navigate when the form invokes onSubmit', () => {
    const purpose = buildPurpose({
      reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
      reviewerIds: ['reviewer-1'],
      signingState: 'DRAFT',
    })
    const riskAnalysis = createMockRiskAnalysisFormConfig()
    mockQueries(purpose, riskAnalysis)

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    const answers = { purpose: ['OTHER'], institutionalPurpose: ['text'] }
    getLastFormProps().onSubmit(answers)

    expect(updateDraftMock).toHaveBeenCalledTimes(1)
    const [savePayload, saveOptions] = updateDraftMock.mock.calls[0]
    expect(savePayload).toMatchObject({
      purposeId: purpose.id,
      riskAnalysisForm: { version: riskAnalysis.version, answers },
    })
    expect(submitRiskAnalysisMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    saveOptions.onSuccess!()

    expect(submitRiskAnalysisMock).toHaveBeenCalledTimes(1)
    const [submitPayload, submitOptions] = submitRiskAnalysisMock.mock.calls[0]
    expect(submitPayload).toEqual({
      purposeId: purpose.id,
      riskAnalysisForm: { version: riskAnalysis.version, answers },
    })
    expect(navigateMock).not.toHaveBeenCalled()

    submitOptions.onSuccess!()
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-123' },
    })
  })

  it('in option 2 does not navigate when the submit step of the chain fails', () => {
    const purpose = buildPurpose({
      reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
      reviewerIds: ['reviewer-1'],
      signingState: 'DRAFT',
    })
    mockQueries(purpose, createMockRiskAnalysisFormConfig())

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    const answers = { purpose: ['OTHER'], institutionalPurpose: ['text'] }
    getLastFormProps().onSubmit(answers)

    const [, saveOptions] = updateDraftMock.mock.calls[0]
    saveOptions.onSuccess!()

    expect(submitRiskAnalysisMock).toHaveBeenCalledTimes(1)
    const [, submitOptions] = submitRiskAnalysisMock.mock.calls[0]
    submitOptions.onError?.(new Error('boom'))

    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('in option 2 the draft save only persists and navigates without submitting', () => {
    const purpose = buildPurpose({
      reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
      reviewerIds: ['reviewer-1'],
      signingState: 'DRAFT',
    })
    mockQueries(purpose, createMockRiskAnalysisFormConfig())

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    const partial = { purpose: ['OTHER'] }
    getLastFormProps().onSaveDraft!(partial)

    expect(updateDraftMock).toHaveBeenCalledTimes(1)
    const [payload, options] = updateDraftMock.mock.calls[0]
    expect(payload.riskAnalysisForm!.answers).toEqual(partial)

    options.onSuccess!()
    expect(submitRiskAnalysisMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-123' },
    })
  })
})
