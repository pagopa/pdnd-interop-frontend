import { renderWithApplicationContext, mockUseEServiceCreateContext } from '@/utils/testing.utils'
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

  it('should render step actions', () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepThresholds {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('backWithoutSaveBtn')).toBeInTheDocument()
    expect(screen.getByText('forwardWithSaveBtn')).toBeInTheDocument()
  })
})
