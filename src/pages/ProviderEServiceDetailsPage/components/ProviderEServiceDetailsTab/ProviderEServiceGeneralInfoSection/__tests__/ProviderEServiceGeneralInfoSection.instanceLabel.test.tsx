import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ProviderEServiceGeneralInfoSection } from '../ProviderEServiceGeneralInfoSection'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderAsync,
} from '@/../__mocks__/data/eservice.mocks'
import * as EServiceModule from '@/api/eservice'
import * as EServiceTemplateMutationsModule from '@/api/eserviceTemplate/eserviceTemplate.mutations'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import type * as TanStackReactQuery from '@tanstack/react-query'
import { ESERVICE_DESCRIPTION_MAX_LENGTH } from '@/config/constants'

const mockUpdateInstanceLabel = vi.fn()
const mockUpdatePersonalData = vi.fn()
const mockPatchUpdateEServiceById = vi.fn()
const mockDownloadConsumerList = vi.fn()
const mockExportVersion = vi.fn()

vi.mock('@/router', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
  useCurrentRoute: () => ({ mode: 'provider' }),
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

vi.mock('@/config/tracking', () => ({
  trackEvent: vi.fn(),
}))

let mockDescriptorData: ProducerEServiceDescriptor
let mockIsDelegator = false

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: vi.fn(),
  },
  EServiceMutations: {
    useUpdateEServicePersonalDataFlagAfterPublication: vi.fn(),
    usePatchUpdateEServiceById: vi.fn(),
  },
  EServiceDownloads: {
    useDownloadConsumerList: vi.fn(),
    useExportVersion: vi.fn(),
  },
}))

vi.mock('@/api/eserviceTemplate/eserviceTemplate.mutations', () => ({
  EServiceTemplateMutations: {
    useUpdateInstanceLabelAfterPublication: vi.fn(),
  },
  DUPLICATE_ESERVICENAME_ERROR_CODE: '007',
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof TanStackReactQuery>()),
  useSuspenseQuery: () => ({ data: mockDescriptorData }),
  useQuery: () => ({ data: [] }),
}))

