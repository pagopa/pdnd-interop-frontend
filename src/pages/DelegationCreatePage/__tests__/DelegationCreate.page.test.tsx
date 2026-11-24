import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { DelegationCreatePage } from '../DelegationCreate.page'

describe('DelegationCreatePage', () => {
  it('asks for confirmation when exiting after selecting a delegation kind', async () => {
    const screen = renderWithApplicationContext(<DelegationCreatePage />, {
      withRouterContext: true,
      withDialogContext: true,
    })

    await userEvent.click(
      screen.getByRole('radio', {
        name: /delegations\.create\.cards\.consumer/,
      })
    )
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(
      screen.getByRole('dialog', {
        name: 'exitDialog.title',
      })
    ).toBeInTheDocument()
  })
})
