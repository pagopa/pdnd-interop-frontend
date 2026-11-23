import {
  mockUseGetActiveUserParty,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { PartyContactsSection } from '../components'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TenantServices } from '@/api/tenant/tenant.services'
import { NotificationServices } from '@/api/notification/notification.services'
import { UpdatePartyMailDrawer } from '../components/PartyContactsSection/UpdatePartyMailDrawer'
import type { ComponentProps } from 'react'

mockUseGetActiveUserParty({
  data: {
    contactMail: {
      address: 'test@mail.com',
      description: 'email-test',
    },
  },
})

describe('PartyContactsSection', () => {
  mockUseJwt({ currentRoles: ['admin'], isAdmin: true })

  it('should render PartyContactsSection correctly', () => {
    renderWithApplicationContext(<PartyContactsSection />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(screen).toBeDefined()
  })
  it('should render email address', () => {
    renderWithApplicationContext(<PartyContactsSection />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.getByText('test@mail.com')).toBeInTheDocument()
  })

  describe('ADMIN user', () => {
    it('should render edit button', () => {
      mockUseJwt({ currentRoles: ['admin'], isAdmin: true })

      renderWithApplicationContext(<PartyContactsSection />, {
        withRouterContext: true,
        withReactQueryContext: true,
      })
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    })
  })

  describe('NOT-ADMIN user', () => {
    it('should not render edit button', () => {
      mockUseJwt({ currentRoles: ['api'], isAdmin: false })

      renderWithApplicationContext(<PartyContactsSection />, {
        withRouterContext: true,
        withReactQueryContext: true,
      })
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    })
  })
})

describe('UpdatePartyMailDrawer', () => {
  const serverEmail = { address: 'original@example.com', description: 'Original description' }
  const typedEmail = 'updated@example.com'
  const typedDescription = 'Updated description'
  const response = { data: undefined } as Awaited<ReturnType<typeof TenantServices.updateMail>>

  function deferred() {
    let resolve!: () => void
    let reject!: (error: Error) => void
    const promise = new Promise<void>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise
      reject = rejectPromise
    })
    return { promise, resolve, reject }
  }

  function renderDrawer(overrides: Partial<ComponentProps<typeof UpdatePartyMailDrawer>> = {}) {
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
    const props = {
      isOpen: true,
      onClose: vi.fn(),
      email: serverEmail,
      enabledTenantNotificationConfigEmail: false,
      ...overrides,
    }
    const drawer = (nextProps: typeof props) => (
      <QueryClientProvider client={client}>
        <UpdatePartyMailDrawer {...nextProps} />
      </QueryClientProvider>
    )
    const result = renderWithApplicationContext(drawer(props), {})
    return {
      ...result,
      props,
      rerenderDrawer: (nextProps: Partial<typeof props>) =>
        result.rerender(drawer({ ...props, ...nextProps })),
    }
  }

  beforeEach(() => {
    mockUseJwt({ currentRoles: ['admin'], isAdmin: true })
    vi.spyOn(TenantServices, 'updateMail').mockResolvedValue(response)
    vi.spyOn(NotificationServices, 'updateTenantNotificationConfigs').mockResolvedValue(response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not save or close when the form is unchanged', async () => {
    const user = userEvent.setup()
    const { props } = renderDrawer()
    await user.click(screen.getByRole('button', { name: 'actions.upgrade' }))

    expect(TenantServices.updateMail).not.toHaveBeenCalled()
    expect(NotificationServices.updateTenantNotificationConfigs).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
  })

  it('does not send an update without an authenticated organization', async () => {
    mockUseJwt({ jwt: undefined })
    const user = userEvent.setup()
    const { props } = renderDrawer()
    const emailInput = screen.getByRole('textbox', { name: 'drawer.mailField.label' })
    await user.clear(emailInput)
    await user.type(emailInput, typedEmail)
    await user.click(screen.getByRole('button', { name: 'actions.upgrade' }))

    expect(TenantServices.updateMail).not.toHaveBeenCalled()
    expect(NotificationServices.updateTenantNotificationConfigs).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
    expect(emailInput).toHaveValue(typedEmail)
  })

  it('updates notifications alone without sending an unchanged email', async () => {
    const user = userEvent.setup()
    const { props } = renderDrawer({ enabledTenantNotificationConfigEmail: true })
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'actions.upgrade' }))

    await waitFor(() => expect(props.onClose).toHaveBeenCalledOnce())
    expect(NotificationServices.updateTenantNotificationConfigs).toHaveBeenCalledExactlyOnceWith({
      enabled: false,
    })
    expect(TenantServices.updateMail).not.toHaveBeenCalled()
  })

  it('inserts an email from empty props with an optional description and no admin switch', async () => {
    mockUseJwt({ currentRoles: ['api'], isAdmin: false })
    const user = userEvent.setup()
    const { props } = renderDrawer({
      email: undefined,
      enabledTenantNotificationConfigEmail: undefined,
    })
    expect(screen.getByText('drawer.title.insert')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByText('drawer.mailChangeAlert')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'drawer.descriptionField.label' })).toHaveValue('')

    await user.type(screen.getByRole('textbox', { name: 'drawer.mailField.label' }), typedEmail)
    await user.click(screen.getByRole('button', { name: 'actions.insert' }))

    await waitFor(() => expect(props.onClose).toHaveBeenCalledOnce())
    expect(TenantServices.updateMail).toHaveBeenCalledExactlyOnceWith({
      partyId: 'organizationId',
      address: typedEmail,
      kind: 'CONTACT_EMAIL',
      description: undefined,
    })
    expect(NotificationServices.updateTenantNotificationConfigs).not.toHaveBeenCalled()
  })

  it('does not start an update for a description-only edit', async () => {
    const user = userEvent.setup()
    const { props } = renderDrawer({ email: { address: serverEmail.address } })
    await user.type(
      screen.getByRole('textbox', { name: 'drawer.descriptionField.label' }),
      typedDescription
    )
    await user.click(screen.getByRole('button', { name: 'actions.upgrade' }))

    expect(TenantServices.updateMail).not.toHaveBeenCalled()
    expect(NotificationServices.updateTenantNotificationConfigs).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
  })

  it.each([
    { email: '', description: '', error: 'validation.mixed.required' },
    { email: 'not-an-email', description: '', error: 'validation.string.email' },
    { email: typedEmail, description: 'short', error: 'validation.string.minLength' },
  ])('blocks invalid values: $error', async ({ email, description, error }) => {
    const user = userEvent.setup()
    const { props } = renderDrawer({ email: undefined })
    if (email)
      await user.type(screen.getByRole('textbox', { name: 'drawer.mailField.label' }), email)
    if (description) {
      await user.type(
        screen.getByRole('textbox', { name: 'drawer.descriptionField.label' }),
        description
      )
    }
    await user.click(screen.getByRole('button', { name: 'actions.insert' }))

    expect(await screen.findByText(error)).toBeInTheDocument()
    expect(TenantServices.updateMail).not.toHaveBeenCalled()
    expect(NotificationServices.updateTenantNotificationConfigs).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
  })

  it.each(['mail', 'notification'] as const)(
    'preserves dirty fields when %s fails after the other mutation refreshes props',
    async (failedMutation) => {
      const user = userEvent.setup()
      const mail = deferred()
      const notification = deferred()
      const updateMail = vi.mocked(TenantServices.updateMail).mockImplementationOnce(async () => {
        await mail.promise
        return response
      })
      const updateNotification = vi
        .mocked(NotificationServices.updateTenantNotificationConfigs)
        .mockImplementationOnce(async () => {
          await notification.promise
          return response
        })
      const { props, rerenderDrawer } = renderDrawer()
      const emailInput = screen.getByRole('textbox', { name: 'drawer.mailField.label' })
      const descriptionInput = screen.getByRole('textbox', {
        name: 'drawer.descriptionField.label',
      })
      const notificationSwitch = screen.getByRole('checkbox')

      await user.clear(emailInput)
      await user.type(emailInput, typedEmail)
      await user.clear(descriptionInput)
      await user.type(descriptionInput, typedDescription)
      await user.click(notificationSwitch)
      await user.click(screen.getByRole('button', { name: 'actions.upgrade' }))

      await waitFor(() => {
        expect(updateMail).toHaveBeenCalledTimes(1)
        expect(updateNotification).toHaveBeenCalledTimes(1)
      })
      await act(async () => {
        if (failedMutation === 'mail') notification.resolve()
        else mail.resolve()
      })
      rerenderDrawer({
        email:
          failedMutation === 'mail'
            ? { ...serverEmail }
            : { address: typedEmail, description: typedDescription },
        enabledTenantNotificationConfigEmail: failedMutation === 'mail',
      })
      await act(async () => {
        const failed = failedMutation === 'mail' ? mail : notification
        failed.reject(new Error('Update failed'))
      })

      expect(props.onClose).not.toHaveBeenCalled()
      expect(emailInput).toBeVisible()
      expect(emailInput).toHaveValue(typedEmail)
      expect(descriptionInput).toHaveValue(typedDescription)
      expect(notificationSwitch).toBeChecked()

      await user.click(screen.getByRole('button', { name: 'actions.upgrade' }))
      await waitFor(() => expect(props.onClose).toHaveBeenCalledTimes(1))
      expect(updateMail).toHaveBeenCalledTimes(failedMutation === 'mail' ? 2 : 1)
      expect(updateMail).toHaveBeenLastCalledWith({
        partyId: 'organizationId',
        address: typedEmail,
        kind: 'CONTACT_EMAIL',
        description: typedDescription,
      })
      expect(updateNotification).toHaveBeenCalledTimes(failedMutation === 'notification' ? 2 : 1)
      expect(updateNotification).toHaveBeenLastCalledWith({ enabled: true })
    }
  )

  it('hydrates untouched fields from refreshed props without overwriting dirty email', async () => {
    const user = userEvent.setup()
    const { rerenderDrawer } = renderDrawer()
    const emailInput = screen.getByRole('textbox', { name: 'drawer.mailField.label' })
    await user.clear(emailInput)
    await user.type(emailInput, typedEmail)

    rerenderDrawer({
      email: { address: 'server@example.com', description: 'Refreshed description' },
      enabledTenantNotificationConfigEmail: true,
    })

    expect(emailInput).toHaveValue(typedEmail)
    expect(screen.getByRole('textbox', { name: 'drawer.descriptionField.label' })).toHaveValue(
      'Refreshed description'
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('hydrates pristine fields from refreshed props', () => {
    const { rerenderDrawer } = renderDrawer()
    rerenderDrawer({
      email: { address: typedEmail, description: typedDescription },
      enabledTenantNotificationConfigEmail: true,
    })

    expect(screen.getByRole('textbox', { name: 'drawer.mailField.label' })).toHaveValue(typedEmail)
    expect(screen.getByRole('textbox', { name: 'drawer.descriptionField.label' })).toHaveValue(
      typedDescription
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it.each([false, true])(
    'resets cleanly on cancel/reopen (wait for exit: %s)',
    async (waitForExit) => {
      const user = userEvent.setup()
      const { props, rerenderDrawer } = renderDrawer()
      const emailInput = screen.getByRole('textbox', { name: 'drawer.mailField.label' })
      await user.clear(emailInput)
      await user.type(emailInput, typedEmail)
      await user.clear(screen.getByRole('textbox', { name: 'drawer.descriptionField.label' }))
      await user.type(
        screen.getByRole('textbox', { name: 'drawer.descriptionField.label' }),
        typedDescription
      )
      await user.click(screen.getByRole('checkbox'))
      await user.click(screen.getByRole('button', { name: 'closeIconAriaLabel' }))
      expect(props.onClose).toHaveBeenCalledTimes(1)
      rerenderDrawer({ isOpen: false })
      if (waitForExit) {
        await waitFor(() => expect(emailInput).not.toBeInTheDocument())
      }
      const latestEmail = { address: 'latest@example.com', description: 'Latest description' }
      rerenderDrawer({ email: latestEmail, enabledTenantNotificationConfigEmail: undefined })

      expect(screen.getByRole('textbox', { name: 'drawer.mailField.label' })).toHaveValue(
        latestEmail.address
      )
      expect(screen.getByRole('textbox', { name: 'drawer.descriptionField.label' })).toHaveValue(
        latestEmail.description
      )
      expect(screen.getByRole('checkbox')).not.toBeChecked()
      await user.click(screen.getByRole('button', { name: 'actions.upgrade' }))
      expect(TenantServices.updateMail).not.toHaveBeenCalled()
      expect(NotificationServices.updateTenantNotificationConfigs).not.toHaveBeenCalled()

      rerenderDrawer({ email: serverEmail, enabledTenantNotificationConfigEmail: true })
      expect(screen.getByRole('textbox', { name: 'drawer.mailField.label' })).toHaveValue(
        serverEmail.address
      )
      expect(screen.getByRole('checkbox')).toBeChecked()
    }
  )
})
