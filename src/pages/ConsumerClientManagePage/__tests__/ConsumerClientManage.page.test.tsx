import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerClientManagePage from '../ConsumerClientManage.page'
import { AuthHooks } from '@/api/auth'
import { createMockJwtUser } from '@/../__mocks__/data/user.mocks'

const useJwtSpy = vi.spyOn(AuthHooks, 'useJwt')

const {
  mockedNavigate,
  mockedRemoveClientAdmin,
  mockedDeleteClient,
  mockedUpdateActiveTab,
  mockedMarkNotificationsAsRead,
  mockedGetSingle,
  state,
} = vi.hoisted(() => ({
  mockedNavigate: vi.fn(),
  mockedRemoveClientAdmin: vi.fn(),
  mockedDeleteClient: vi.fn(),
  mockedUpdateActiveTab: vi.fn(),
  mockedMarkNotificationsAsRead: vi.fn(),
  mockedGetSingle: vi.fn(),
  state: {
    clientKind: 'API' as 'API' | 'CONSUMER',
    activeTab: 'clientOperators',
    searchParams: new URLSearchParams(),
    isLoadingClient: false,
    client: {
      id: 'client-id',
      name: 'Client Name',
      description: 'Client Description' as string | undefined,
      admin: {
        userId: 'admin-id',
        name: 'Mario',
        familyName: 'Rossi',
      } as { userId: string; name: string; familyName: string } | undefined,
    },
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (_ns: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => (options?.keyPrefix ? `${options.keyPrefix}.${key}` : key),
  }),
}))

vi.mock('@/router', () => ({
  useParams: () => ({ clientId: 'client-id' }),
  useNavigate: () => mockedNavigate,
}))

vi.mock('react-router-dom', async (importOriginal) => ({
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useSearchParams: () => [state.searchParams],
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: () => ({ data: state.client, isLoading: state.isLoadingClient }),
}))

vi.mock('@/api/client', () => ({
  ClientQueries: {
    getSingle: mockedGetSingle,
  },
  ClientMutations: {
    useRemoveClientAdmin: () => ({ mutate: mockedRemoveClientAdmin }),
    useDelete: () => ({ mutate: mockedDeleteClient }),
  },
}))

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => state.clientKind,
}))

