import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { EServiceTemplateCreateStepEditRiskAnalysis } from '../EServiceTemplateCreateStepEditRiskAnalysis'
import type { EServiceTemplateRiskAnalysis } from '@/api/api.generatedTypes'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'

// Mocks
vi.mock('@/api/template', () => ({
  EServiceTemplateMutations: {
    useUpdateEServiceTemplateRiskAnalysis: () => ({ mutate: vi.fn() }),
  },
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getRiskAnalysisLatest: vi.fn(() => ({ queryKey: ['riskAnalysisLatest'] })),
  },
}))
vi.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: () => ({
    data: { version: '2.0.0', questions: [], name: 'Latest Risk Analysis' },
  }),
}))
vi.mock('@/components/shared/CreateStepPurposeRiskAnalysisForm', () => ({
  CreateStepPurposeRiskAnalysisForm: ({
    onSubmit,
    onCancel,
    riskAnalysis,
    defaultName,
    defaultAnswers,
  }: {
    onSubmit: (name: string, answers: Record<string, string[]>) => void
    onCancel: () => void
    riskAnalysis: { version: string; questions: Record<string, string>; name: string }
    defaultName?: string
    defaultAnswers?: Record<string, string[]>
  }) => (
    <div>
      <button onClick={() => onSubmit('EditedName', { q2: ['b2'] })}>submit</button>
      <button onClick={onCancel}>cancel</button>
      <span>{riskAnalysis.name}</span>
      <span>{defaultName}</span>
      <span>{JSON.stringify(defaultAnswers)}</span>
    </div>
  ),
}))

describe('EServiceTemplateCreateStepEditRiskAnalysis', () => {
  const baseRiskAnalysis: EServiceTemplateRiskAnalysis = {
    id: 'risk-analysis-id',
    name: 'Old Name',
    tenantKind: 'PRIVATE',
    riskAnalysisForm: {
      version: '1.0.0',
      answers: { q2: ['old'] },
    },
    createdAt: '2023-01-01T00:00:00Z',
  }

  it('calls updateEServiceTemplateRiskAnalysis with correct params and closes on success', async () => {
    const onClose = vi.fn()
    const mutate = vi.fn((_, { onSuccess }: { onSuccess: () => void }) => onSuccess())
    // Patch the mocked hook to return our spy
    EServiceTemplateMutations.useUpdateEServiceTemplateRiskAnalysis = () => ({ mutate }) as never
    render(
      <EServiceTemplateCreateStepEditRiskAnalysis
        eserviceTemplateId="template-id"
        riskAnalysis={baseRiskAnalysis}
        onClose={onClose}
      />
    )

    await userEvent.click(screen.getByText('submit'))
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        eServiceTemplateId: 'template-id',
        riskAnalysisId: 'risk-analysis-id',
        name: 'EditedName',
        riskAnalysisForm: { version: '1.0.0', answers: { q2: ['b2'] } },
        tenantKind: 'PRIVATE',
      }),
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when cancel is clicked', async () => {
    const onClose = vi.fn()
    render(
      <EServiceTemplateCreateStepEditRiskAnalysis
        eserviceTemplateId="template-id"
        riskAnalysis={baseRiskAnalysis}
        onClose={onClose}
      />
    )
    await userEvent.click(screen.getByText('cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})
