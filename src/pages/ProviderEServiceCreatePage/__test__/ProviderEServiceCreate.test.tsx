import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ProviderEServiceCreatePage from '../ProviderEServiceCreate.page'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

mockUseJwt()

describe('Provider E-service create page', () => {
  it('Should be visible section', () => {
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.getByText('create.step1.detailsTitle'))
    expect(screen.getByText('create.step1.delegationSection.title'))
    expect(screen.getByText('create.step1.isSignalHubEnabled.title'))
  })

  it('Should navigate steps', () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const nameInput = screen.getByLabelText(/eserviceNameField/i)
    user.type(nameInput, 'My test eservice')

    const descriptionInput = screen.getByLabelText(/eserviceTechnologyField/i)
    user.type(descriptionInput, 'This is a test description for the eservice')

    // const noPersonalDataRadio = screen.getByLabelText(/eservicePersonalDataField.*.option.false/i)
    // user.click(noPersonalDataRadio)
    //
    // expect(noPersonalDataRadio).toBeChecked()

    const nextButton = screen.getByText(/forwardWithSaveBtn/i)

    user.click(nextButton)

    waitFor(() => {
      expect(screen.getByText(/step2.thresholdSection.title/i)).toBeInTheDocument()

      const dailyCallsPerConsumerInput = screen.getByLabelText(/dailyCallsPerConsumerField/i)
      user.type(dailyCallsPerConsumerInput, '20')

      const dailyCallsTotalInput = screen.getByLabelText(/dailyCallsTotalField/i)
      user.type(dailyCallsTotalInput, '20')

      user.click(nextButton)

      waitFor(() => {
        expect(screen.getByText(/step3/i)).toBeInTheDocument()
      })
    })
  })
})
