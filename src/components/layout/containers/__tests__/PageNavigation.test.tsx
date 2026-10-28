import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PageNavigation } from '../PageNavigation'

vi.mock('../../Breadcrumbs', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs" />,
}))

describe('PageNavigation', () => {
  it('shows breadcrumbs without a back button by default', () => {
    const screen = renderWithApplicationContext(<PageNavigation />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('leaves a wizard immediately when there are no unsaved changes', async () => {
    const screen = renderWithApplicationContext(
      <PageNavigation
        mode="wizard"
        exitAction={{
          to: 'DEFAULT',
        }}
      />,
      { withRouterContext: true, withDialogContext: true }
    )

    await userEvent.click(
      screen.getByRole('link', {
        name: 'exitButton',
      })
    )

    expect(screen.history.location.pathname).toBe('/it')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('asks for confirmation before leaving a wizard with unsaved changes', async () => {
    const screen = renderWithApplicationContext(
      <PageNavigation
        mode="wizard"
        hasUnsavedChanges
        exitAction={{
          to: 'DEFAULT',
        }}
      />,
      { withRouterContext: true, withDialogContext: true }
    )

    expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument()
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'exitButton',
      })
    ).toHaveClass('MuiButton-colorInherit')

    await userEvent.click(
      screen.getByRole('link', {
        name: 'exitButton',
      })
    )

    expect(screen.history.location.pathname).not.toBe('/it')
    expect(
      screen.getByRole('dialog', {
        name: 'exitDialog.title',
      })
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'exitDialog.cancelButton',
      })
    )

    expect(screen.history.location.pathname).not.toBe('/it')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('link', {
        name: 'exitButton',
      })
    )
    await userEvent.click(
      screen.getByRole('button', {
        name: 'exitDialog.confirmButton',
      })
    )

    expect(screen.history.location.pathname).toBe('/it/')
  })
})
