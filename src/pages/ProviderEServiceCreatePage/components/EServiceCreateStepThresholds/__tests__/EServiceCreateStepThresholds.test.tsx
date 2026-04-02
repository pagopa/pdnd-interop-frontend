import { renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceCreateStepThresholds } from '../EServiceCreateStepThresholds'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMockEServiceDescriptorProvider,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'
import { useFormContext } from 'react-hook-form'

vi.mock('../../sections/EServiceThresholdSection', () => ({
  EServiceThresholdSection: () => {
    const { register } = useFormContext()
    return (
      <div>
        <div>EServiceThresholdSection</div>
        <input data-testid="daily-calls-total" {...register('dailyCallsTotal')} />
      </div>
    )
  },
}))

vi.mock('../../sections/EServiceAttributesSection', () => ({
  EServiceAttributesSection: () => {
    return <div>EServiceAttributesSection</div>
  },
}))

const updateVersionDraft = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateVersionDraft: () => ({ mutate: updateVersionDraft }),
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

  it('should not call API when form data has not changed', async () => {
    mockUseEServiceCreateContext()
    renderWithApplicationContext(<EServiceCreateStepThresholds {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))
    expect(updateVersionDraft).not.toHaveBeenCalled()
  })

  it('should call updateVersionDraft API when form data has been changed', async () => {
    mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProvider() })
    renderWithApplicationContext(<EServiceCreateStepThresholds {...stepProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await userEvent.type(screen.getByTestId('daily-calls-total'), '10')
    await userEvent.click(screen.getByText('forwardWithSaveBtn'))
    expect(updateVersionDraft).toHaveBeenCalled()
  })
})
