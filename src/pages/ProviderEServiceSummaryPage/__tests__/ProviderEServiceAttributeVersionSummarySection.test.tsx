import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceAttributeVersionSummarySection } from '../components/ProviderEServiceAttributeVersionSummarySection'
import {
  mockUseJwt,
  mockUseParams,
  mockUseCurrentRoute,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

mockUseParams({
  eserviceId: 'eservice-id-001',
  descriptorId: 'descriptor-id-001',
})

mockUseJwt()
mockUseCurrentRoute({ mode: 'provider' })

const useSuspenseQueryMock = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: (id: string, versionId: string) => ['eservice', id, versionId],
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

describe('ProviderEServiceAttributeVersionSummarySection', () => {
  it('renders thresholds title', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceAttributeVersionSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('thresholds.label')).toBeInTheDocument()
  })

  it('renders daily calls per consumer', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceAttributeVersionSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('thresholds.dailyCallsPerConsumer.label')).toBeInTheDocument()
    expect(screen.getByText('thresholds.dailyCallsPerConsumer.value')).toBeInTheDocument()
  })

  it('renders daily calls total', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceAttributeVersionSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('thresholds.dailyCallsTotal.label')).toBeInTheDocument()
    expect(screen.getByText('thresholds.dailyCallsTotal.value')).toBeInTheDocument()
  })
})
