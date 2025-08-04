import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepPurpose,
  EServiceTemplateCreateStepPurposeSkeleton,
} from '../EServiceTemplateCreateStepPurpose'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as ContextModule from '../../ProviderEServiceTemplateContext'
import type { EServiceTemplateRiskAnalysis } from '@/api/api.generatedTypes'

function mockUseEServiceTemplateCreateContext(riskAnalysis: EServiceTemplateRiskAnalysis[] = []) {
  vi.spyOn(ContextModule, 'useEServiceTemplateCreateContext').mockReturnValue({
    templateVersion: {
      // @ts-expect-error mock
      eserviceTemplate: {
        id: 'template-id',
        riskAnalysis,
      },
    },
    forward: vi.fn(),
    back: vi.fn(),
  })
}

vi.mock('../EServiceTemplateCreateStepPurposeAddPurposeTable', () => ({
  EServiceTemplateCreateStepPurposeAddPurposesTable: ({
    onOpenEditRiskAnalysisForm,
    onOpenAddRiskAnalysisForm,
  }: {
    onOpenEditRiskAnalysisForm: (data: unknown) => void
    onOpenAddRiskAnalysisForm: (tenantKind: string) => void
  }) => (
    <div>
      <button
        onClick={() =>
          onOpenEditRiskAnalysisForm({
            id: 'ra1',
            name: 'RA',
            tenantKind: 'PA',
            riskAnalysisForm: { version: '1.0', answers: {} },
            createdAt: new Date().toISOString(),
          })
        }
      >
        edit
      </button>
      <button onClick={() => onOpenAddRiskAnalysisForm('PRIVATE')}>add</button>
    </div>
  ),
}))

vi.mock('@/components/shared/CreateStepPurposeRiskAnalysisForm', () => ({
  RiskAnalysisFormSkeleton: () => <div data-testid="risk-analysis-skeleton" />,
}))
vi.mock('../EServiceTemplateCreateStepEditRiskAnalysis', () => ({
  EServiceTemplateCreateStepEditRiskAnalysis: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="edit-risk-analysis">
      EditRiskAnalysis
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))
vi.mock('../EServiceTemplateCreateStepAddRiskAnalysis', () => ({
  EServiceTemplateCreateStepAddRiskAnalysis: () => (
    <div data-testid="add-risk-analysis">AddRiskAnalysis</div>
  ),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceTemplateCreateStepPurpose', () => {
  it('renders the table and step actions by default', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepPurpose />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('stepPurpose.purposeTableSection.title')).toBeInTheDocument()
    expect(screen.getByText('stepPurpose.purposeTableSection.description')).toBeInTheDocument()
    expect(screen.getByText('backWithoutSaveBtn')).toBeInTheDocument()
    expect(screen.getByText('forwardWithoutSaveBtn')).toBeInTheDocument()
  })

  it('opens edit risk analysis form when edit is clicked', async () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepPurpose />, {
      withReactQueryContext: true,
    })
    await userEvent.click(screen.getByRole('button', { name: 'edit' }))
    expect(screen.getByText('EditRiskAnalysis')).toBeInTheDocument()
  })

  it('opens add risk analysis form when add is clicked', async () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepPurpose />, {
      withReactQueryContext: true,
    })
    await userEvent.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByText('AddRiskAnalysis')).toBeInTheDocument()
  })

  it('should close edit risk analysis form when close is clicked', async () => {
    renderWithApplicationContext(<EServiceTemplateCreateStepPurpose />, {
      withReactQueryContext: true,
    })
    await userEvent.click(screen.getByRole('button', { name: 'edit' }))
    expect(screen.getByText('EditRiskAnalysis')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('EditRiskAnalysis')).not.toBeInTheDocument()
  })

  it('should disable forward button if no risk analyses are present', () => {
    mockUseEServiceTemplateCreateContext([])
    renderWithApplicationContext(<EServiceTemplateCreateStepPurpose />, {
      withReactQueryContext: true,
    })
    expect(screen.getByRole('button', { name: 'forwardWithoutSaveBtn' })).toBeDisabled()
  })

  it('should enable forward button if risk analyses are present', () => {
    mockUseEServiceTemplateCreateContext([
      {
        id: 'ra1',
        name: 'Risk Analysis 1',
        tenantKind: 'PA',
        riskAnalysisForm: { version: '1.0', answers: {} },
        createdAt: new Date().toISOString(),
      },
    ])
    renderWithApplicationContext(<EServiceTemplateCreateStepPurpose />, {
      withReactQueryContext: true,
    })
    expect(screen.getByRole('button', { name: 'forwardWithoutSaveBtn' })).toBeEnabled()
  })
})

describe('EServiceTemplateCreateStepPurposeSkeleton', () => {
  it('correctly renders the skeleton', () => {
    render(<EServiceTemplateCreateStepPurposeSkeleton />)
  })
})
