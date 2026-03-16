import { createMockEServiceTemplateDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderWithTemplateRef,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceCreateStepGeneral } from '../EServiceCreateStepGeneral'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DUPLICATE_ESERVICENAME_ERROR_CODE } from '@/api/eserviceTemplate/eserviceTemplate.mutations'

vi.mock('../../sections/EServiceInfoSection', () => ({
  EServiceInfoSection: () => {
    return <div>EServiceInfoSection</div>
  },
}))

vi.mock('../../sections/EServiceDetailsSection', () => ({
  EServiceDetailsSection: () => {
    return <div>EServiceDetailsSection</div>
  },
}))

vi.mock('../../sections/EServiceTemplateInfoSection', () => ({
  EServiceTemplateInfoSection: () => {
    return <div>EServiceTemplateInfoSection</div>
  },
}))

vi.mock('../../sections/EServiceTemplateDetailsSection', () => ({
  EServiceTemplateDetailsSection: () => {
    return <div>EServiceTemplateDetailsSection</div>
  },
}))

vi.mock('../../sections/DelegationSection', () => ({
  DelegationSection: () => {
    return <div>DelegationSection</div>
  },
}))

vi.mock('../../sections/SignalHubSection', () => ({
  SignalHubSection: () => {
    return <div>SignalHubSection</div>
  },
}))

mockUseParams({
  eServiceTemplateId: 'template-id',
})

mockUseJwt()

const updateDraft = vi.fn()
const createDraft = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateDraft: () => ({ mutate: updateDraft }),
    useCreateDraft: () => ({ mutate: createDraft }),
  },
}))

const createDraftFromTemplate = vi.fn()
const updateDraftFromTemplate = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useCreateInstanceFromEServiceTemplate: () => ({ mutate: createDraftFromTemplate }),
    useUpdateInstanceFromEServiceTemplate: () => ({ mutate: updateDraftFromTemplate }),
  },
  DUPLICATE_ESERVICENAME_ERROR_CODE: '001-007',
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceCreateStepGeneral', () => {
  it('should render four sections when template is undefined', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceInfoSection')).toBeInTheDocument()
    expect(screen.getByText('EServiceDetailsSection')).toBeInTheDocument()
    expect(screen.getByText('DelegationSection')).toBeInTheDocument()
    expect(screen.getByText('SignalHubSection')).toBeInTheDocument()
  })

  it('should render four sections when creating an instance from template', () => {
    mockUseEServiceCreateContext({ eserviceTemplate: createMockEServiceTemplateDetails() })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceTemplateInfoSection')).toBeInTheDocument()
    expect(screen.getByText('EServiceTemplateDetailsSection')).toBeInTheDocument()
    expect(screen.getByText('DelegationSection')).toBeInTheDocument()
    expect(screen.getByText('SignalHubSection')).toBeInTheDocument()
  })

  it('should render step actions with editable info', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('create.forwardWithSaveBtn')).toBeInTheDocument()
  })

  it('should render step actions w/o editable info', () => {
    mockUseEServiceCreateContext({
      areEServiceGeneralInfoEditable: false,
    })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('create.forwardWithSaveBtn')).toBeInTheDocument()
  })

  it('should call createDraft on submit when user is creating e-service not coming from e-service template', async () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await userEvent.click(screen.getByText('create.forwardWithSaveBtn'))

    expect(createDraft).toHaveBeenCalled()
    expect(updateDraft).not.toHaveBeenCalled()
    expect(createDraftFromTemplate).not.toHaveBeenCalled()
    expect(updateDraftFromTemplate).not.toHaveBeenCalled()
  })

  it('should call updateDraft on submit when e-service already exist', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await userEvent.click(screen.getByText('create.forwardWithSaveBtn'))

    expect(createDraft).not.toHaveBeenCalled()
    expect(updateDraft).toHaveBeenCalled()
    expect(createDraftFromTemplate).not.toHaveBeenCalled()
    expect(updateDraftFromTemplate).not.toHaveBeenCalled()
  })

  it('should call createDraftFromTemplate on submit when e-service coming from e-service template', async () => {
    mockUseEServiceCreateContext({ eserviceTemplate: createMockEServiceTemplateDetails() })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await userEvent.click(screen.getByText('create.forwardWithSaveBtn'))

    expect(createDraft).not.toHaveBeenCalled()
    expect(updateDraft).not.toHaveBeenCalled()
    expect(createDraftFromTemplate).toHaveBeenCalled()
    expect(updateDraftFromTemplate).not.toHaveBeenCalled()
  })

  it('should call updateDraftFromTemplate  when e-service already exist (coming from e-service template)', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await userEvent.click(screen.getByText('create.forwardWithSaveBtn'))

    expect(createDraft).not.toHaveBeenCalled()
    expect(updateDraft).not.toHaveBeenCalled()
    expect(createDraftFromTemplate).not.toHaveBeenCalled()
    expect(updateDraftFromTemplate).toHaveBeenCalled()
  })
})

