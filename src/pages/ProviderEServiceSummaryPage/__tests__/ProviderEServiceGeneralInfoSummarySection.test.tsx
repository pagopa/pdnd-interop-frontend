import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceGeneralInfoSummarySection } from '../components/ProviderEServiceGeneralInfoSummarySection'
import {
  mockUseJwt,
  mockUseParams,
  mockEnvironmentParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

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

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

describe('ProviderEServiceGeneralInfoSummarySection', () => {
  it('renders description label', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('description.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.eservice.description)).toBeInTheDocument()
  })

  it('renders apiTechnology label', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('apiTechnology.label')).toBeInTheDocument()
    expect(screen.getByText(mockData.eservice.technology)).toBeInTheDocument()
  })

  it('renders personal data field', () => {
    mockEnvironmentParams('FEATURE_FLAG_ESERVICE_PERSONAL_DATA', true)
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByText(`personalDataField.${mockData.eservice.mode}.label`)
    ).toBeInTheDocument()
    expect(
      screen.getByText(`personalDataField.value.${mockData.eservice.personalData}`)
    ).toBeInTheDocument()
  })

  it('renders isConsumerDelegable', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('isConsumerDelegable.label')).toBeInTheDocument()
    expect(
      screen.getByText(`isConsumerDelegable.value.${mockData.eservice.isConsumerDelegable}`)
    ).toBeInTheDocument()
  })

  it('renders isClientAccessDelegable', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('isClientAccessDelegable.label')).toBeInTheDocument()
    expect(
      screen.getByText(`isClientAccessDelegable.value.${mockData.eservice.isClientAccessDelegable}`)
    ).toBeInTheDocument()
  })

  it('renders Signal Hub enabled status', () => {
    const mockData = createMockEServiceDescriptorProvider()
    useSuspenseQueryMock.mockReturnValue({ data: mockData })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('isSignalHubEnabled.label')).toBeInTheDocument()
    expect(
      screen.getByText(`isSignalHubEnabled.value.${mockData.eservice.isSignalHubEnabled}`)
    ).toBeInTheDocument()
  })
})
