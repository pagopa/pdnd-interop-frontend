import { mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import ProviderEServiceCreatePage from '../ProviderEServiceCreate.page'
import type { Mock } from 'vitest'
import * as useActiveStepModule from '@/hooks/useActiveStep'

vi.mock('@/hooks/useActiveStep', () => ({
  useActiveStep: vi.fn(() => ({
    activeStep: 0,
    forward: vi.fn(),
    back: vi.fn(),
  })),
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

mockUseParams({})

afterEach(() => {
  vi.clearAllMocks()
})

describe('ProviderEServiceCreatePage', () => {
  it('should render page with stepper', () => {
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 0,
      forward: vi.fn(),
      back: vi.fn(),
    })
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
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 0,
      forward: vi.fn(),
      back: vi.fn(),
    })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepGeneral')).toBeInTheDocument()
  })

  it('should render step 1 - EServiceCreateStepThresholds(DELIVER)', () => {
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 1,
      forward: vi.fn(),
      back: vi.fn(),
    })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepThresholds')).toBeInTheDocument()
  })

  it('should render step 2 - EServiceCreateStepTechSpec(DELIVER)', () => {
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 2,
      forward: vi.fn(),
      back: vi.fn(),
    })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepTechSpec')).toBeInTheDocument()
  })

  it('should render step 3 - EServiceCreateStepInfoVersion(DELIVER)', () => {
    ;(useActiveStepModule.useActiveStep as Mock).mockReturnValue({
      activeStep: 3,
      forward: vi.fn(),
      back: vi.fn(),
    })
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('EServiceCreateStepInfoVersion')).toBeInTheDocument()
  })
})
