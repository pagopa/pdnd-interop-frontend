import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerClientManagePage from '../ConsumerClientManage.page'

const {
  mockedNavigate,
  mockedRemoveClientAdmin,
  mockedOpenDrawer,
  mockedCloseDrawer,
  mockedUpdateActiveTab,
  mockedMarkNotificationsAsRead,
  mockedGetSingle,
  state,
} = vi.hoisted(() => ({
  mockedNavigate: vi.fn(),
  mockedRemoveClientAdmin: vi.fn(),
  mockedOpenDrawer: vi.fn(),
  mockedCloseDrawer: vi.fn(),
  mockedUpdateActiveTab: vi.fn(),
  mockedMarkNotificationsAsRead: vi.fn(),
  mockedGetSingle: vi.fn(),
  state: {
    clientKind: 'API' as 'API' | 'CONSUMER',
    activeTab: 'clientOperators',
    isDrawerOpen: false,
    searchParams: new URLSearchParams(),
    isLoadingClient: false,
    additionalActions: [] as Array<{ label: string; action: VoidFunction; variant: string }>,
    client: {
      id: 'client-id',
      name: 'Client Name',
      description: 'Client Description',
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
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useSearchParams: () => [state.searchParams],
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: () => ({ data: state.client, isLoading: state.isLoadingClient }),
}))

vi.mock('@/api/client', () => ({
  ClientQueries: {
    getSingle: mockedGetSingle,
  },
  ClientMutations: {
    useRemoveClientAdmin: () => ({ mutate: mockedRemoveClientAdmin }),
  },
}))

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => state.clientKind,
}))

vi.mock('@/hooks/useActiveTab', () => ({
  useActiveTab: () => ({ activeTab: state.activeTab, updateActiveTab: mockedUpdateActiveTab }),
}))

vi.mock('@/hooks/useDrawerState', () => ({
  useDrawerState: () => ({
    isOpen: state.isDrawerOpen,
    openDrawer: mockedOpenDrawer,
    closeDrawer: mockedCloseDrawer,
  }),
}))

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({
  useMarkNotificationsAsRead: mockedMarkNotificationsAsRead,
}))

vi.mock('@/hooks/useGetClientActions', () => ({
  default: () => ({ actions: state.additionalActions }),
}))

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({
    children,
    title,
    description,
    topSideActions,
  }: {
    children: React.ReactNode
    title: string
    description?: string
    topSideActions?: Array<{ label: string; action: VoidFunction }>
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
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
    mockedOpenDrawer.mockReset()
    mockedCloseDrawer.mockReset()
    mockedUpdateActiveTab.mockReset()
    mockedMarkNotificationsAsRead.mockReset()
    mockedGetSingle.mockReset()

    state.clientKind = 'API'
    state.activeTab = 'clientOperators'
    state.isDrawerOpen = false
    state.searchParams = new URLSearchParams()
    state.isLoadingClient = false
    state.additionalActions = []
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

    expect(mockedOpenDrawer).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('set-client-admin-drawer')).toHaveTextContent(
      'closed-client-id-no-admin'
    )
  })
})
