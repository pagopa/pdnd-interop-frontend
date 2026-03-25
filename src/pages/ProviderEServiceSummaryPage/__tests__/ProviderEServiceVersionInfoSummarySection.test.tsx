import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceVersionInfoSummarySection } from '../components/ProviderEServiceVersionInfoSummarySection'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderWithDocs,
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

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

describe('ProviderEServiceVersionInfoSummarySection', () => {
  it('renders description label', () => {
    const mockData = createMockEServiceDescriptorProviderWithDocs()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceVersionInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('description.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.description!)).toBeInTheDocument()
  })

  it('renders doc download link when doc exists', () => {
    const mockData = createMockEServiceDescriptorProviderWithDocs()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceVersionInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText(mockData.docs[0].prettyName)).toBeInTheDocument()
    expect(screen.queryByTestId('AttachFileIcon')).toBeInTheDocument()
  })

  it('does not render interface section when interface is missing', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceVersionInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByTestId('AttachFileIcon')).not.toBeInTheDocument()
  })

  it('renders manual approval label', () => {
    const mockData = createMockEServiceDescriptorProviderWithDocs()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceVersionInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('manualApproval.label')).toBeInTheDocument()
    expect(screen.getByText('manualApproval.value.true')).toBeInTheDocument()
  })
})
