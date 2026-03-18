import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { ProviderEServiceGeneralInfoSummary } from '../ProviderEServiceGeneralInfoSummary'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

vi.mock('@/router', () => ({
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
}))

let mockDescriptorData: ProducerEServiceDescriptor

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: vi.fn(),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useSuspenseQuery: () => ({ data: mockDescriptorData }),
}))

beforeEach(() => {
  mockUseJwt()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('ProviderEServiceGeneralInfoSummary - catalogName', () => {
  it('shows the catalog name when the e-service is from a template', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider({
      eservice: {
        name: 'Credenziale IT-Wallet - Patente',
        instanceLabel: 'Patente',
      },
      templateRef: {
        templateId: 'template-id',
        templateVersionId: 'template-version-id',
        templateName: 'Credenziale IT-Wallet',
      },
    })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummary />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('catalogName.label')).toBeInTheDocument()
    expect(screen.getByText('Credenziale IT-Wallet - Patente')).toBeInTheDocument()
  })

  it('shows the catalog name even when instanceLabel is undefined', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider({
      eservice: {
        name: 'Credenziale IT-Wallet',
        instanceLabel: undefined,
      },
      templateRef: {
        templateId: 'template-id',
        templateVersionId: 'template-version-id',
        templateName: 'Credenziale IT-Wallet',
      },
    })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummary />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('catalogName.label')).toBeInTheDocument()
    expect(screen.getByText('Credenziale IT-Wallet')).toBeInTheDocument()
  })

  it('does NOT show catalog name for non-template e-services', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider({
      eservice: {
        name: 'Regular E-Service',
      },
    })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummary />, {
      withReactQueryContext: true,
    })

    expect(screen.queryByText('catalogName.label')).not.toBeInTheDocument()
  })
})
