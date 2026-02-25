import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { ProviderEServiceGeneralInfoSummary } from '../ProviderEServiceGeneralInfoSummary'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

vi.mock('@/router', async () => {
  const actual = await vi.importActual<typeof import('@/router')>('@/router')
  return {
    ...actual,
    useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
  }
})

let mockDescriptorData: ProducerEServiceDescriptor

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useSuspenseQuery: () => ({ data: mockDescriptorData }),
  }
})

beforeEach(() => {
  mockUseJwt()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('ProviderEServiceGeneralInfoSummary - instanceLabel', () => {
  it('shows the instanceLabel when the e-service is from a template', () => {
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

    expect(screen.getByText('instanceLabel.label')).toBeInTheDocument()
    expect(screen.getByText('Patente')).toBeInTheDocument()
  })

  it('shows "-" when instanceLabel is undefined but e-service is from a template', () => {
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

    expect(screen.getByText('instanceLabel.label')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('does NOT show instanceLabel for non-template e-services', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider({
      eservice: {
        name: 'Regular E-Service',
      },
    })

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSummary />, {
      withReactQueryContext: true,
    })

    expect(screen.queryByText('instanceLabel.label')).not.toBeInTheDocument()
  })
})
