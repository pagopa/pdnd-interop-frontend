import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { EServiceTemplateThresholdsAndAttributesSection } from '../EServiceTemplateThresholdsAndAttributesSection'
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

mockUseCurrentRoute({ mode: 'provider' })

const useSuspenseQueryMock = vi.fn()
const updateQuotasMock = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingle: (id: string, versionId: string) => ['eserviceTemplate', id, versionId],
  },
  EServiceTemplateMutations: {
    useUpdateQuotas: () => ({ mutate: updateQuotasMock }),
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

vi.mock('@/components/shared/UpdateDailyCallsDrawer', () => ({
  UpdateDailyCallsDrawer: () => <div data-testid="update-daily-calls-drawer" />,
}))

vi.mock('@/components/shared/UpdateAttributesDrawer', () => ({
  UpdateAttributesDrawer: () => <div data-testid="update-attributes-drawer" />,
}))

vi.mock('@/components/shared/ReadOnlyDescriptorAttributes', () => ({
  AttributeGroupsListSection: ({ attributeKey }: { attributeKey: string }) => (
    <div data-testid={`attribute-groups-list-section-${attributeKey}`} />
  ),
}))

describe('EServiceTemplateThresholdsAndAttributesSection', () => {
  it('renders thresholds section with daily calls values', () => {
    mockUseJwt()
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateThresholdsAndAttributesSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('thresholds.dailyCallsPerConsumer.label')).toBeInTheDocument()
    expect(screen.getByText('thresholds.dailyCallsTotal.label')).toBeInTheDocument()
  })

  it('renders daily calls values', () => {
    mockUseJwt()
    const mockData = createMockEServiceTemplateVersionDetails({
      dailyCallsPerConsumer: 1000,
      dailyCallsTotal: 5000,
    })
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateThresholdsAndAttributesSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('1.000')).toBeInTheDocument()
    expect(screen.getByText('5.000')).toBeInTheDocument()
  })

  it('renders attribute sections for certified, verified and declared', () => {
    mockUseJwt()
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateThresholdsAndAttributesSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('attribute-groups-list-section-certified')).toBeInTheDocument()
    expect(screen.getByTestId('attribute-groups-list-section-verified')).toBeInTheDocument()
    expect(screen.getByTestId('attribute-groups-list-section-declared')).toBeInTheDocument()
  })

  it('hides edit actions when readonly is true', () => {
    mockUseJwt()
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateThresholdsAndAttributesSection
        readonly={true}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.queryByText('actions.edit')).not.toBeInTheDocument()
  })

  it('shows edit action when readonly is false', () => {
    mockUseJwt()
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateThresholdsAndAttributesSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('actions.edit')).toBeInTheDocument()
  })

  it('renders drawers', () => {
    mockUseJwt()
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(
      <EServiceTemplateThresholdsAndAttributesSection
        readonly={false}
        routeKey="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('update-daily-calls-drawer')).toBeInTheDocument()
    expect(screen.getByTestId('update-attributes-drawer')).toBeInTheDocument()
  })
})