vi.mock('@/hooks/useGetProducerDelegationUserRole', () => ({
  useGetProducerDelegationUserRole: () => ({
    isDelegate: false,
    isDelegator: mockIsDelegator,
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
  mockIsDelegator = false
  mockPatchUpdateEServiceById.mockReset()

  vi.mocked(
    EServiceModule.EServiceMutations.useUpdateEServicePersonalDataFlagAfterPublication
  ).mockReturnValue({
    mutate: mockUpdatePersonalData,
  } as never)
  vi.mocked(EServiceModule.EServiceMutations.usePatchUpdateEServiceById).mockReturnValue({
    mutate: mockPatchUpdateEServiceById,
  } as never)
  vi.mocked(EServiceModule.EServiceDownloads.useDownloadConsumerList).mockReturnValue(
    mockDownloadConsumerList as never
  )
  vi.mocked(EServiceModule.EServiceDownloads.useExportVersion).mockReturnValue(
    mockExportVersion as never
  )
  vi.mocked(
    EServiceTemplateMutationsModule.EServiceTemplateMutations.useUpdateInstanceLabelAfterPublication
  ).mockReturnValue({ mutate: mockUpdateInstanceLabel } as never)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('ProviderEServiceGeneralInfoSection', () => {
  it.each([
    {
      name: 'Updated e-service',
      description: 'Example e-service description',
      payload: { name: 'Updated e-service' },
    },
    {
      name: 'Example e-service',
      description: 'Updated e-service description',
      payload: { description: 'Updated e-service description' },
    },
    {
      name: 'Updated e-service',
      description: 'Updated e-service description',
      payload: { name: 'Updated e-service', description: 'Updated e-service description' },
    },
  ])('PATCHes only metadata fields that changed', async ({ name, description, payload }) => {
    const user = userEvent.setup()
    mockDescriptorData = createMockEServiceDescriptorProvider({
      templateRef: undefined,
      eservice: {
        name: 'Example e-service',
        description: 'Example e-service description',
        personalData: false,
      },
    })
    mockPatchUpdateEServiceById.mockImplementation(
      (_payload: unknown, options: { onSuccess: () => void }) => options.onSuccess()
    )
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'actions.edit' }))
    const nameInput = screen.getByRole('textbox', {
      name: 'updateMetadataDrawer.nameField.label',
    })
    if (name !== 'Example e-service') {
      await user.clear(nameInput)
      await user.type(nameInput, name)
    }
    if (description !== 'Example e-service description') {
      const descriptionInput = screen.getByRole('textbox', {
        name: 'updateMetadataDrawer.descriptionField.label',
      })
      await user.clear(descriptionInput)
      await user.type(descriptionInput, description)
    }
    await user.click(screen.getByRole('button', { name: 'actions.saveEdits' }))

    await waitFor(() => {
      expect(mockPatchUpdateEServiceById).toHaveBeenCalledWith(
        {
          eserviceId: mockDescriptorData.eservice.id,
          ...payload,
        },
        { onSuccess: expect.any(Function) }
      )
    })
    await waitForElementToBeRemoved(nameInput)
  })

  it('closes the drawer without PATCHing when metadata is unchanged', async () => {
    const user = userEvent.setup()
    mockDescriptorData = createMockEServiceDescriptorProvider({
      templateRef: undefined,
      eservice: {
        name: 'Example e-service',
        description: 'Example e-service description',
        personalData: false,
      },
    })
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'actions.edit' }))
    const nameInput = screen.getByRole('textbox', {
      name: 'updateMetadataDrawer.nameField.label',
    })
    const saveButton = screen.getByRole('button', { name: 'actions.saveEdits' })
    expect(saveButton).toBeEnabled()
    await user.click(saveButton)

    expect(mockPatchUpdateEServiceById).not.toHaveBeenCalled()
    await waitForElementToBeRemoved(nameInput)
  })

  it('keeps metadata visible without an edit action for a delegating organization administrator', () => {
    mockUseJwt({ isAdmin: true })
    mockIsDelegator = true
    mockDescriptorData = createMockEServiceDescriptorProvider({
      templateRef: undefined,
      eservice: {
        name: 'Example e-service',
        description: 'Example e-service description',
        personalData: false,
      },
    })
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.queryByRole('button', { name: 'actions.edit' })).not.toBeInTheDocument()
    expect(screen.getByText('Example e-service')).toBeVisible()
    expect(screen.getByText('Example e-service description')).toBeVisible()
  })

  it('opens the metadata drawer with current values for a standalone e-service administrator', async () => {
    const user = userEvent.setup()
    mockDescriptorData = createMockEServiceDescriptorProvider({
      templateRef: undefined,
      eservice: {
        name: 'Example e-service',
        description: 'Example e-service description',
        personalData: false,
      },
    })
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByRole('heading', { name: 'nameAndDescription.title' })).toBeVisible()
    expect(screen.getByText('Example e-service')).toBeVisible()
    expect(screen.getByText('Example e-service description')).toBeVisible()
    expect(screen.getAllByRole('button', { name: 'actions.edit' })).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'actions.edit' }))

    expect(screen.getByText('updateMetadataDrawer.title')).toBeVisible()
    expect(screen.getByText('updateMetadataDrawer.description')).toBeVisible()
    expect(
      screen.getByRole('textbox', { name: 'updateMetadataDrawer.nameField.label' })
    ).toHaveValue(mockDescriptorData.eservice.name)
    const descriptionInput = screen.getByRole('textbox', {
      name: 'updateMetadataDrawer.descriptionField.label',
    })
    expect(descriptionInput).toHaveValue(mockDescriptorData.eservice.description)
    expect(descriptionInput).toHaveAttribute('maxlength', String(ESERVICE_DESCRIPTION_MAX_LENGTH))

    await user.click(screen.getByRole('button', { name: 'closeIconAriaLabel' }))

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })

  it.each(['viewer', 'operatorAPI'] as const)(
    'keeps metadata visible without an edit action for a non-admin %s',
    (role) => {
      mockUseJwt({
        isAdmin: false,
        isViewer: role === 'viewer',
        isOperatorAPI: role === 'operatorAPI',
      })
      mockDescriptorData = createMockEServiceDescriptorProvider({
        templateRef: undefined,
        eservice: {
          name: 'Example e-service',
          description: 'Example e-service description',
          personalData: false,
        },
      })
      renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
        withReactQueryContext: true,
      })

      expect(screen.queryByRole('button', { name: 'actions.edit' })).not.toBeInTheDocument()
      expect(screen.getByText('Example e-service')).toBeVisible()
      expect(screen.getByText('Example e-service description')).toBeVisible()
    }
  )

  it('renders exchange type for synchronous e-services', () => {
    mockDescriptorData = createMockEServiceDescriptorProvider()
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('exchangeType.label')).toBeInTheDocument()
    expect(screen.getByText('exchangeType.value.sync')).toBeInTheDocument()
  })

  it('renders exchange type for asynchronous e-services', () => {
    mockDescriptorData = createMockEServiceDescriptorProviderAsync()
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('exchangeType.label')).toBeInTheDocument()
    expect(screen.getByText('exchangeType.value.async')).toBeInTheDocument()
  })

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

  it('does NOT show the edit button for instanceLabel for a viewer', () => {
    mockUseJwt({ isAdmin: false, isViewer: true })
    mockDescriptorData = baseTemplateDescriptor
    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('instanceLabel.label')).toBeInTheDocument()
    expect(screen.queryByText('actions.edit')).not.toBeInTheDocument()
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
      expect(screen.getByRole('heading', { level: 6, name: 'title' })).toBeInTheDocument()
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
          data: {
            errors: [{ code: EServiceTemplateMutationsModule.DUPLICATE_ESERVICENAME_ERROR_CODE }],
          },
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
      expect(
        screen.getByText('updateInstanceLabelDrawer.instanceLabelField.validation.duplicate')
      ).toBeInTheDocument()
    })
  })

  it('shows emptyNotAvailable error when update fails with empty instanceLabel', async () => {
    const { AxiosError: RealAxiosError } = await import('axios')
    const user = userEvent.setup()
    mockDescriptorData = baseTemplateDescriptor

    mockUpdateInstanceLabel.mockImplementation(
      (_payload: unknown, options: { onError: (error: unknown) => void }) => {
        const error = new RealAxiosError('Duplicate')
        error.response = {
          data: {
            errors: [{ code: EServiceTemplateMutationsModule.DUPLICATE_ESERVICENAME_ERROR_CODE }],
          },
        } as never
        options.onError(error)
      }
    )

    renderWithApplicationContext(<ProviderEServiceGeneralInfoSection />, {
      withReactQueryContext: true,
    })

    const editButton = screen.getByText('actions.edit')
    await user.click(editButton)

    // Clear the field to submit with empty instanceLabel
    const input = screen.getByRole('textbox', {
      name: 'instanceLabelField.label',
    })
    await user.clear(input)

    const submitButton = screen.getByRole('button', { name: 'actions.upgrade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'updateInstanceLabelDrawer.instanceLabelField.validation.emptyNotAvailable'
        )
      ).toBeInTheDocument()
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
