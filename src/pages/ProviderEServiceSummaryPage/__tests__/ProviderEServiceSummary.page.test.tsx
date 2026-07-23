import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProviderEServiceSummaryPage from '../ProviderEServiceSummary.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import {
  createMockEServiceDescriptorReceive,
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
  createMockEServiceDescriptorProviderWithTemplateRef,
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

vi.mock('@/api/keychain', () => ({
  KeychainQueries: {
    getKeychainsList: (params: unknown) => ({
      queryKey: ['KeychainGetList', params],
    }),
  },
}))

const useQueryMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: (queryOptions: unknown) => useQueryMock(queryOptions),
  }
})

const mockDelegationRole = vi.fn().mockReturnValue({
  isDelegator: false,
  isDelegate: false,
  producerDelegations: [],
})

vi.mock('@/hooks/useGetProducerDelegationUserRole', () => ({
  useGetProducerDelegationUserRole: (...args: unknown[]) => mockDelegationRole(...args),
}))

describe('ProviderEServiceSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDelegationRole.mockReturnValue({
      isDelegator: false,
      isDelegate: false,
      producerDelegations: [],
    })
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

  it('enables publish button for complete asynchronous e-services', () => {
    mockUseQueryWithDescriptor(createMockEServiceDescriptorProviderAsync())

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', { name: 'publish' })
    expect(publishButton).toBeEnabled()
  })

  it('does not show the publish warning while asynchronous keychains are loading', () => {
    mockUseQueryWithDescriptor(createMockEServiceDescriptorProviderAsync(), {
      isKeychainsLoading: true,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByText('summary.publishWarningLabel')).not.toBeInTheDocument()
  })

  it('disables publish button when asynchronous mandatory fields are missing', () => {
    mockUseQueryWithDescriptor(
      createMockEServiceDescriptorProviderAsync({
        asyncExchangeProperties: undefined,
        asyncExchangeCallbackInterface: undefined,
      })
    )

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', {
      name: 'publish - summary.notPublishableTooltip.label',
    })
    expect(publishButton).toHaveAttribute('aria-disabled', 'true')
  })

  it('disables delegated approval when asynchronous mandatory fields are missing', () => {
    mockDelegationRole.mockReturnValue({
      isDelegator: true,
      isDelegate: false,
      producerDelegations: [],
    })
    mockUseQueryWithDescriptor(
      createMockEServiceDescriptorProviderAsync({
        state: 'WAITING_FOR_APPROVAL',
        asyncExchangeProperties: undefined,
        asyncExchangeCallbackInterface: undefined,
      })
    )

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const approveButton = screen.getByRole('button', {
      name: 'publish - summary.notPublishableTooltip.label',
    })
    expect(approveButton).toBeDisabled()
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

  it('should not render CTA buttons for delegate viewing a template eservice in WAITING_FOR_APPROVAL state', () => {
    mockDelegationRole.mockReturnValue({
      isDelegator: false,
      isDelegate: true,
      producerDelegations: [],
    })

    useQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorProviderWithTemplateRef({
        state: 'WAITING_FOR_APPROVAL',
      }),
      isLoading: false,
    })

    renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByRole('button', { name: 'publish' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('DeleteOutlineIcon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('CreateIcon')).not.toBeInTheDocument()
  })

  describe('handlePublishDraft navigation state', () => {
    const setupAndPublish = async (
      descriptor: ReturnType<typeof createMockEServiceDescriptorProvider>
    ) => {
      const user = userEvent.setup()

      if (descriptor.eservice.asyncExchange) {
        mockUseQueryWithDescriptor(descriptor)
      } else {
        useQueryMock.mockReturnValue({ data: descriptor, isLoading: false })
      }

      usePublishVersionDraftMock.mockImplementationOnce(
        (_params: unknown, { onSuccess }: { onSuccess: () => void }) => {
          onSuccess()
        }
      )

      renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      await user.click(screen.getByRole('button', { name: 'publish' }))
    }

    it('navigates with firstVersion state when publishing sync first version', async () => {
      await setupAndPublish(createMockEServiceDescriptorProvider({ version: '1' }))

      expect(mockNavigate).toHaveBeenCalledWith(
        'PROVIDE_ESERVICE_PUBLISH_THANK_YOU',
        expect.objectContaining({
          state: expect.objectContaining({
            title: 'publishThankYou.firstVersion.title',
            description: 'publishThankYou.firstVersion.description',
          }),
        })
      )
    })

    it('navigates with firstVersionAsync state when publishing async first version', async () => {
      await setupAndPublish(createMockEServiceDescriptorProviderAsync({ version: '1' }))

      expect(mockNavigate).toHaveBeenCalledWith(
        'PROVIDE_ESERVICE_PUBLISH_THANK_YOU',
        expect.objectContaining({
          state: expect.objectContaining({
            title: 'publishThankYou.firstVersionAsync.title',
            description: 'publishThankYou.firstVersionAsync.description',
          }),
        })
      )
    })

    it('navigates with newVersion state when publishing sync new version', async () => {
      await setupAndPublish(createMockEServiceDescriptorProvider())

      expect(mockNavigate).toHaveBeenCalledWith(
        'PROVIDE_ESERVICE_PUBLISH_THANK_YOU',
        expect.objectContaining({
          state: expect.objectContaining({
            title: 'publishThankYou.newVersion.title',
            subtitle: 'publishThankYou.newVersion.subtitle',
          }),
        })
      )
    })

    it('navigates with newVersionAsync state when publishing async new version', async () => {
      await setupAndPublish(createMockEServiceDescriptorProviderAsync())

      expect(mockNavigate).toHaveBeenCalledWith(
        'PROVIDE_ESERVICE_PUBLISH_THANK_YOU',
        expect.objectContaining({
          state: expect.objectContaining({
            title: 'publishThankYou.newVersionAsync.title',
            subtitle: 'publishThankYou.newVersionAsync.subtitle',
          }),
        })
      )
    })
  })

  describe('isRulesetExpired', () => {
    it('should be true when there are no other descriptors and riskAnalysis rulesetExpiration is expired', () => {
      const mock = createMockEServiceDescriptorProvider()
      mock.eservice.descriptors = []
      mock.eservice.riskAnalysis = [
        {
          id: 'risk-analysis-id-001',
          name: 'Risk Analysis 1',
          riskAnalysisForm: {
            riskAnalysisId: 'form-id-001',
            version: 'version-001',
            answers: 'answers-001',
          },
          createdAt: '',
          rulesetExpiration: '2020-01-01T00:00:00Z',
        },
      ]

      useQueryMock.mockReturnValue({
        data: mock,
        isLoading: false,
      })

      renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      const publishButton = screen.getByRole('button', {
        name: 'publish - summary.rulesetExpiredTooltip.label',
      })
      expect(publishButton).toHaveAttribute('aria-disabled', 'true')
    })

    it('should be false when there are other descriptors even if riskAnalysis rulesetExpiration is expired', () => {
      useQueryMock.mockReturnValue({
        data: createMockEServiceDescriptorProvider({
          eservice: {
            descriptors: [
              {
                id: 'descriptor-id-001',
                state: 'PUBLISHED',
                version: '1',
                audience: [],
              },
            ],
            riskAnalysis: [
              {
                id: 'risk-analysis-id-001',
                name: 'Risk Analysis 1',
                riskAnalysisForm: {
                  riskAnalysisId: 'form-id-001',
                  version: 'version-001',
                },
                createdAt: '',
                rulesetExpiration: '2020-01-01T00:00:00Z',
              },
            ],
          },
        }),
        isLoading: false,
      })

      renderWithApplicationContext(<ProviderEServiceSummaryPage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      const publishButton = screen.getByRole('button', { name: 'publish' })
      expect(publishButton).toBeEnabled()
    })
  })
})

function mockUseQueryWithDescriptor(
  descriptor: ReturnType<typeof createMockEServiceDescriptorProvider>,
  { isKeychainsLoading = false }: { isKeychainsLoading?: boolean } = {}
) {
  useQueryMock.mockImplementation((queryOptions) => {
    if (queryOptions?.queryKey?.[0] === 'KeychainGetList') {
      return {
        data: isKeychainsLoading
          ? undefined
          : {
              results: [{ id: 'keychain-id-001', name: 'Keychain 1', hasKeys: true }],
              pagination: { totalCount: 1 },
            },
        isLoading: isKeychainsLoading,
      }
    }

    return {
      data: descriptor,
      isLoading: false,
    }
  })
}
