import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { ProviderEServiceGeneralInfoSummarySection } from '../ProviderEServiceGeneralInfoSummarySection'
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

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingleByEServiceTemplateId: vi.fn().mockReturnValue({ queryKey: ['template'], queryFn: () => null }),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useSuspenseQuery: () => ({ data: mockDescriptorData }),
  useQuery: () => ({ data: undefined }),
}))

beforeEach(() => {
  mockUseJwt()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('ProviderEServiceGeneralInfoSummarySection - template e-service name', () => {
  it('shows the e-service name when the e-service is from a template', () => {
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

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('Credenziale IT-Wallet - Patente')).toBeInTheDocument()
  })

  it('does NOT show template-specific fields for non-template e-services', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider({
      eservice: {
        name: 'Regular E-Service',
      },
    })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummarySection />, {
      withReactQueryContext: true,
    })

    expect(screen.queryByText('templateInfo.name.label')).not.toBeInTheDocument()
  })
})
