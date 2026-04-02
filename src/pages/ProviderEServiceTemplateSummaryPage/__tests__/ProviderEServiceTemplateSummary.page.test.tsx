import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import ProviderEServiceTemplateSummaryPage from '../ProviderEServiceTemplateSummary.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import {
  createMockEServiceTemplateVersionDetails,
  createMockEServiceTemplateVersionDetailsReceiveMode,
  createMockEServiceTemplateVersionDetailsNoInterface,
  createMockEServiceTemplateVersionDetailsNoPersonalData,
} from '@/../__mocks__/data/eserviceTemplate.mocks'

mockUseParams({
  eServiceTemplateId: 'template-id-001',
  eServiceTemplateVersionId: 'version-id-001',
})

const mockNavigate = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate)

vi.mock('../components', () => ({
  ProviderEServiceTemplateGeneralInfoSummarySection: () => (
    <div data-testid="general-info-summary" />
  ),
  ProviderEServiceTemplateThresholdsAndAttributesSummarySection: () => (
    <div data-testid="thresholds-attributes-summary" />
  ),
  ProviderEServiceTemplateTechnicalSpecsSummarySection: () => (
    <div data-testid="technical-specs-summary" />
  ),
  ProviderEServiceTemplateAdditionalInfoSummarySection: () => (
    <div data-testid="additional-info-summary" />
  ),
}))

vi.mock('../components/ProviderEServiceTemplateRiskAnalysisSummaryList', () => ({
  ProviderEServiceTemplateRiskAnalysisSummaryList: () => (
    <div data-testid="risk-analysis-summary" />
  ),
}))

mockUseJwt()

const deleteDraftMock = vi.fn()
const publishDraftMock = vi.fn()
const updatePersonalDataMock = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingle: (id: string, versionId: string) => ['eserviceTemplate', id, versionId],
  },
  EServiceTemplateMutations: {
    useDeleteVersionDraft: () => ({
      mutate: deleteDraftMock,
    }),
    usePublishVersionDraft: () => ({
      mutate: publishDraftMock,
    }),
    useUpdateEServiceTemplatePersonalDataFlagAfterPublication: () => ({
      mutate: updatePersonalDataMock,
    }),
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

describe('ProviderEServiceTemplateSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetails(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.title')).toBeInTheDocument()
  })

  it('renders 4 accordion sections in DELIVER mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetails(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('general-info-summary')).toBeInTheDocument()
    expect(screen.getByTestId('thresholds-attributes-summary')).toBeInTheDocument()
    expect(screen.getByTestId('technical-specs-summary')).toBeInTheDocument()
    expect(screen.getByTestId('additional-info-summary')).toBeInTheDocument()
    expect(screen.queryByTestId('risk-analysis-summary')).not.toBeInTheDocument()
  })

  it('renders correct section titles with numbering in DELIVER mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetails(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.generalInfoSummary.title')).toBeInTheDocument()
    expect(screen.getByText('summary.thresholdsAndAttributesSummary.title')).toBeInTheDocument()
    expect(screen.getByText('summary.technicalSpecsSummary.title')).toBeInTheDocument()
    expect(screen.getByText('summary.additionalInfoSummary.title')).toBeInTheDocument()
  })

  it('renders risk analysis section in RECEIVE mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetailsReceiveMode(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('risk-analysis-summary')).toBeInTheDocument()
    expect(screen.getByText('summary.riskAnalysisSummaryList.title')).toBeInTheDocument()
  })

  it('does not render risk analysis section in DELIVER mode', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetails(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByTestId('risk-analysis-summary')).not.toBeInTheDocument()
  })

  it('enables publish button when interface and personal data are set', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetails(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', { name: 'publish' })
    expect(publishButton).toBeEnabled()
  })

  it('disables publish button when interface is missing', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetailsNoInterface(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', { name: 'publish' })
    expect(publishButton).toBeDisabled()
  })

  it('disables publish button when personal data is not set', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetailsNoPersonalData(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', { name: 'publish' })
    expect(publishButton).toBeDisabled()
  })

  it('renders delete draft and edit draft buttons', () => {
    useQueryMock.mockReturnValue({
      data: createMockEServiceTemplateVersionDetails(),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceTemplateSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'deleteDraft' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'editDraft' })).toBeInTheDocument()
  })
})
