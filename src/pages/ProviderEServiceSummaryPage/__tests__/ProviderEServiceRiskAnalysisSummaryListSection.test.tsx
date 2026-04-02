import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceRiskAnalysisSummaryListSection } from '../components/ProviderEServiceRiskAnalysisSummaryListSection'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProviderWithRiskAnalysis } from '@/../__mocks__/data/eservice.mocks'

mockUseParams({
  eserviceId: 'eservice-id-001',
  descriptorId: 'descriptor-id-001',
})

mockUseJwt({ isOrganizationAllowedToProduce: true })

const useSuspenseQueryMock = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: (id: string, versionId: string) => ['eservice', id, versionId],
  },
}))

vi.mock('@/components/shared/RiskAnalysisInfoSummary', () => ({
  EServiceRiskAnalysisInfoSummary: () => <div data-testid="risk-analysis-info-summary" />,
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

describe('ProviderEServiceRiskAnalysisSummaryListSection', () => {
  it('renders risk analysis title', () => {
    const mockData = createMockEServiceDescriptorProviderWithRiskAnalysis()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceRiskAnalysisSummaryListSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('riskAnalysisTitle')).toBeInTheDocument()
    expect(screen.queryByTestId('risk-analysis-info-summary')).toBeInTheDocument()
  })
})
