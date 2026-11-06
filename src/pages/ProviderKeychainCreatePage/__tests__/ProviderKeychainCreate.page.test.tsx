import userEvent from '@testing-library/user-event'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ProviderKeychainCreatePage from '../ProviderKeychainCreate.page'

describe('ProviderKeychainCreatePage', () => {
  it('asks for confirmation when exiting with unsaved form changes', async () => {
    mockUseJwt()

    const screen = renderWithApplicationContext(<ProviderKeychainCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
      withDialogContext: true,
    })

    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'create.nameField.label',
      }),
      'Test keychain'
    )
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(
      screen.getByRole('dialog', {
        name: 'exitDialog.title',
      })
    ).toBeInTheDocument()
  })
})
