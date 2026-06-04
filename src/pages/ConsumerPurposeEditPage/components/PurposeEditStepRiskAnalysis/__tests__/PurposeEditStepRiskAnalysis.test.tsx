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

const openDialogMock = vi.fn()
vi.mock('@/stores', () => ({
  useDialog: () => ({
    openDialog: openDialogMock,
    closeDialog: vi.fn(),
  }),
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

  it('in option 2 opens the requestPurposeApproval dialog and the dialog onConfirm runs the save+submit+navigate chain', () => {
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

    // Step 1: form onSubmit only opens the dialog — no BE call yet.
    expect(updateDraftMock).not.toHaveBeenCalled()
    expect(submitRiskAnalysisMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    expect(openDialogMock).toHaveBeenCalledTimes(1)
    const dialogPayload = openDialogMock.mock.calls[0][0]
    expect(dialogPayload).toMatchObject({
      type: 'requestPurposeApproval',
      reviewerId: 'reviewer-1',
    })
    expect(typeof dialogPayload.onConfirm).toBe('function')

    // Step 2: dialog onConfirm fires the chain. The chain lives in the parent
    // so the MutationObservers stay mounted across closeDialog.
    dialogPayload.onConfirm()

    expect(updateDraftMock).toHaveBeenCalledTimes(1)
    const [savePayload, saveOptions] = updateDraftMock.mock.calls[0]
    expect(savePayload).toMatchObject({
      purposeId: purpose.id,
      riskAnalysisForm: { version: riskAnalysis.version, answers },
    })
    expect(submitRiskAnalysisMock).not.toHaveBeenCalled()

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

  it('in option 2 throws when reviewerIds is missing (BE contract violation) instead of opening a malformed dialog', () => {
    const purpose = buildPurpose({
      reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
      reviewerIds: [],
      signingState: 'DRAFT',
    })
    mockQueries(purpose, createMockRiskAnalysisFormConfig())

    render(<PurposeEditStepRiskAnalysis back={vi.fn()} forward={vi.fn()} activeStep={2} />)

    expect(() => getLastFormProps().onSubmit({ purpose: ['OTHER'] })).toThrow(/reviewerIds/)
    expect(openDialogMock).not.toHaveBeenCalled()
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
