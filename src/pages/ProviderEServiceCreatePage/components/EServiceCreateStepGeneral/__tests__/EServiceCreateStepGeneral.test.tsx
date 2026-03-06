import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import { createMockEServiceTemplateDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'
import * as ContextModule from '../../EServiceCreateContext'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceCreateStepGeneral } from '../EServiceCreateStepGeneral'
import { screen } from '@testing-library/react'

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

function mockUseEServiceCreateContext(
  overwrites: Partial<ReturnType<typeof ContextModule.useEServiceCreateContext>> = {}
) {
  vi.spyOn(ContextModule, 'useEServiceCreateContext').mockReturnValue({
    descriptor: createMockEServiceDescriptorProvider(),
    areEServiceGeneralInfoEditable: true,
    forward: vi.fn(),
    back: vi.fn(),
    eserviceMode: 'DELIVER',
    onEserviceModeChange: vi.fn(),
    eserviceTemplate: undefined,
    riskAnalysisFormState: {
      isOpen: false,
      riskAnalysisId: undefined,
    },
    openRiskAnalysisForm: vi.fn(),
    closeRiskAnalysisForm: vi.fn(),
    ...overwrites,
  })
}

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateDraft: () => ({ mutate: vi.fn() }),
    useCreateDraft: () => ({ mutate: vi.fn() }),
  },
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useCreateInstanceFromEServiceTemplate: () => ({ mutate: vi.fn() }),
    useUpdateInstanceFromEServiceTemplate: () => ({ mutate: vi.fn() }),
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
    expect(screen.getByText('EServiceDetailsSection')).toBeInTheDocument()
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
})
