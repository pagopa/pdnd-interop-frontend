import {
  mockUseParams,
  renderWithApplicationContext,
  mockUseActiveStep,
} from '@/utils/testing.utils'
import { fireEvent, screen } from '@testing-library/react'
import ProviderEServiceCreatePage from '../ProviderEServiceCreate.page'
import { queryOptions } from '@tanstack/react-query'
import type { EServiceCreateContextProviderProps } from '../components/EServiceCreateContext'

vi.mock('../components/EServiceCreateContext', () => ({
  EServiceCreateContextProvider: (props: EServiceCreateContextProviderProps) => {
    return (
      <div>
        {props.children}
        <button
          data-testid="receiver-button"
          onClick={() => props.onEserviceModeChange?.('RECEIVE')}
        ></button>
      </div>
    )
  },
}))

vi.mock('../components/EServiceCreateStepGeneral', () => ({
  EServiceCreateStepGeneral: () => <div>EServiceCreateStepGeneral</div>,
  EServiceCreateStepGeneralSkeleton: () => <div>EServiceCreateStepGeneralSkeleton</div>,
}))

vi.mock('../components/EServiceCreateStepThresholds', () => ({
  EServiceCreateStepThresholds: () => <div>EServiceCreateStepThresholds</div>,
  EServiceCreateStepThresholdsSkeleton: () => <div>EServiceCreateStepThresholdsSkeleton</div>,
}))

vi.mock('../components/EServiceCreateStepTechSpec', () => ({
  EServiceCreateStepTechSpec: () => <div>EServiceCreateStepTechSpec</div>,
  EServiceCreateStepTechSpecSkeleton: () => <div>EServiceCreateStepTechSpecSkeleton</div>,
}))

vi.mock('../components/EServiceCreateStepInfoVersion', () => ({
  EServiceCreateStepInfoVersion: () => <div>EServiceCreateStepInfoVersion</div>,
  EServiceCreateStepInfoVersionSkeleton: () => <div>EServiceCreateStepInfoVersionSkeleton</div>,
}))

vi.mock('../components/EServiceCreateStepPurpose/EServiceCreateStepPurpose', () => ({
  EServiceCreateStepPurpose: () => <div>EServiceCreateStepPurpose</div>,
  EServiceCreateStepPurposeSkeleton: () => <div>EServiceCreateStepPurposeSkeleton</div>,
}))

vi.mock('../components/EServiceCreateStepPurpose/EServiceCreateFromTemplateStepPurpose', () => ({
  EServiceCreateFromTEmplateStepPurpose: () => <div>EServiceCreateFromTemplateStepPurpose</div>,
  EServiceCreateFromTemplateStepPurposeSkeleton: () => (
    <div>EServiceCreateFromTemplateStepPurposeSkeleton</div>
  ),
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingleByEServiceTemplateId: vi.fn((eserviceTemplateId: string) =>
      queryOptions({
        queryKey: ['EServiceTemplateGetSingleByEServiceTemplateId', eserviceTemplateId],
        queryFn: vi.fn(),
      })
    ),
  },
}))

mockUseParams({})

describe('ProviderEServiceCreatePage', () => {
  it('should render page with stepper(DELIVER)', () => {
    mockUseActiveStep()
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('create.stepper.step1Label')).toBeInTheDocument()
    expect(screen.getByText('create.stepper.step2Label')).toBeInTheDocument()
    expect(screen.getByText('create.stepper.step3Label')).toBeInTheDocument()
    expect(screen.getByText('create.stepper.step4Label')).toBeInTheDocument()
  })

  it('should render step 0 - EServiceCreateStepGeneral(DELIVER)', () => {
    mockUseActiveStep()
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepGeneral')).toBeInTheDocument()
  })

  it('should render step 1 - EServiceCreateStepThresholds(DELIVER)', () => {
    mockUseActiveStep({ activeStep: 1 })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepThresholds')).toBeInTheDocument()
  })

  it('should render step 2 - EServiceCreateStepTechSpec(DELIVER)', () => {
    mockUseActiveStep({ activeStep: 2 })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepTechSpec')).toBeInTheDocument()
  })

  it('should render step 3 - EServiceCreateStepInfoVersion(DELIVER)', () => {
    mockUseActiveStep({ activeStep: 3 })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepInfoVersion')).toBeInTheDocument()
  })

  it('should render page with stepper(RECEIVER)', () => {
    mockUseActiveStep()
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    fireEvent.click(screen.getByTestId('receiver-button'))
    expect(screen.getByText('create.stepper.step1Label')).toBeInTheDocument()
    expect(screen.getByText('create.stepper.step2ReceiveLabel')).toBeInTheDocument()
    expect(screen.getByText('create.stepper.step2Label')).toBeInTheDocument()
    expect(screen.getByText('create.stepper.step3Label')).toBeInTheDocument()
    expect(screen.getByText('create.stepper.step4Label')).toBeInTheDocument()
  })

  it('should render step purpose - EServiceCreateStepPurpose(RECEIVER)', () => {
    mockUseActiveStep({ activeStep: 1 })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    fireEvent.click(screen.getByTestId('receiver-button'))
    expect(screen.getByText('EServiceCreateStepPurpose')).toBeInTheDocument()
  })
})
