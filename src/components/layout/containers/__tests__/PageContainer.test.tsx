import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PageContainer } from '../PageContainer'

describe('PageContainer', () => {
  it('marks a wizard as having unsaved changes when a form field changes', async () => {
    const screen = renderWithApplicationContext(
      <PageContainer
        navigation={{
          mode: 'wizard',
          exitAction: { to: 'DEFAULT' },
        }}
      >
        <label htmlFor="wizard-field">Wizard field</label>
        <input id="wizard-field" />
      </PageContainer>,
      {
        withRouterContext: true,
        withDialogContext: true,
      }
    )

    await userEvent.type(screen.getByLabelText('Wizard field'), 'Changed value')
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(
      screen.getByRole('dialog', {
        name: 'exitDialog.title',
      })
    ).toBeInTheDocument()
  })
})
