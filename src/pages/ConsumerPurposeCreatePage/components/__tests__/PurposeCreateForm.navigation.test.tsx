import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'
import { PurposeCreateForm } from '../PurposeCreateForm'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

const { mockNavigate, mockEserviceMode } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockEserviceMode: { current: 'DELIVER' as 'DELIVER' | 'RECEIVE' },
}))

vi.mock('@/router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useCreateDraft: () => ({
      mutate: (_payload: unknown, opts?: { onSuccess?: (data: { id: string }) => void }) =>
        opts?.onSuccess?.({ id: 'new-purpose-id' }),
    }),
    useCreateDraftForReceiveEService: () => ({
      mutate: (_payload: unknown, opts?: { onSuccess?: (data: { id: string }) => void }) =>
        opts?.onSuccess?.({ id: 'new-purpose-id' }),
    }),
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
      if (queryKey?.[0] === 'eservices') return { data: 'descriptor-id-1', isLoading: false }
      if (queryKey?.[0] === 'descriptor')
        return { data: { eservice: { mode: mockEserviceMode.current } }, isLoading: false }
      if (queryKey?.[0] === 'purpose-templates')
        return { data: { results: [], totalCount: 0 }, isLoading: false }
      return { data: undefined, isLoading: false }
    }),
  }
})

vi.mock('../PurposeCreateConsumerAutocomplete', () => ({
  PurposeCreateConsumerAutocomplete: () => <div>ConsumerAutocomplete</div>,
}))

vi.mock('../PurposeCreateEServiceAutocomplete', () => ({
  PurposeCreateEServiceAutocomplete: () => {
    const { setValue } = useFormContext()
    return (
      <button
        type="button"
        onClick={() => setValue('eservice', { id: 'es-1', name: 'es', producer: { id: 'p-1' } })}
      >
        set-eservice
      </button>
    )
  },
}))

vi.mock('../PurposeCreateProviderRiskAnalysisAutocomplete', () => ({
  PurposeCreateProviderRiskAnalysisAutocomplete: () => {
    const { setValue } = useFormContext()
    return (
      <button type="button" onClick={() => setValue('providerRiskAnalysisId', 'risk-analysis-1')}>
        set-risk-analysis
      </button>
    )
  },
}))

vi.mock('@/components/shared/RiskAnalysisInfoSummary', () => ({
  EServiceRiskAnalysisInfoSummary: () => <div>RiskAnalysisInfoSummary</div>,
}))

vi.mock('../PurposeCreatePurposeTemplateSection/PurposeCreatePurposeTemplateSection', () => ({
  PurposeCreatePurposeTemplateSection: () => null,
}))

describe('PurposeCreateForm — first-edit navigation state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt()
  })

  it('navigates to the edit page with isFirstEdit state after creating a DELIVER draft', async () => {
    mockEserviceMode.current = 'DELIVER'
    renderWithApplicationContext(<PurposeCreateForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('set-eservice'))
    await userEvent.click(screen.getByRole('button', { name: 'create.createNewPurposeBtn' }))

    expect(mockNavigate).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_EDIT', {
      params: { purposeId: 'new-purpose-id' },
      state: { isFirstEdit: true },
    })
  })

  it('navigates to the edit page with isFirstEdit state after creating a RECEIVE draft', async () => {
    mockEserviceMode.current = 'RECEIVE'
    renderWithApplicationContext(<PurposeCreateForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('set-eservice'))
    await userEvent.click(screen.getByText('set-risk-analysis'))
    await userEvent.click(screen.getByRole('button', { name: 'create.createNewPurposeBtn' }))

    expect(mockNavigate).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_EDIT', {
      params: { purposeId: 'new-purpose-id' },
      state: { isFirstEdit: true },
    })
  })
})
