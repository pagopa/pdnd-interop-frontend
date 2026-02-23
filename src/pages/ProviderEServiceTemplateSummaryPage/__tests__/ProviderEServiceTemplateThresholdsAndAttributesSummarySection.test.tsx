import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceTemplateThresholdsAndAttributesSummarySection } from '../components/ProviderEServiceTemplateThresholdsAndAttributesSummarySection'
import {
  mockUseJwt,
  mockUseParams,
  mockUseCurrentRoute,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetails,
  createMockEServiceTemplateVersionDetailsWithAttributes,
} from '@/../__mocks__/data/eserviceTemplate.mocks'

mockUseParams({
  eServiceTemplateId: 'template-id-001',
  eServiceTemplateVersionId: 'version-id-001',
})

mockUseJwt()
mockUseCurrentRoute({ mode: 'provider' })

const useSuspenseQueryMock = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingle: (id: string, versionId: string) => ['eserviceTemplate', id, versionId],
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

describe('ProviderEServiceTemplateThresholdsAndAttributesSummarySection', () => {
  it('renders thresholds title', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <ProviderEServiceTemplateThresholdsAndAttributesSummarySection />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('thresholdsTitle')).toBeInTheDocument()
  })

  it('renders daily calls per consumer', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <ProviderEServiceTemplateThresholdsAndAttributesSummarySection />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('dailyCallsPerConsumer.label')).toBeInTheDocument()
    expect(screen.getByText('dailyCallsPerConsumer.value')).toBeInTheDocument()
  })

  it('renders daily calls total', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <ProviderEServiceTemplateThresholdsAndAttributesSummarySection />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('dailyCallsTotal.label')).toBeInTheDocument()
    expect(screen.getByText('dailyCallsTotal.value')).toBeInTheDocument()
  })

  // Note: the mock `t()` returns raw keys without keyPrefix,
  // so the attribute sub-component with keyPrefix 'summary.thresholdsAndAttributesSummary.attributes'
  // renders keys like 'certified.label' (not 'attributes.certified.label')
  it('renders attribute section titles', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <ProviderEServiceTemplateThresholdsAndAttributesSummarySection />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('certified.label')).toBeInTheDocument()
    expect(screen.getByText('verified.label')).toBeInTheDocument()
    expect(screen.getByText('declared.label')).toBeInTheDocument()
  })

  it('renders no-attributes alerts when attributes are empty', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <ProviderEServiceTemplateThresholdsAndAttributesSummarySection />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('certified.noAttributesAlert')).toBeInTheDocument()
    expect(screen.getByText('verified.noAttributesAlert')).toBeInTheDocument()
    expect(screen.getByText('declared.noAttributesAlert')).toBeInTheDocument()
  })

  it('renders attribute groups with requirement titles when attributes exist', () => {
    const mockData = createMockEServiceTemplateVersionDetailsWithAttributes()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <ProviderEServiceTemplateThresholdsAndAttributesSummarySection />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.queryByText('certified.noAttributesAlert')).not.toBeInTheDocument()
    expect(screen.queryByText('verified.noAttributesAlert')).not.toBeInTheDocument()
    expect(screen.getByText('declared.noAttributesAlert')).toBeInTheDocument()
  })
})
