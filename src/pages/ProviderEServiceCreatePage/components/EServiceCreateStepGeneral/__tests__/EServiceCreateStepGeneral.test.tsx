import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { EServiceCreateStepGeneral } from '../EServiceCreateStepGeneral'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import * as ContextModule from '../../EServiceCreateContext'
import * as EServiceModule from '@/api/eservice'
import * as EServiceTemplateModule from '@/api/eserviceTemplate'
import type { EServiceTemplateDetails, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

const mockForward = vi.fn()
const mockCreateDraftFromTemplate = vi.fn()
const mockUpdateDraftFromTemplate = vi.fn()

function mockContext(
  overrides: Partial<ReturnType<typeof ContextModule.useEServiceCreateContext>> = {}
) {
  vi.spyOn(ContextModule, 'useEServiceCreateContext').mockReturnValue({
    descriptor: undefined,
    eserviceMode: 'DELIVER',
    onEserviceModeChange: vi.fn(),
    back: vi.fn(),
    forward: mockForward,
    areEServiceGeneralInfoEditable: true,
    riskAnalysisFormState: { isOpen: false, riskAnalysisId: undefined },
    openRiskAnalysisForm: vi.fn(),
    closeRiskAnalysisForm: vi.fn(),
    eserviceTemplate: undefined,
    ...overrides,
  })
}

const mockEServiceTemplate: EServiceTemplateDetails = {
  id: 'template-id',
  name: 'Credenziale IT-Wallet',
  description: 'Template description',
  technology: 'REST',
  mode: 'DELIVER',
  versions: [{ id: 'v1', state: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z' }],
  creator: { id: 'creator-id', name: 'Creator' },
  isSignalHubEnabled: false,
  personalData: true,
  riskAnalysis: [],
} as unknown as EServiceTemplateDetails

const mockDescriptorFromTemplate: ProducerEServiceDescriptor = {
  id: 'desc-id',
  version: '1',
  state: 'DRAFT',
  audience: [],
  voucherLifespan: 100,
  dailyCallsPerConsumer: 1000,
  dailyCallsTotal: 10000,
  agreementApprovalPolicy: 'AUTOMATIC',
  attributes: { certified: [], declared: [], verified: [] },
  eservice: {
    id: 'eservice-id',
    name: 'Credenziale IT-Wallet - Patente',
    description: 'Eservice description',
    producer: { id: 'producer-id' },
    technology: 'REST',
    mode: 'DELIVER',
    riskAnalysis: [],
    descriptors: [],
    isSignalHubEnabled: false,
    isConsumerDelegable: true,
    isClientAccessDelegable: true,
    personalData: true,
    instanceLabel: 'Patente',
  },
  templateRef: {
    templateId: 'template-id',
    templateName: 'Credenziale IT-Wallet',
  },
} as unknown as ProducerEServiceDescriptor

vi.mock('@/router', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ eServiceTemplateId: 'template-id' }),
}))

vi.mock('@/config/tracking', () => ({
  trackEvent: vi.fn(),
}))

