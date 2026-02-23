import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import ProviderEServiceSummaryPage from '../ProviderEServiceSummary.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import {
  createMockEServiceDescriptorReceive,
  createMockEServiceDescriptorProvider,
} from '@/../__mocks__/data/eservice.mocks'

mockUseParams({
  eserviceId: 'eservice-id-001',
  descriptorId: 'descriptor-id-001',
})

const mockNavigate = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate)

vi.mock('../components', () => ({
  ProviderEServiceAttributeVersionSummarySection: () => (
    <div data-testid="attribute-version-summary" />
  ),
  ProviderEServiceDocumentationSummarySection: () => (
    <div data-testid="documentation-summary-summary" />
  ),
  ProviderEServiceGeneralInfoSummarySection: () => <div data-testid="general-info-summary" />,
  ProviderEServiceRiskAnalysisSummaryListSection: () => <div data-testid="risk-analysis-summary" />,
  ProviderEServiceVersionInfoSummarySection: () => <div data-testid="version-info-summary" />,
}))

mockUseJwt()

const useDeleteVersionDraftMock = vi.fn()
const useDeleteDraftMock = vi.fn()
const usePublishVersionDraftMock = vi.fn()
const useApproveDelegatedVersionDraftMock = vi.fn()
const useUpdateEServicePersonalDataFlagAfterPublicationMock = vi.fn()
const useUpdateDraftMock = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: (id: string, versionId: string) => ['eservice', id, versionId],
  },
  EServiceMutations: {
    useDeleteVersionDraft: () => ({
      mutate: useDeleteVersionDraftMock,
    }),
    useDeleteDraft: () => ({
      mutate: useDeleteDraftMock,
    }),
    usePublishVersionDraft: () => ({
      mutate: usePublishVersionDraftMock,
    }),
    useApproveDelegatedVersionDraft: () => ({
      mutate: useApproveDelegatedVersionDraftMock,
    }),
    useUpdateEServicePersonalDataFlagAfterPublication: () => ({
      mutate: useUpdateEServicePersonalDataFlagAfterPublicationMock,
    }),
    useUpdateDraft: () => ({
      mutate: useUpdateDraftMock,
    }),
  },
  EServiceDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

const useQueryMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

vi.mock('@/hooks/useGetProducerDelegationUserRole', () => ({
  useGetProducerDelegationUserRole: () => ({
    isDelegator: false,
    isDelegate: false,
    producerDelegations: [],
  }),
}))

describe('ProviderEServiceSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorReceive(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.title')).toBeInTheDocument()
  })

  it('renders 4 accordion sections in RECEIVE mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorReceive(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('general-info-summary')).toBeInTheDocument()
    expect(screen.getByTestId('attribute-version-summary')).toBeInTheDocument()
    expect(screen.getByTestId('risk-analysis-summary')).toBeInTheDocument()
    expect(screen.getByTestId('documentation-summary-summary')).toBeInTheDocument()
    expect(screen.getByTestId('version-info-summary')).toBeInTheDocument()
  })

  it('renders correct section titles with numbering in RECEIVE mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorReceive(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.generalInfoSummary.title')).toBeInTheDocument()
    expect(screen.getByText('summary.attributeVersionSummary.title')).toBeInTheDocument()
    expect(screen.getByText('summary.riskAnalysisSummaryList.title')).toBeInTheDocument()
    expect(screen.getByText('summary.documentationSummary.title')).toBeInTheDocument()
    expect(screen.getByText('summary.versionInfoSummary.title')).toBeInTheDocument()
  })

  it('renders risk analysis section in RECEIVE mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorReceive(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('risk-analysis-summary')).toBeInTheDocument()
    expect(screen.getByText('summary.riskAnalysisSummaryList.title')).toBeInTheDocument()
  })

  it('does not render risk analysis section in DELIVER mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorProvider(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByTestId('risk-analysis-summary')).not.toBeInTheDocument()
  })

  it('enables publish button when personal data are set', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorProvider(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', { name: 'publish' })
    expect(publishButton).toBeEnabled()
  })

  it('renders edit button', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorProvider(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByTestId('CreateIcon')).toBeInTheDocument()
  })

  it('renders delete button', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorProvider(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByTestId('DeleteOutlineIcon')).toBeInTheDocument()
  })
})
