import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceTemplateAdditionalInfoSummary } from '../components/ProviderEServiceTemplateAdditionalInfoSummary'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetails,
  createMockEServiceTemplateVersionDetailsManualApproval,
} from '@/../__mocks__/data/eserviceTemplate.mocks'

mockUseParams({
  eServiceTemplateId: 'template-id-001',
  eServiceTemplateVersionId: 'version-id-001',
})

mockUseJwt()

const useSuspenseQueryMock = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingle: (id: string, versionId: string) => ['eserviceTemplate', id, versionId],
  },
}))

vi.mock('@/api/eserviceTemplate/eserviceTemplate.downloads', () => ({
  EServiceTemplateDownloads: {
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

describe('ProviderEServiceTemplateAdditionalInfoSummary', () => {
  it('renders version description', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateAdditionalInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('versionDescription.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.description!)).toBeInTheDocument()
  })

  it('renders documentation label', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateAdditionalInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('documentation.label')).toBeInTheDocument()
  })

  it('renders document names when docs exist', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateAdditionalInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('User Guide')).toBeInTheDocument()
  })

  it('renders empty documentation message when no docs', () => {
    const mockData = createMockEServiceTemplateVersionDetails({ docs: [] })
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateAdditionalInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('emptyDocumentation')).toBeInTheDocument()
  })

  it('renders manual approval as false for AUTOMATIC policy', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateAdditionalInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('manualApproval.label')).toBeInTheDocument()
    expect(screen.getByText('manualApproval.value.false')).toBeInTheDocument()
  })

  it('renders manual approval as true for MANUAL policy', () => {
    const mockData = createMockEServiceTemplateVersionDetailsManualApproval()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateAdditionalInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('manualApproval.value.true')).toBeInTheDocument()
  })

  it('renders n/a when version description is missing', () => {
    const mockData = createMockEServiceTemplateVersionDetails({ description: undefined })
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateAdditionalInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('n/a')).toBeInTheDocument()
  })
})
