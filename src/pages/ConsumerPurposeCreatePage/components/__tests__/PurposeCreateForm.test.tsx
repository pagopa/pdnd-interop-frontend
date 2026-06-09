import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'
import { PurposeCreateForm } from '../PurposeCreateForm'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

vi.mock('@/router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useCreateDraft: () => ({ mutate: vi.fn() }),
    useCreateDraftForReceiveEService: () => ({ mutate: vi.fn() }),
    useCreateDraftFromPurposeTemplate: () => ({ mutate: vi.fn() }),
  },
  PurposeQueries: {
    getSingle: () => ({ queryKey: ['purpose-single'], queryFn: vi.fn() }),
  },
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getAllCatalogEServices: () => ({ queryKey: ['eservices'], queryFn: vi.fn() }),
    getDescriptorCatalog: () => ({ queryKey: ['descriptor'], queryFn: vi.fn() }),
  },
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getCatalogPurposeTemplates: () => ({ queryKey: ['purpose-templates'], queryFn: vi.fn() }),
  },
}))

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(({ queryKey }: { queryKey: Array<string> }) => {
      if (queryKey?.[0] === 'purpose-templates') {
        return {
          data: { results: [{ id: 'tpl-1' }], totalCount: 1 },
          isLoading: false,
        }
      }
      return { data: undefined, isLoading: false }
    }),
  }
})

vi.mock('../PurposeCreateConsumerAutocomplete', () => ({
  PurposeCreateConsumerAutocomplete: () => <div>ConsumerAutocomplete</div>,
}))

vi.mock('../PurposeCreateEServiceAutocomplete', () => ({
  PurposeCreateEServiceAutocomplete: () => <div>EServiceAutocomplete</div>,
}))

vi.mock('../PurposeCreateProviderRiskAnalysisAutocomplete', () => ({
  PurposeCreateProviderRiskAnalysisAutocomplete: () => <div>ProviderRiskAnalysisAutocomplete</div>,
}))

vi.mock('@/components/shared/RiskAnalysisInfoSummary', () => ({
  EServiceRiskAnalysisInfoSummary: () => <div>RiskAnalysisInfoSummary</div>,
}))

vi.mock('../PurposeCreatePurposeTemplateSection/PurposeCreatePurposeTemplateSection', () => ({
  PurposeCreatePurposeTemplateSection: () => {
    const { watch, setValue } = useFormContext()
    const usePurposeTemplate = watch('usePurposeTemplate')
    return (
      <label>
        <input
          type="checkbox"
          checked={!!usePurposeTemplate}
          onChange={() => setValue('usePurposeTemplate', !usePurposeTemplate)}
        />
        usePurposeTemplateSwitch
      </label>
    )
  },
}))

const renderForm = () =>
  renderWithApplicationContext(<PurposeCreateForm />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })

describe('PurposeCreateForm — evaluator warning alert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt()
  })

  it('does not render the evaluator warning alert when usePurposeTemplate is OFF', () => {
    renderForm()
    expect(
      screen.queryByText(
        'create.purposeTemplateField.usePurposeTemplateSwitch.evaluatorWarningAlert'
      )
    ).not.toBeInTheDocument()
  })

  it('renders the evaluator warning alert when usePurposeTemplate is ON', async () => {
    renderForm()

    const toggle = screen.getByLabelText('usePurposeTemplateSwitch')
    await userEvent.click(toggle)

    expect(
      screen.getByText('create.purposeTemplateField.usePurposeTemplateSwitch.evaluatorWarningAlert')
    ).toBeInTheDocument()
  })
})
