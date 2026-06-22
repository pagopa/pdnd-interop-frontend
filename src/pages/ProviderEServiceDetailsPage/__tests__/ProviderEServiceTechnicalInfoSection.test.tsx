import { EServiceQueries } from '@/api/eservice'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { ProviderEServiceTechnicalInfoSection } from '../components/ProviderEServiceDetailsTab/ProviderEServiceTechnicalInfoSection'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
} from '@/../__mocks__/data/eservice.mocks'

mockUseJwt({ currentRoles: ['admin'], isAdmin: true, jwt: { organizationId: 'producer-id' } })
mockUseParams({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' })

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: vi.fn(),
  },
  EServiceMutations: {
    useUpdateVersion: () => ({ mutate: vi.fn() }),
    useUpdateInstanceVersion: () => ({ mutate: vi.fn() }),
    useUpdateAgreementApprovalPolicy: () => ({ mutate: vi.fn() }),
    useUpdateEServiceDelegationFlagsAfterPublication: () => ({ mutate: vi.fn() }),
  },
  EServiceDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

vi.mock('@/hooks/useGetProducerDelegationUserRole', () => ({
  useGetProducerDelegationUserRole: () => ({
    isDelegator: false,
  }),
}))

vi.mock('@/components/shared/UpdateVoucherDrawer', () => ({
  UpdateVoucherDrawer: () => <div data-testid="update-voucher-drawer" />,
}))

vi.mock(
  '../components/ProviderEServiceDetailsTab/ProviderEServiceTechnicalInfoSection/ProviderEServiceUpdateDocumentationDrawer',
  () => ({
    ProviderEServiceUpdateDocumentationDrawer: () => (
      <div data-testid="update-documentation-drawer" />
    ),
  })
)

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: vi.fn(),
  }
})

describe('ProviderEServiceTechnicalInfoSection', () => {
  it('does not render async exchange fields for synchronous e-services', () => {
    vi.mocked(EServiceQueries.getDescriptorProvider).mockReturnValue({ queryKey: [] } as never)
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: createMockEServiceDescriptorProvider(),
    } as never)

    renderWithApplicationContext(<ProviderEServiceTechnicalInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('exchangeType.label')).toBeInTheDocument()
    expect(screen.getByText('exchangeType.value.sync')).toBeInTheDocument()
    expect(screen.queryByText('asyncExchange.responseTime.label')).not.toBeInTheDocument()
    expect(screen.queryByText('callbackInterface.label')).not.toBeInTheDocument()
  })

  it('renders async exchange fields for asynchronous e-services', () => {
    const descriptor = createMockEServiceDescriptorProviderAsync()
    vi.mocked(EServiceQueries.getDescriptorProvider).mockReturnValue({ queryKey: [] } as never)
    vi.mocked(useSuspenseQuery).mockReturnValue({ data: descriptor } as never)

    renderWithApplicationContext(<ProviderEServiceTechnicalInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('exchangeType.label')).toBeInTheDocument()
    expect(screen.getByText('exchangeType.value.async')).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.responseTime.label')).toBeInTheDocument()
    expect(
      screen.getByText(`${descriptor.asyncExchangeProperties!.responseTime} time.second`)
    ).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.resourceAvailableTime.label')).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.confirmation.label')).toBeInTheDocument()
    expect(screen.getAllByText('asyncExchange.booleanValue.true').length).toBeGreaterThan(0)
    expect(screen.getByText('asyncExchange.bulk.label')).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.maxResultSet.label')).toBeInTheDocument()
    expect(
      screen.getByText(String(descriptor.asyncExchangeProperties!.maxResultSet))
    ).toBeInTheDocument()
    expect(screen.getByText('callbackInterface.label')).toBeInTheDocument()
    expect(
      screen.getByText(descriptor.asyncExchangeCallbackInterface!.prettyName)
    ).toBeInTheDocument()
  })
})