vi.mock('@/hooks/useActiveTab', () => ({
  useActiveTab: () => ({ activeTab: state.activeTab, updateActiveTab: mockedUpdateActiveTab }),
}))

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({
  useMarkNotificationsAsRead: mockedMarkNotificationsAsRead,
}))

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({
    children,
    title,
    description,
    topSideActions,
  }: {
    children: React.ReactNode
    title?: string
    description?: React.ReactNode
    topSideActions?: Array<{ label: string; action: VoidFunction }>
  }) => (
    <div>
      {title && <h1>{title}</h1>}
      <div>{description}</div>
      <div>
        {(topSideActions ?? []).map((action) => (
          <button key={action.label} type="button" onClick={action.action}>
            {action.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  ),
  SectionContainer: ({
    title,
    description,
    children,
  }: {
    title: string
    description: string
    children: React.ReactNode
  }) => (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  ),
}))

vi.mock('@pagopa/interop-fe-commons', async (importOriginal) => ({
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  ...(await importOriginal<typeof import('@pagopa/interop-fe-commons')>()),
  InformationContainer: ({ label, content }: { label: string; content: string }) => (
    <div>
      <span>{label}</span>
      <span>{content}</span>
    </div>
  ),
}))

vi.mock('../components/ClientOperators', () => ({
  ClientOperators: ({ clientId }: { clientId: string }) => (
    <div data-testid="client-operators">{clientId}</div>
  ),
}))

vi.mock('../components/ClientPublicKeys', () => ({
  ClientPublicKeys: ({ clientId }: { clientId: string }) => (
    <div data-testid="client-public-keys">{clientId}</div>
  ),
}))

vi.mock('../components/SetClientAdminDrawer/SetClientAdminDrawer', () => ({
  SetClientAdminDrawer: ({
    isOpen,
    clientId,
    admin,
  }: {
    isOpen: boolean
    clientId: string
    admin?: { userId: string }
  }) => (
    <div data-testid="set-client-admin-drawer">
      {`${isOpen ? 'open' : 'closed'}-${clientId}-${admin?.userId ?? 'no-admin'}`}
    </div>
  ),
}))

describe('ConsumerClientManagePage', () => {
  beforeEach(() => {
    mockedNavigate.mockReset()
    mockedRemoveClientAdmin.mockReset()
    mockedDeleteClient.mockReset()
    mockedUpdateActiveTab.mockReset()
    mockedMarkNotificationsAsRead.mockReset()
    mockedGetSingle.mockReset()

    state.clientKind = 'API'
    state.activeTab = 'clientOperators'
    state.searchParams = new URLSearchParams()
    state.isLoadingClient = false
    state.client = {
      id: 'client-id',
      name: 'Client Name',
      description: 'Client Description',
      admin: {
        userId: 'admin-id',
        name: 'Mario',
        familyName: 'Rossi',
      },
    }

    mockedGetSingle.mockReturnValue({ queryKey: ['ClientGetSingle'] })
    useJwtSpy.mockReturnValue({
      jwt: createMockJwtUser(),
      currentRoles: [],
      isAdmin: true,
      userEmail: 'test@email.com',
      isOperatorAPI: false,
      isOperatorSecurity: false,
      isOrganizationAllowedToProduce: false,
      isReviewer: false,
      isSupport: false,
      isViewer: false,
    })
  })

  it('renders API admin section, tabs, and marks notifications as read', () => {
    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('heading', { name: 'Client Name' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'edit.adminSection.title' })).toBeInTheDocument()
    expect(screen.getByText('edit.adminSection.adminLabel')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'edit.tabs.clientOperators' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'edit.tabs.publicKeys' })).toBeInTheDocument()
    expect(mockedMarkNotificationsAsRead).toHaveBeenCalledWith('client-id')
    expect(screen.getByTestId('set-client-admin-drawer')).toHaveTextContent(
      'closed-client-id-admin-id'
    )
  })

  it('navigates to API voucher simulation including purposeId when present', async () => {
    const user = userEvent.setup()
    state.searchParams = new URLSearchParams('purposeId=purpose-123')

    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'actions.simulateVoucher' }))

    expect(mockedNavigate).toHaveBeenCalledWith('SIMULATE_GET_VOUCHER_API', {
      urlParams: {
        clientId: 'client-id',
        purposeId: 'purpose-123',
      },
    })
  })

  it('navigates to consumer voucher simulation without purposeId when absent', async () => {
    const user = userEvent.setup()
    state.clientKind = 'CONSUMER'

    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'actions.simulateVoucher' }))

    expect(mockedNavigate).toHaveBeenCalledWith('SIMULATE_GET_VOUCHER_CONSUMER', {
      urlParams: {
        clientId: 'client-id',
      },
    })
    expect(
      screen.queryByRole('heading', { name: 'edit.adminSection.title' })
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('set-client-admin-drawer')).not.toBeInTheDocument()
  })

  it('removes admin when remove button is clicked', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(
      screen.getByRole('button', { name: 'edit.adminSection.actions.removeAdminLabel' })
    )

    expect(mockedRemoveClientAdmin).toHaveBeenCalledWith({
      clientId: 'client-id',
      adminId: 'admin-id',
      userName: 'Mario Rossi',
    })
  })

  it('shows select admin button when admin is missing and opens drawer', async () => {
    const user = userEvent.setup()
    state.client = {
      id: 'client-id',
      name: 'Client Name',
      description: 'Client Description',
      admin: undefined,
    }

    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const selectAdminButton = screen.getByRole('button', {
      name: 'edit.adminSection.actions.selectAdminLabel',
    })

    await user.click(selectAdminButton)

    expect(screen.getByText('open-client-id-no-admin')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('does not render SetClientAdminDrawer if the user is not an admin', async () => {
    useJwtSpy.mockReturnValue({
      jwt: createMockJwtUser(),
      currentRoles: [],
      isAdmin: false,
      userEmail: 'test@email.com',
      isOperatorAPI: false,
      isOperatorSecurity: true,
      isOrganizationAllowedToProduce: false,
      isReviewer: false,
      isSupport: false,
      isViewer: false,
    })

    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByTestId('set-client-admin-drawer')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'actionMenu.iconButtonAriaLabel' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Client Name' })).toBeVisible()
    expect(screen.getByText('Client Description')).toBeVisible()
    expect(screen.getByRole('button', { name: 'actions.simulateVoucher' })).toBeEnabled()
  })

  it.each(['API', 'CONSUMER'] as const)(
    'opens a prefilled metadata drawer for an admin of a %s client without opening the API admin drawer',
    async (clientKind) => {
      const user = userEvent.setup()
      state.clientKind = clientKind
      renderWithApplicationContext(<ConsumerClientManagePage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      expect(screen.queryByRole('button', { name: 'actions.delete' })).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'actionMenu.iconButtonAriaLabel' }))
      expect(screen.getByRole('menuitem', { name: 'actions.delete' })).toBeVisible()
      await user.click(screen.getByRole('menuitem', { name: 'edit.updateMetadataDrawer.title' }))

      const nameInput = screen.getByRole('textbox', {
        name: 'edit.updateMetadataDrawer.nameField.label',
      })
      expect(nameInput).toHaveValue(state.client.name)
      expect(nameInput).toHaveAttribute('maxlength', '60')
      const descriptionInput = screen.getByRole('textbox', {
        name: 'edit.updateMetadataDrawer.descriptionField.label',
      })
      expect(descriptionInput).toHaveValue(state.client.description)
      expect(descriptionInput).toHaveAttribute('maxlength', '250')
      if (clientKind === 'API') {
        expect(screen.getByText('closed-client-id-admin-id')).toBeInTheDocument()
      }

      await user.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument())
    }
  )

  it('opens the metadata drawer with an empty description when the client has none', async () => {
    const user = userEvent.setup()
    state.client.description = undefined
    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'actionMenu.iconButtonAriaLabel' }))
    await user.click(screen.getByRole('menuitem', { name: 'edit.updateMetadataDrawer.title' }))

    expect(
      screen.getByRole('textbox', { name: 'edit.updateMetadataDrawer.nameField.label' })
    ).toHaveValue(state.client.name)
    expect(
      screen.getByRole('textbox', { name: 'edit.updateMetadataDrawer.descriptionField.label' })
    ).toHaveValue('')
  })

  it.each([
    { clientKind: 'API', destination: 'SUBSCRIBE_INTEROP_M2M' },
    { clientKind: 'CONSUMER', destination: 'SUBSCRIBE_CLIENT_LIST' },
  ] as const)(
    'preserves delete behavior for a $clientKind client through the menu',
    async ({ clientKind, destination }) => {
      const user = userEvent.setup()
      state.clientKind = clientKind
      mockedDeleteClient.mockImplementation(
        (_payload: unknown, options: { onSuccess: () => void }) => options.onSuccess()
      )
      renderWithApplicationContext(<ConsumerClientManagePage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      await user.click(screen.getByRole('button', { name: 'actionMenu.iconButtonAriaLabel' }))
      await user.click(screen.getByRole('menuitem', { name: 'actions.delete' }))

      expect(mockedDeleteClient).toHaveBeenCalledWith(
        { clientId: 'client-id' },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
      expect(mockedNavigate).toHaveBeenCalledWith(destination)
    }
  )

  it('does not render sobstitute/remove admin actions if the user is not an admin and client admin is selected', async () => {
    useJwtSpy.mockReturnValue({
      jwt: createMockJwtUser(),
      currentRoles: [],
      isAdmin: false,
      userEmail: 'test@email.com',
      isOperatorAPI: false,
      isOperatorSecurity: true,
      isOrganizationAllowedToProduce: false,
      isReviewer: false,
      isSupport: false,
      isViewer: false,
    })

    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByText('edit.adminSection.adminLabel')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'edit.adminSection.actions.removeAdminLabel' })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'edit.adminSection.actions.substituteAdminLabel' })
    ).not.toBeInTheDocument()
  })

  it('does not render select admin actions if the user is not an admin and client admin is not selected', async () => {
    useJwtSpy.mockReturnValue({
      jwt: createMockJwtUser(),
      currentRoles: [],
      isAdmin: false,
      userEmail: 'test@email.com',
      isOperatorAPI: false,
      isOperatorSecurity: true,
      isOrganizationAllowedToProduce: false,
      isReviewer: false,
      isSupport: false,
      isViewer: false,
    })

    state.client = {
      id: 'client-id',
      name: 'Client Name',
      description: 'Client Description',
      admin: undefined,
    }

    renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.queryByRole('button', { name: 'edit.adminSection.actions.selectAdminLabel' })
    ).not.toBeInTheDocument()
  })
})
