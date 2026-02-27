import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceThresholdSection } from '../EServiceThresholdSection'
import { screen } from '@testing-library/react'

const renderComponent = (isEServiceCreatedFromTemplate?: boolean) => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper>
      <EServiceThresholdSection
        limitsSuggestions={
          isEServiceCreatedFromTemplate
            ? {
                dailyCallsPerConsumer: 10,
                dailyCallsTotal: 100,
              }
            : undefined
        }
      />
    </ReactHookFormWrapper>,
    {
      withReactQueryContext: false,
      withRouterContext: false,
    }
  )
}

describe('EServiceThresholdSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 2 input field (dailyCallsPerConsumer, dailyCallsTotal)', () => {
    renderComponent()
    expect(screen.getAllByText('dailyCallsPerConsumerField.label').length).toBeGreaterThan(0)
    expect(screen.getAllByText('dailyCallsTotalField.label').length).toBeGreaterThan(0)
  })

  it('should render alert with suggested values', () => {
    renderComponent(true)
    expect(screen.getByText('limitsSuggestionAlert.title')).toBeInTheDocument()
    expect(screen.getByText('limitsSuggestionAlert.labelDailyCallsPerConsumer')).toBeInTheDocument()
    expect(screen.getByText('limitsSuggestionAlert.labelDailyTotal')).toBeInTheDocument()
  })
})
