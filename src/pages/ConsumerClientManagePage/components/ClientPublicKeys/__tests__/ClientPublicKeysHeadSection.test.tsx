import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ClientPublicKeysHeadSection } from '../ClientPublicKeysHeadSection'

const { mockedOpenDrawer, mockedCloseDrawer, state } = vi.hoisted(() => ({
  mockedOpenDrawer: vi.fn(),
  mockedCloseDrawer: vi.fn(),
  state: {
    isSupport: false,
    uid: 'operator-1',
    userIds: ['operator-1'],
    keys: [{ keyId: 'k1' }],
    isDrawerOpen: false,
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({ jwt: { uid: state.uid }, isSupport: state.isSupport }),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useSuspenseQuery: () => ({ data: state.userIds }),
  useQuery: () => ({ data: { keys: state.keys } }),
  keepPreviousData: vi.fn(),
}))

vi.mock('@/api/client', () => ({
  ClientQueries: {
    getOperatorsList: () => ({ queryKey: ['ClientGetOperatorsList'] }),
    getKeyList: () => ({ queryKey: ['ClientGetKeyList'] }),
  },
}))

vi.mock('@/hooks/useDrawerState', () => ({
  useDrawerState: () => ({
    isOpen: state.isDrawerOpen,
    openDrawer: mockedOpenDrawer,
    closeDrawer: mockedCloseDrawer,
  }),
}))

vi.mock('@/components/shared/HeadSection', () => ({
  HeadSection: ({
    title,
    description,
    actions,
  }: {
    title: string
    description: string
    actions: Array<{ label: string; action: VoidFunction; disabled?: boolean; tooltip?: string }>
  }) => (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={action.disabled}
          data-tooltip={action.tooltip}
          onClick={action.action}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
  HeadSectionSkeleton: () => <div data-testid="head-skeleton" />,
}))

vi.mock('../ClientAddPublicKeyDrawer', () => ({
  ClientAddPublicKeyDrawer: ({ isOpen, clientId }: { isOpen: boolean; clientId: string }) => (
    <div data-testid="add-key-drawer">{`${isOpen ? 'open' : 'closed'}-${clientId}`}</div>
  ),
}))

describe('ClientPublicKeysHeadSection', () => {
  beforeEach(() => {
    mockedOpenDrawer.mockReset()
    mockedCloseDrawer.mockReset()

    state.isSupport = false
    state.uid = 'operator-1'
    state.userIds = ['operator-1']
    state.keys = [{ keyId: 'k1' }]
    state.isDrawerOpen = false
  })

  it('renders enabled add action and drawer when user can add keys', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<ClientPublicKeysHeadSection clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const addButton = screen.getByRole('button', { name: 'addBtn' })
    expect(addButton).toBeEnabled()
    expect(screen.getByTestId('add-key-drawer')).toBeInTheDocument()

    await user.click(addButton)
    expect(mockedOpenDrawer).toHaveBeenCalledTimes(1)
  })

  it('disables add action for support user and hides drawer', () => {
    state.isSupport = true

    renderWithApplicationContext(<ClientPublicKeysHeadSection clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const addButton = screen.getByRole('button', { name: 'addBtn' })
    expect(addButton).toBeDisabled()
    expect(addButton).toHaveAttribute('data-tooltip', 'list.supportDisableInfo')
    expect(screen.queryByTestId('add-key-drawer')).not.toBeInTheDocument()
  })

  it('disables add action when user is not in client operators', () => {
    state.userIds = ['another-user']

    renderWithApplicationContext(<ClientPublicKeysHeadSection clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const addButton = screen.getByRole('button', { name: 'addBtn' })
    expect(addButton).toBeDisabled()
    expect(addButton).toHaveAttribute('data-tooltip', 'list.userEnableInfo')
  })
})
