import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { EServiceTemplateCreateStepAddRiskAnalysis } from '../EServiceTemplateCreateStepAddRiskAnalysis'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'

vi.mock('@/api/template', () => ({
  EServiceTemplateMutations: {
    useAddEServiceTemplateRiskAnalysis: () => ({ mutate: vi.fn() }),
  },
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getRiskAnalysisLatest: vi.fn(() => ({ queryKey: ['riskAnalysisLatest'] })),
  },
}))

vi.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: () => ({
    data: { version: '1.0.0', questions: [], name: 'Test Risk Analysis' },
  }),
}))

vi.mock('@/components/shared/CreateStepPurposeRiskAnalysisForm', () => ({
  CreateStepPurposeRiskAnalysisForm: ({
    onSubmit,
    onCancel,
    riskAnalysis,
  }: {
    onSubmit: (name: string, answers: Record<string, string[]>) => void
    onCancel: () => void
    riskAnalysis: { version: string; questions: Record<string, string>; name: string }
  }) => (
    <div>
      <button onClick={() => onSubmit('TestName', { q1: ['a1'] })}>submit</button>
      <button onClick={onCancel}>cancel</button>
      <span>{riskAnalysis.name}</span>
    </div>
  ),
}))

describe('EServiceTemplateCreateStepAddRiskAnalysis', () => {
  it('calls addEServiceTemplateRiskAnalysis with correct params and closes on success', async () => {
    const onClose = vi.fn()
    const mutate = vi.fn((_, { onSuccess }: { onSuccess: () => void }) => onSuccess())
    // Patch the mocked hook to return our spy
    EServiceTemplateMutations.useAddEServiceTemplateRiskAnalysis = () => ({ mutate }) as never
    
    render(
      <EServiceTemplateCreateStepAddRiskAnalysis
        eserviceTemplateId="template-id"
        selectedTenantKind="PA"
        onClose={onClose}
      />
    )

    await userEvent.click(screen.getByText('submit'))
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        eServiceTemplateId: 'template-id',
        name: 'TestName',
        riskAnalysisForm: { version: '1.0.0', answers: { q1: ['a1'] } },
        tenantKind: 'PA',
      }),
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when cancel is clicked', async () => {
    const onClose = vi.fn()
    render(
      <EServiceTemplateCreateStepAddRiskAnalysis
        eserviceTemplateId="template-id"
        selectedTenantKind="PRIVATE"
        onClose={onClose}
      />
    )
    await userEvent.click(screen.getByText('cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})
