import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceThresholdSection } from '../EServiceThresholdSection'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  it.each(['dailyCallsPerConsumerField.label', 'dailyCallsTotalField.label'])(
    'should prevent decimal values in the %s field',
    async (label) => {
      const user = userEvent.setup()
      renderComponent()

      const input = screen.getByRole('spinbutton', { name: label })
      await user.type(input, '1.5')

      expect(input).toHaveValue(15)
    }
  )

  it('should render alert with suggested values', () => {
    renderComponent(true)
    expect(screen.getByText('limitsSuggestionAlert.title')).toBeInTheDocument()
    expect(screen.getByText('limitsSuggestionAlert.labelDailyCallsPerConsumer')).toBeInTheDocument()
    expect(screen.getByText('limitsSuggestionAlert.labelDailyTotal')).toBeInTheDocument()
  })
})
