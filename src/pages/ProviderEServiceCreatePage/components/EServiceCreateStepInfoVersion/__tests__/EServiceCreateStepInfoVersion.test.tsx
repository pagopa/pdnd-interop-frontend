import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderWithTemplateRef,
} from '@/../__mocks__/data/eservice.mocks'
import * as ContextModule from '../../EServiceCreateContext'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { EServiceCreateStepInfoVersion } from '../EServiceCreateStepInfoVersion'

vi.mock('../components/UploadDocumentsSection', () => ({
  UploadDocumentsSection: () => {
    return <div>UploadDocumentsSection</div>
  },
}))

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
    useUpdateVersionDraft: () => ({ mutate: vi.fn() }),
    useUpdateInstanceVersionDraft: () => ({ mutate: vi.fn() }),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceCreateStepInfoVersion', () => {
  it('should render three sections', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('step4.descriptionSection.title')).toBeInTheDocument()
    expect(screen.getByText('step4.documentationSection.title')).toBeInTheDocument()
    expect(screen.getByText('step4.requestManagementSection.title')).toBeInTheDocument()
  })

  it('should render description section input field', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getAllByText('step4.descriptionSection.field.label').length).toBeGreaterThan(0)
  })

  it('should render read-only description when creating instance', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('step4.descriptionSection.readOnlyLabel')).toBeInTheDocument()
  })

  it('should render UploadDocumentsSection', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('UploadDocumentsSection')).toBeInTheDocument()
  })

  it('should render request management switch', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(
      screen.getAllByText('step4.requestManagementSection.field.label').length
    ).toBeGreaterThan(0)
  })

  it('should render step actions', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepInfoVersion />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('backWithoutSaveBtn')).toBeInTheDocument()
    expect(screen.getByText('goToSummary')).toBeInTheDocument()
  })
})
