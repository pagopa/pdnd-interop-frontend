import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceTemplateGeneralInfoSummary } from '../components/ProviderEServiceTemplateGeneralInfoSummary'
import {
  mockUseJwt,
  mockUseParams,
  mockEnvironmentParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetails,
  createMockEServiceTemplateVersionDetailsReceiveMode,
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

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

describe('ProviderEServiceTemplateGeneralInfoSummary', () => {
  it('renders template name', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateGeneralInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('templateName.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.eserviceTemplate.name)).toBeInTheDocument()
  })

  it('renders intended target', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateGeneralInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('intendedTarget.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.eserviceTemplate.intendedTarget)).toBeInTheDocument()
  })

  it('renders template description', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateGeneralInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('templateDescription.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.eserviceTemplate.description)).toBeInTheDocument()
  })

  it('renders API technology', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateGeneralInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('apiTechnology.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.eserviceTemplate.technology)).toBeInTheDocument()
  })

  it('renders Signal Hub enabled status', () => {
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateGeneralInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('isSignalHubEnabled.label')).toBeInTheDocument()
    expect(screen.getByText('isSignalHubEnabled.value.true')).toBeInTheDocument()
  })

  it('renders personal data field when feature flag is enabled', () => {
    mockEnvironmentParams('FEATURE_FLAG_ESERVICE_PERSONAL_DATA', true)
    const mockData = createMockEServiceTemplateVersionDetails()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateGeneralInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('personalDataField.DELIVER.label')).toBeInTheDocument()
    expect(screen.getByText('personalDataField.value.true')).toBeInTheDocument()
  })

  it('renders personal data field for RECEIVE mode', () => {
    mockEnvironmentParams('FEATURE_FLAG_ESERVICE_PERSONAL_DATA', true)
    const mockData = createMockEServiceTemplateVersionDetailsReceiveMode()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceTemplateGeneralInfoSummary />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('personalDataField.RECEIVE.label')).toBeInTheDocument()
  })
})
