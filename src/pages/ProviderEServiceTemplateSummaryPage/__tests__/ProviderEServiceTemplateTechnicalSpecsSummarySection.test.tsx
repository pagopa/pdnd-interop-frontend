import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceTemplateTechnicalSpecsSummarySection } from '../components/ProviderEServiceTemplateTechnicalSpecsSummarySection'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetails,
  createMockEServiceTemplateVersionDetailsNoInterface,
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

describe('ProviderEServiceTemplateTechnicalSpecsSummarySection', () => {
  it('renders voucher lifespan', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateTechnicalSpecsSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('voucherLifespan.label')).toBeInTheDocument()
  })

  it('renders interface download link when interface exists', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateTechnicalSpecsSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('interface.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.interface!.prettyName)).toBeInTheDocument()
  })

  it('does not render interface section when interface is missing', () => {
    const mockData = createMockEServiceTemplateVersionDetailsNoInterface()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateTechnicalSpecsSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByText('interface.label')).not.toBeInTheDocument()
  })
})
