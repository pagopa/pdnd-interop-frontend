import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ProviderEServiceGeneralInfoSection } from '../ProviderEServiceGeneralInfoSection'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import * as EServiceModule from '@/api/eservice'
import * as EServiceTemplateModule from '@/api/eserviceTemplate'
import { DUPLICATE_INSTANCE_LABEL_ERROR_CODE } from '@/api/eserviceTemplate/eserviceTemplate.mutations'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

const mockUpdateInstanceLabel = vi.fn()
const mockUpdateDescription = vi.fn()
const mockUpdateName = vi.fn()
const mockUpdatePersonalData = vi.fn()
const mockDownloadConsumerList = vi.fn()
const mockExportVersion = vi.fn()

vi.mock('@/router', async () => {
  const actual = await vi.importActual<typeof import('@/router')>('@/router')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
    Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  }
})

vi.mock('@/config/tracking', () => ({
  trackEvent: vi.fn(),
}))

let mockDescriptorData: ProducerEServiceDescriptor

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useSuspenseQuery: () => ({ data: mockDescriptorData }),
    useQuery: () => ({ data: [] }),
  }
})

vi.mock('@/hooks/useGetProducerDelegationUserRole', () => ({
  useGetProducerDelegationUserRole: () => ({
    isDelegate: false,
    isDelegator: false,
    producerDelegations: [],
  }),
}))

const baseTemplateDescriptor = createMockEServiceDescriptorProvider({
  state: 'PUBLISHED',
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

beforeEach(() => {
  mockUseJwt()

  vi.spyOn(EServiceModule.EServiceMutations, 'useUpdateEServiceDescription').mockReturnValue({
    mutate: mockUpdateDescription,
  } as never)
  vi.spyOn(EServiceModule.EServiceMutations, 'useUpdateEServiceName').mockReturnValue({
    mutate: mockUpdateName,
  } as never)
  vi.spyOn(
    EServiceModule.EServiceMutations,
    'useUpdateEServicePersonalDataFlagAfterPublication'
  ).mockReturnValue({
    mutate: mockUpdatePersonalData,
  } as never)
  vi.spyOn(EServiceModule.EServiceDownloads, 'useDownloadConsumerList').mockReturnValue(
    mockDownloadConsumerList as never
  )
  vi.spyOn(EServiceModule.EServiceDownloads, 'useExportVersion').mockReturnValue(
    mockExportVersion as never
  )
  vi.spyOn(
    EServiceTemplateModule.EServiceTemplateMutations,
    'useUpdateInstanceLabelAfterPublication'
  ).mockReturnValue({ mutate: mockUpdateInstanceLabel } as never)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('ProviderEServiceGeneralInfoSection - instanceLabel (published e-service from template)', () => {
  it('shows the instanceLabel value when defined', () => {
    mockDescriptorData = baseTemplateDescriptor
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('instanceLabel.label')).toBeInTheDocument()
    expect(screen.getByText('Patente')).toBeInTheDocument()
  })

  it('shows a "-" placeholder when instanceLabel is undefined', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider({
      state: 'PUBLISHED',
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
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('instanceLabel.label')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('shows the edit button for instanceLabel when user is not a delegator', () => {
    mockDescriptorData = baseTemplateDescriptor
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('actions.edit')).toBeInTheDocument()
  })

  it('opens the update instanceLabel drawer when clicking the edit button', async () => {
    const user = userEvent.setup()
    mockDescriptorData = baseTemplateDescriptor
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    const editButton = screen.getByText('actions.edit')
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByText('updateInstanceLabelDrawer.title')).toBeInTheDocument()
    })
  })

  it('calls updateInstanceLabel mutation on drawer submit', async () => {
    const user = userEvent.setup()
    mockDescriptorData = baseTemplateDescriptor
    mockUpdateInstanceLabel.mockImplementation(
      (_payload: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess()
      }
    )

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    const editButton = screen.getByText('actions.edit')
    await user.click(editButton)

    const input = screen.getByRole('textbox', {
      name: 'instanceLabelField.label',
    })
    await user.clear(input)
    await user.type(input, 'CIE')

    const submitButton = screen.getByRole('button', { name: 'actions.upgrade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateInstanceLabel).toHaveBeenCalledWith(
        expect.objectContaining({
          eServiceId: baseTemplateDescriptor.eservice.id,
          instanceLabel: 'CIE',
        }),
        expect.anything()
      )
    })
  })

  it('shows inline error when update fails with duplicate label error code', async () => {
    const { AxiosError: RealAxiosError } = await import('axios')
    const user = userEvent.setup()
    mockDescriptorData = baseTemplateDescriptor

    mockUpdateInstanceLabel.mockImplementation(
      (_payload: unknown, options: { onError: (error: unknown) => void }) => {
        const error = new RealAxiosError('Duplicate')
        error.response = {
          data: { errors: [{ code: DUPLICATE_INSTANCE_LABEL_ERROR_CODE }] },
        } as never
        options.onError(error)
      }
    )

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    const editButton = screen.getByText('actions.edit')
    await user.click(editButton)

    const input = screen.getByRole('textbox', {
      name: 'instanceLabelField.label',
    })
    await user.clear(input)
    await user.type(input, 'Nautica')

    const submitButton = screen.getByRole('button', { name: 'actions.upgrade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('instanceLabelField.validation.duplicate')).toBeInTheDocument()
    })
  })

  it('does NOT show instanceLabel section for non-template e-services', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider({
      state: 'PUBLISHED',
      eservice: {
        name: 'Regular E-Service',
      },
    })
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.queryByText('instanceLabel.label')).not.toBeInTheDocument()
    expect(screen.getByText('eserviceName.label')).toBeInTheDocument()
  })
})
