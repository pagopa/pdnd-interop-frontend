import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceDocumentationSummarySection } from '../components/ProviderEServiceDocumentationSummarySection'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
  createMockEServiceDescriptorProviderNoInterface,
} from '@/../__mocks__/data/eservice.mocks'

mockUseParams({
  eserviceId: 'eservice-id-001',
  descriptorId: 'descriptor-id-001',
})

mockUseJwt()

const useSuspenseQueryMock = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: (id: string, versionId: string) => ['eservice', id, versionId],
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
    useSuspenseQuery: () => useSuspenseQueryMock(),
    useQuery: () => useQueryMock(),
  }
})

describe('ProviderEServiceDocumentationSummarySection', () => {
  beforeEach(() => {
    useQueryMock.mockReturnValue({
      data: {
        results: [],
        pagination: { totalCount: 0 },
      },
    })
  })

  it('renders voucher lifespan', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceDocumentationSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('voucherLifespan.label')).toBeInTheDocument()
  })

  it('renders interface download link when interface exists', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceDocumentationSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('interface.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.interface!.prettyName)).toBeInTheDocument()
  })

  it('does not render interface section when interface is missing', () => {
    const mockData = createMockEServiceDescriptorProviderNoInterface()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceDocumentationSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByTestId('AttachFileIcon')).not.toBeInTheDocument()
  })

  it('does not render async fields for synchronous e-services', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceDocumentationSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('interface.label')).toBeInTheDocument()
    expect(screen.queryByText('callbackInterface.label')).not.toBeInTheDocument()
    expect(screen.queryByText('producerKeychains.label')).not.toBeInTheDocument()
  })

  it('renders async fields for complete asynchronous e-services', () => {
    const mockData = createMockEServiceDescriptorProviderAsync()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })
    const associatedKeychains = {
      results: [{ id: 'keychain-id-001', name: 'Keychain 1', hasKeys: true }],
      pagination: { offset: 0, limit: 50, totalCount: 1 },
    }

    renderWithApplicationContext(
      <ProviderEServiceDocumentationSummarySection associatedKeychains={associatedKeychains} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('callbackInterface.label')).toBeInTheDocument()
    expect(
      screen.getByText(mockData.asyncExchangeCallbackInterface!.prettyName)
    ).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.responseTime.label')).toBeInTheDocument()
    expect(
      screen.getByText(`${mockData.asyncExchangeProperties!.responseTime} time.second`)
    ).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.resourceAvailableTime.label')).toBeInTheDocument()
    expect(
      screen.getByText(`${mockData.asyncExchangeProperties!.resourceAvailableTime} time.second`)
    ).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.confirmation.label')).toBeInTheDocument()
    expect(screen.getAllByText('asyncExchange.booleanValue.true').length).toBeGreaterThan(0)
    expect(screen.getByText('asyncExchange.bulk.label')).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.maxResultSet.label')).toBeInTheDocument()
    expect(
      screen.getByText(String(mockData.asyncExchangeProperties!.maxResultSet))
    ).toBeInTheDocument()
    expect(screen.getByText('producerKeychains.label')).toBeInTheDocument()
    expect(screen.getByText('Keychain 1')).toBeInTheDocument()
  })

  it('renders the hidden keychains count when not all associated keychains are fetched', () => {
    const mockData = createMockEServiceDescriptorProviderAsync()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })
    const associatedKeychains = {
      results: Array.from({ length: 50 }, (_, index) => ({
        id: `keychain-id-${index}`,
        name: `Keychain ${index}`,
        hasKeys: true,
      })),
      pagination: { offset: 0, limit: 50, totalCount: 52 },
    }

    renderWithApplicationContext(
      <ProviderEServiceDocumentationSummarySection associatedKeychains={associatedKeychains} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('producerKeychains.moreLabel')).toBeInTheDocument()
  })

  it('renders missing async fields for incomplete asynchronous e-services', () => {
    const mockData = createMockEServiceDescriptorProviderAsync({
      asyncExchangeProperties: undefined,
      asyncExchangeCallbackInterface: undefined,
    })
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceDocumentationSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('callbackInterface.label')).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.responseTime.label')).toBeInTheDocument()
    expect(screen.getByText('producerKeychains.label')).toBeInTheDocument()
    expect(
      screen.getAllByText('summary.documentationSummary.missingInfoLabel').length
    ).toBeGreaterThan(1)
  })
})
