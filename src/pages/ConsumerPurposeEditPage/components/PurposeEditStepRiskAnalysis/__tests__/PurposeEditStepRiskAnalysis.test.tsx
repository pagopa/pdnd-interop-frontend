import React from 'react'
import { render } from '@testing-library/react'
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
type UpdateDraftOptions = { onSuccess?: () => void; onError?: (err: unknown) => void }

const updateDraftMock = vi.fn<[UpdateDraftPayload, UpdateDraftOptions], void>()
vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (purposeId: string) => ({ queryKey: ['PurposeGetSingle', purposeId] }),
    getRiskAnalyisLatestOrSpecificVersion: (params: unknown) => ({
      queryKey: ['PurposeGetRiskAnalysis', params],
    }),
  },
  PurposeMutations: {
    useUpdateDraft: () => ({ mutate: updateDraftMock }),
  },
}))

type RiskAnalysisFormSpyProps = {
  isReviewerApprovalMode?: boolean
  onSubmit: (answers: Record<string, string[]>) => void
  onSaveDraft?: (answers: Record<string, string[]>) => void
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

  it('passes isReviewerApprovalMode=false when purpose has no reviewerWorkflow', () => {
    mockQueries(buildPurpose(), createMockRiskAnalysisFormConfig())

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    expect(getLastFormProps().isReviewerApprovalMode).toBe(false)
    expect(getLastFormProps().onSaveDraft).toBeUndefined()
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

  it('passes isReviewerApprovalMode=false when reviewMode is REVIEWER_WRITES_REVIEWER_SIGNS', () => {
    mockQueries(
      buildPurpose({
        reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
        reviewerIds: ['reviewer-1'],
        signingState: 'DRAFT',
      }),
      createMockRiskAnalysisFormConfig()
    )

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    expect(getLastFormProps().isReviewerApprovalMode).toBe(false)
    expect(getLastFormProps().onSaveDraft).toBeUndefined()
  })

  it('saves and navigates to summary when the form invokes onSubmit', () => {
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
    const [payload, options] = updateDraftMock.mock.calls[0]
    expect(payload).toMatchObject({
      purposeId: purpose.id,
      title: purpose.title,
      description: purpose.description,
      riskAnalysisForm: { version: riskAnalysis.version, answers },
    })

    options.onSuccess!()
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-123' },
    })
  })

  it('saves the partial draft and navigates to summary when the form invokes onSaveDraft', () => {
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
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: { purposeId: 'purpose-123' },
    })
  })
})