describe('EServiceCreateStepGeneral - instanceLabel', () => {
  it('does NOT show the instanceLabel section when creating a regular e-service (not from template)', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByText('create.step1.instanceLabelField.title')).not.toBeInTheDocument()
  })

  it('shows the instanceLabel section when creating from a template', () => {
    mockUseEServiceCreateContext({ eserviceTemplate: createMockEServiceTemplateDetails() })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('create.step1.instanceLabelField.title')).toBeInTheDocument()
    expect(screen.getByText('create.step1.instanceLabelField.description')).toBeInTheDocument()
  })

  it('shows the instanceLabel section when editing an existing e-service from template', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('create.step1.instanceLabelField.title')).toBeInTheDocument()
  })

  it('shows the catalog preview when user types in the instanceLabel field', async () => {
    const user = userEvent.setup()
    const mockTemplate = createMockEServiceTemplateDetails()
    mockUseEServiceCreateContext({ eserviceTemplate: mockTemplate })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.type(instanceLabelInput, 'Patente')

    await waitFor(() => {
      expect(screen.getByText(`${mockTemplate.name} - Patente`)).toBeInTheDocument()
    })
  })

  it('sends instanceLabel as undefined in the create payload when field is empty (BE assigns default)', async () => {
    const user = userEvent.setup()
    mockUseEServiceCreateContext({ eserviceTemplate: createMockEServiceTemplateDetails() })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(createDraftFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ instanceLabel: undefined }),
        expect.anything()
      )
    })
  })

  it('sends instanceLabel as string in the create payload when user types a value', async () => {
    const user = userEvent.setup()
    mockUseEServiceCreateContext({ eserviceTemplate: createMockEServiceTemplateDetails() })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    await user.type(instanceLabelInput, 'Patente')

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(createDraftFromTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ instanceLabel: 'Patente' }),
        expect.anything()
      )
    })
  })

  it('shows inline duplicate error when create fails with duplicate label error code', async () => {
    const { AxiosError: RealAxiosError } = await import('axios')
    const user = userEvent.setup()
    mockUseEServiceCreateContext({ eserviceTemplate: createMockEServiceTemplateDetails() })

    createDraftFromTemplate.mockImplementation(
      (_payload: unknown, options: { onError: (error: unknown) => void }) => {
        const error = new RealAxiosError('Duplicate')
        error.response = {
          data: { errors: [{ code: DUPLICATE_ESERVICENAME_ERROR_CODE }] },
        } as never
        options.onError(error)
      }
    )

    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
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

  it('disables instanceLabel input when editing a version > 1', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef({ version: '2' }),
    })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    expect(instanceLabelInput).toBeDisabled()
  })

  it('keeps instanceLabel input enabled when editing version 1', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef({ version: '1' }),
    })
    renderWithApplicationContext(<EServiceCreateStepGeneral />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const instanceLabelInput = screen.getByRole('textbox', {
      name: 'create.step1.instanceLabelField.label',
    })
    expect(instanceLabelInput).not.toBeDisabled()
  })
})
