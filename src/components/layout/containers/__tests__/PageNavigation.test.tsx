import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PageNavigation } from '../PageNavigation'
import { PageContainer } from '../PageContainer'
import { Dialog } from '@/components/dialogs'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import type { PageExitAction, PageNavigationProps } from '../PageNavigation'
import { createMemoryHistory } from 'history'
import { expectTypeOf } from 'vitest'

vi.mock('../../Breadcrumbs', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs" />,
}))

describe('PageNavigation', () => {
  it('only supports breadcrumbs and fixed-destination wizard navigation', () => {
    expectTypeOf<PageNavigationProps['mode']>().toEqualTypeOf<
      'breadcrumbs' | 'wizard' | undefined
    >()
  })

  it.each([
    ['SUBSCRIBE_PURPOSE_LIST', '/it/fruizione/finalita'],
    ['PROVIDE_ESERVICE_LIST', '/it/erogazione/e-service'],
    ['SUBSCRIBE_PURPOSE_TEMPLATE_LIST', '/it/fruizione/template-finalita'],
    ['PROVIDE_ESERVICE_TEMPLATE_LIST', '/it/erogazione/template-eservice'],
    ['SUBSCRIBE_RISK_ANALYSIS_LIST', '/it/analisi-del-rischio'],
  ] as const)(
    'exits to the fixed %s list instead of the previous history entry',
    async (to, pathname) => {
      const history = createMemoryHistory({
        initialEntries: ['/unrelated-detail?tab=history#review', '/summary'],
      })
      const screen = renderWithApplicationContext(
        <SupportActionGuardProvider isSupport>
          <PageNavigation mode="wizard" exitAction={{ to }} />
          <Dialog />
        </SupportActionGuardProvider>,
        { withRouterContext: true },
        history
      )

      expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'actions.back' })).not.toBeInTheDocument()
      const exitLink = screen.getByRole('link', { name: 'exitButton' })
      expect(exitLink).toHaveAttribute('href', pathname)

      await userEvent.click(exitLink)

      expect(history.index).toBe(2)
      expect(history.location).toMatchObject({
        pathname,
        search: '',
        hash: '',
      })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    }
  )

  const supportExitAction: PageExitAction = {
    to: 'PROVIDE_ESERVICE_MANAGE',
    params: { eserviceId: 'service-id', descriptorId: 'descriptor-id' },
    urlParams: { tab: 'riskAnalysis', search: 'some value' },
  }

  function renderSupportWizard() {
    return renderWithApplicationContext(
      <SupportActionGuardProvider isSupport>
        <PageContainer navigation={{ mode: 'wizard', exitAction: supportExitAction }}>
          <label htmlFor="support-wizard-field">Wizard field</label>
          <input id="support-wizard-field" defaultValue="Initial value" />
        </PageContainer>
        <Dialog />
      </SupportActionGuardProvider>,
      { withRouterContext: true },
      createMemoryHistory({ initialEntries: ['/test?step=riskAnalysis'] })
    )
  }

  it('allows support to leave a clean wizard immediately with all destination parameters', async () => {
    const screen = renderSupportWizard()
    const exitLink = screen.getByRole('link', { name: 'exitButton' })
    const destination = new URL(exitLink.getAttribute('href')!, 'http://localhost')

    await userEvent.click(exitLink)

    expect(screen.history.location.pathname).toBe(destination.pathname)
    expect(screen.history.location.pathname).toContain('/service-id/descriptor-id')
    expect(new URLSearchParams(screen.history.location.search)).toEqual(
      new URLSearchParams(supportExitAction.urlParams)
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('allows support to confirm a dirty Exit and preserves the exact destination parameters', async () => {
    const user = userEvent.setup()
    const screen = renderSupportWizard()
    const initialLocation = screen.history.location

    await user.type(screen.getByLabelText('Wizard field'), ' changed')
    const exitLink = screen.getByRole('link', { name: 'exitButton' })
    const destination = new URL(exitLink.getAttribute('href')!, 'http://localhost')
    await user.click(exitLink)

    expect(screen.history.location).toBe(initialLocation)
    const confirmButton = screen.getByRole('button', { name: 'exitDialog.confirmButton' })
    expect(confirmButton).toBeEnabled()
    await user.click(confirmButton)

    expect(screen.history.location.pathname).toBe(destination.pathname)
    expect(screen.history.location.pathname).toContain('/service-id/descriptor-id')
    expect(new URLSearchParams(screen.history.location.search)).toEqual(
      new URLSearchParams(supportExitAction.urlParams)
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps support in the dirty wizard without changing field values when Exit is cancelled', async () => {
    const user = userEvent.setup()
    const screen = renderSupportWizard()
    const initialLocation = screen.history.location

    await user.type(screen.getByLabelText('Wizard field'), ' changed')
    await user.click(screen.getByRole('link', { name: 'exitButton' }))
    await user.click(screen.getByRole('button', { name: 'exitDialog.cancelButton' }))

    expect(screen.history.location).toBe(initialLocation)
    expect(screen.getByLabelText('Wizard field')).toHaveValue('Initial value changed')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'exitButton' }))
    expect(screen.getByRole('dialog', { name: 'exitDialog.title' })).toBeVisible()
    expect(screen.history.location).toBe(initialLocation)
  })

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
