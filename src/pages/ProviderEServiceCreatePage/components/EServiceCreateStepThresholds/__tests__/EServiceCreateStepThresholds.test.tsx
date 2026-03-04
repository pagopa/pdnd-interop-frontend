import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import * as ContextModule from '../../EServiceCreateContext'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceCreateStepThresholds } from '../EServiceCreateStepThresholds'
import { screen } from '@testing-library/react'

vi.mock('../../sections/EServiceThresholdSection', () => ({
  EServiceThresholdSection: () => {
    return <div>EServiceThresholdSection</div>
  },
}))

vi.mock('../../sections/EServiceAttributesSection', () => ({
  EServiceAttributesSection: () => {
    return <div>EServiceAttributesSection</div>
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
  },
}))

const stepProps = { back: vi.fn(), forward: vi.fn(), activeStep: 2 }

describe('EServiceCreateStepThresholds', () => {
  it('should render two sections', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepThresholds {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('EServiceThresholdSection')).toBeInTheDocument()
    expect(screen.getByText('EServiceAttributesSection')).toBeInTheDocument()
  })
})
