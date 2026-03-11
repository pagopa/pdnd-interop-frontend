import { createMockEServiceTemplateDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderWithTemplateRef,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceCreateStepGeneral } from '../EServiceCreateStepGeneral'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
    expect(screen.getByText('create.forwardWithoutSaveBtn')).toBeInTheDocument()
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
