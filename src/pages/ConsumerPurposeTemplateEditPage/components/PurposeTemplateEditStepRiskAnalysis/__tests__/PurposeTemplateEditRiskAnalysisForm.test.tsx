import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { PurposeTemplateEditStepRiskAnalysis } from '../PurposeTemplateEditRiskAnalysisForm'
import { RiskAnalysisFormTemplate } from '../RiskAnalysisForm/RiskAnalysisFormTemplate'

// --- mocks ---
vi.mock('@/router', () => ({
  useParams: vi.fn(() => ({ purposeTemplateId: 'template-123' })),
  useNavigate: vi.fn(() => vi.fn()),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getSingle: vi.fn(),
  },
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getRiskAnalysisLatest: vi.fn(),
  },
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.mutations', () => ({
  PurposeTemplateMutations: {
    useUpdateDraft: vi.fn(),
  },
}))

vi.mock('../RiskAnalysisForm/RiskAnalysisFormTemplate', () => ({
  RiskAnalysisFormTemplate: vi.fn(() => <div data-testid="risk-form" />),
  RiskAnalysisFormTemplateSkeleton: vi.fn(() => <div data-testid="skeleton" />),
}))

describe('PurposeTemplateEditStepRiskAnalysis', () => {
  const mockBack = vi.fn()
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(PurposeTemplateMutations.useUpdateDraft as Mock).mockReturnValue({
      mutate: mockMutate,
    })
  })

  it('renders skeleton when data is missing', () => {
    ;(useQuery as Mock).mockReturnValueOnce({ data: undefined })
    ;(useQuery as Mock).mockReturnValueOnce({ data: undefined })

    render(
      <PurposeTemplateEditStepRiskAnalysis back={mockBack} forward={() => {}} activeStep={0} />
    )

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('renders RiskAnalysisForm when data is loaded', async () => {
    const purposeTemplate: PurposeTemplateWithCompactCreator & {
      purposeRiskAnalysisForm: { answers: Record<string, string[]> }
    } = {
      id: 'template-123',
      purposeTitle: 'Test Purpose',
      purposeDescription: 'desc',
      purposeFreeOfChargeReason: '',
      purposeIsFreeOfCharge: false,
      purposeDailyCalls: 100,
      targetDescription: 'desc',
      handlesPersonalData: true,
      targetTenantKind: 'PA',
      creator: {
        id: 'org-1',
        name: 'Test Org',
        kind: 'PA',
      },
      state: 'PUBLISHED',
      createdAt: '',
      purposeRiskAnalysisForm: { version: '1', answers: { q1: ['a'] } },
    }

    const riskAnalysis = { version: 1, questions: [] }

    ;(useQuery as Mock)
      .mockReturnValueOnce({ data: purposeTemplate })
      .mockReturnValueOnce({ data: riskAnalysis })

    render(
      <PurposeTemplateEditStepRiskAnalysis back={mockBack} forward={() => {}} activeStep={0} />
    )

    await waitFor(() => {
      expect(screen.getByTestId('risk-form')).toBeInTheDocument()
    })
  })

  it('calls updatePurposeTemplate on submit', async () => {
    const purposeTemplate = {
      id: 'template-123',
      purposeTitle: 'Test Purpose',
      purposeDescription: 'desc',
      purposeFreeOfChargeReason: '',
      purposeIsFreeOfCharge: false,
      purposeDailyCalls: 100,
      targetDescription: 'desc',
      targetTenantKind: 'tenant-kind',
      handlesPersonalData: true,
      purposeRiskAnalysisForm: { answers: { q1: ['a'] } },
    }

    const riskAnalysis = { version: 2, questions: [] }

    ;(useQuery as Mock)
      .mockReturnValueOnce({ data: purposeTemplate })
      .mockReturnValueOnce({ data: riskAnalysis })

    render(
      <PurposeTemplateEditStepRiskAnalysis back={mockBack} forward={() => {}} activeStep={0} />
    )

    await waitFor(() => {
      expect(screen.getByTestId('risk-form')).toBeInTheDocument()
    })

    const props = (RiskAnalysisFormTemplate as Mock).mock.calls[0][0]
    props.onSubmit({
      version: 2,
      answers: {
        q1: {
          values: ['answer1'],
          editable: false,
        },
      },
    })

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          purposeTemplateId: 'template-123',
          purposeRiskAnalysisForm: {
            version: 2,
            answers: {
              q1: {
                values: ['answer1'],
                editable: false,
              },
            },
          },
        }),
        expect.any(Object)
      )
    })
  })
})