beforeEach(() => {
  mockUseJwt()

  vi.spyOn(EServiceModule.EServiceMutations, 'useUpdateDraft').mockReturnValue({
    mutate: vi.fn(),
  } as never)
  vi.spyOn(EServiceModule.EServiceMutations, 'useCreateDraft').mockReturnValue({
    mutate: vi.fn(),
  } as never)
  vi.spyOn(
    EServiceTemplateModule.EServiceTemplateMutations,
    'useCreateInstanceFromEServiceTemplate'
  ).mockReturnValue({ mutate: mockCreateDraftFromTemplate } as never)
  vi.spyOn(
    EServiceTemplateModule.EServiceTemplateMutations,
    'useUpdateInstanceFromEServiceTemplate'
  ).mockReturnValue({ mutate: mockUpdateDraftFromTemplate } as never)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceCreateStepGeneral - instanceLabel', () => {
  it('does NOT show the instanceLabel section when creating a regular e-service (not from template)', () => {
    mockContext({ eserviceTemplate: undefined, descriptor: undefined })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    expect(screen.queryByText('create.step1.instanceLabelField.title')).not.toBeInTheDocument()
  })

  it('shows the instanceLabel section when creating from a template', () => {
    mockContext({ eserviceTemplate: mockEServiceTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('create.step1.instanceLabelField.title')).toBeInTheDocument()
    expect(screen.getByText('create.step1.instanceLabelField.description')).toBeInTheDocument()
  })

  it('shows the instanceLabel section when editing an existing e-service from template', () => {
    mockContext({ descriptor: mockDescriptorFromTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('create.step1.instanceLabelField.title')).toBeInTheDocument()
  })

  it('pre-fills instanceLabel when editing an existing draft from template', () => {
    mockContext({ descriptor: mockDescriptorFromTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    expect(instanceLabelInput).toHaveValue('Patente')
  })

  it('shows the catalog preview when user types in the instanceLabel field', async () => {
    const user = userEvent.setup()
    mockContext({ eserviceTemplate: mockEServiceTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.type(instanceLabelInput, 'Patente')

    await waitFor(() => {
      expect(screen.getByText('Credenziale IT-Wallet - Patente')).toBeInTheDocument()
    })
  })

  it('does not show the catalog preview when instanceLabel is empty', () => {
    mockContext({ eserviceTemplate: mockEServiceTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    expect(
      screen.queryByText('create.step1.instanceLabelField.catalogPreviewLabel')
    ).not.toBeInTheDocument()
  })

  it('enforces maxLength of 12 characters on the instanceLabel input', () => {
    mockContext({ eserviceTemplate: mockEServiceTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    expect(instanceLabelInput).toHaveAttribute('maxlength', '12')
  })

  it('sends instanceLabel as undefined in the create payload when field is empty (BE assigns default)', async () => {
    const user = userEvent.setup()
    mockContext({ eserviceTemplate: mockEServiceTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateDraftFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ instanceLabel: undefined }),
        expect.anything()
      )
    })
  })

  it('sends instanceLabel as string in the create payload when user types a value', async () => {
    const user = userEvent.setup()
    mockContext({ eserviceTemplate: mockEServiceTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.type(instanceLabelInput, 'Patente')

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateDraftFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ instanceLabel: 'Patente' }),
        expect.anything()
      )
    })
  })

  it('sends instanceLabel as string in the update payload when user types a value', async () => {
    const user = userEvent.setup()
    mockContext({ descriptor: mockDescriptorFromTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.clear(instanceLabelInput)
    await user.type(instanceLabelInput, 'CIE')

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateDraftFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          instanceLabel: 'CIE',
          eServiceId: 'eservice-id',
        }),
        expect.anything()
      )
    })
  })

  it('sends instanceLabel as undefined in the update payload when field is cleared', async () => {
    const user = userEvent.setup()
    mockContext({ descriptor: mockDescriptorFromTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.clear(instanceLabelInput)

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateDraftFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          instanceLabel: undefined,
          eServiceId: 'eservice-id',
        }),
        expect.anything()
      )
    })
  })

  it('shows inline duplicate error when create fails with duplicate label error code', async () => {
    const { AxiosError: RealAxiosError } = await import('axios')
    const user = userEvent.setup()
    mockContext({ eserviceTemplate: mockEServiceTemplate })

    mockCreateDraftFromTemplate.mockImplementation(
      (_payload: unknown, options: { onError: (error: unknown) => void }) => {
        const error = new RealAxiosError('Duplicate')
        error.response = {
          data: { errors: [{ code: 'eServiceNameDuplicateForProducer' }] },
        } as never
        options.onError(error)
      }
    )

    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.type(instanceLabelInput, 'Patente')

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('create.step1.instanceLabelField.validation.duplicate')
      ).toBeInTheDocument()
    })
  })

  it('shows inline empty-not-available error when create fails with duplicate error and field is empty', async () => {
    const { AxiosError: RealAxiosError } = await import('axios')
    const user = userEvent.setup()
    mockContext({ eserviceTemplate: mockEServiceTemplate })

    mockCreateDraftFromTemplate.mockImplementation(
      (_payload: unknown, options: { onError: (error: unknown) => void }) => {
        const error = new RealAxiosError('Duplicate')
        error.response = {
          data: { errors: [{ code: 'eServiceNameDuplicateForProducer' }] },
        } as never
        options.onError(error)
      }
    )

    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
    })

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('create.step1.instanceLabelField.validation.emptyNotAvailable')
      ).toBeInTheDocument()
    })
  })
})
