import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PageNavigation } from '../PageNavigation'

vi.mock('../../Breadcrumbs', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs" />,
}))

describe('PageNavigation', () => {
  it('shows breadcrumbs by default', () => {
    const screen = renderWithApplicationContext(<PageNavigation />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
  })

  it('navigates to the previous browser history entry from the back button', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/previous', '/test'],
      initialIndex: 1,
    })
    const screen = renderWithApplicationContext(
      <PageNavigation showBackButton />,
      { withRouterContext: true },
      history
    )

    await userEvent.click(
      screen.getByRole('button', {
        name: 'backButton',
      })
    )

    expect(history.location.pathname).toBe('/previous')
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
  })

  it('shows only the back button in back mode', () => {
    const screen = renderWithApplicationContext(<PageNavigation mode="back" />, {
      withRouterContext: true,
    })

    expect(
      screen.getByRole('button', {
        name: 'backButton',
      })
    ).toBeInTheDocument()
    expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument()
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

    expect(screen.history.location.pathname).toBe('/it/')
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

    await userEvent.click(
      screen.getByRole('link', {
        name: 'exitButton',
      })
    )

    expect(screen.history.location.pathname).not.toBe('/it/')
    expect(
      screen.getByRole('dialog', {
        name: 'exitDialog.title',
      })
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'cancel',
      })
    )

    expect(screen.history.location.pathname).not.toBe('/it/')
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
