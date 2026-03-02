import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { EServiceTemplateTechnicalInfoSection } from '../EServiceTemplateTechnicalInfoSection'
import {
  mockUseJwt,
  mockUseParams,
  mockUseCurrentRoute,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockEServiceTemplateVersionDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'

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
  EServiceTemplateMutations: {
    useUpdateQuotas: () => ({ mutate: vi.fn() }),
    usePostVersionDocument: () => ({ mutate: vi.fn() }),
    useDeleteVersionDocument: () => ({ mutate: vi.fn() }),
    useUpdateVersionDocumentDescription: () => ({ mutate: vi.fn() }),
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

vi.mock('../EServiceTemplateThresholdsSection', () => ({
  EServiceTemplateThresholdsSection: () => <div data-testid="thresholds-section" />,
}))

vi.mock('../EServiceTemplateDocumentationSection', () => ({
  EServiceTemplateDocumentationSection: () => <div data-testid="documentation-section" />,
}))

vi.mock('../EServiceTemplateUsefulLinksSection', () => ({
  EServiceTemplateUsefulLinksSection: () => <div data-testid="useful-links-section" />,
}))

describe('EServiceTemplateTechnicalInfoSection', () => {
  it('renders technology and mode information', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateTechnicalInfoSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('technology')).toBeInTheDocument()
    expect(screen.getByText('mode.label')).toBeInTheDocument()
  })

  it('renders voucher lifespan information', () => {
    const mockData = createMockEServiceTemplateVersionDetails({ voucherLifespan: 120 })
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateTechnicalInfoSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('thresholds.voucherLifespan.label')).toBeInTheDocument()
  })

  it('renders thresholds section when hideThresholds is false', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateTechnicalInfoSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('thresholds-section')).toBeInTheDocument()
  })

  it('hides thresholds section when hideThresholds is true', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateTechnicalInfoSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
        hideThresholds
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.queryByTestId('thresholds-section')).not.toBeInTheDocument()
  })

  it('renders documentation and useful links sections', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateTechnicalInfoSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('documentation-section')).toBeInTheDocument()
    expect(screen.getByTestId('useful-links-section')).toBeInTheDocument()
  })
})
