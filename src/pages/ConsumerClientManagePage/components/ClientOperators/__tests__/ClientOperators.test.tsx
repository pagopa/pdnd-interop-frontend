import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ClientOperators } from '../ClientOperators'

const {
  mockedAddOperators,
  mockedCloseDrawer,
  mockedOpenDrawer,
  mockedPrefetchQuery,
  mockedGetOperatorsList,
  mockedGetPartyUsersList,
  state,
} = vi.hoisted(() => ({
  mockedAddOperators: vi.fn(),
  mockedCloseDrawer: vi.fn(),
  mockedOpenDrawer: vi.fn(),
  mockedPrefetchQuery: vi.fn(),
  mockedGetOperatorsList: vi.fn(),
  mockedGetPartyUsersList: vi.fn(),
  state: {
    isAdmin: true,
    isOpen: false,
    currentOperators: [{ userId: 'u-1', name: 'Mario', familyName: 'Rossi' }],
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({ jwt: { organizationId: 'org-id' }, isAdmin: state.isAdmin }),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQueryClient: () => ({ prefetchQuery: mockedPrefetchQuery }),
  useQuery: () => ({ data: state.currentOperators }),
}))

vi.mock('@/api/client', () => ({
  ClientQueries: {
    getOperatorsList: mockedGetOperatorsList,
  },
  ClientMutations: {
    useAddOperators: () => ({ mutateAsync: mockedAddOperators }),
  },
}))

vi.mock('@/api/tenant', () => ({
  TenantQueries: {
    getPartyUsersList: mockedGetPartyUsersList,
  },
}))

vi.mock('@/hooks/useDrawerState', () => ({
  useDrawerState: () => ({
    isOpen: state.isOpen,
    closeDrawer: mockedCloseDrawer,
    openDrawer: mockedOpenDrawer,
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
    actions: Array<{
      label: string
      action: VoidFunction
      disabled?: boolean
      onPointerEnter?: VoidFunction
    }>
  }) => (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={action.disabled}
          onClick={action.action}
          onPointerEnter={action.onPointerEnter}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('../ClientOperatorsTable', () => ({
  ClientOperatorsTable: ({ clientId }: { clientId: string }) => (
    <div data-testid="operators-table">{clientId}</div>
  ),
  ClientOperatorsTableSkeleton: () => <div data-testid="operators-table-skeleton" />,
}))

vi.mock('@/components/shared/AddOperatorsToClientDrawer', () => ({
  AddOperatorsToClientDrawer: ({
    onSubmit,
    isOpen,
    excludeOperatorsIdsList,
  }: {
    onSubmit: (operators: Array<{ userId: string }>) => void
    isOpen: boolean
    excludeOperatorsIdsList: string[]
  }) => (
    <div data-testid="add-operators-drawer">
      <span>{isOpen ? 'open' : 'closed'}</span>
      <span>{excludeOperatorsIdsList.join(',')}</span>
      <button type="button" onClick={() => onSubmit([{ userId: 'u-2' }])}>
        submit-drawer
      </button>
    </div>
  ),
}))

describe('ClientOperators', () => {
  beforeEach(() => {
    mockedAddOperators.mockReset()
    mockedCloseDrawer.mockReset()
    mockedOpenDrawer.mockReset()
    mockedPrefetchQuery.mockReset()
    mockedGetOperatorsList.mockReset()
    mockedGetPartyUsersList.mockReset()

    state.isAdmin = true
    state.isOpen = false
    state.currentOperators = [{ userId: 'u-1', name: 'Mario', familyName: 'Rossi' }]

    mockedGetOperatorsList.mockReturnValue({ queryKey: ['ClientGetOperatorsList'] })
    mockedGetPartyUsersList.mockReturnValue({ queryKey: ['TenantGetPartyUsersList'] })
  })

  it('renders head section, table and drawer for admin', () => {
    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('heading', { name: 'clientOperatorsTab.title' })).toBeInTheDocument()
    expect(screen.getByTestId('operators-table')).toHaveTextContent('client-id')
    expect(screen.getByTestId('add-operators-drawer')).toBeInTheDocument()
  })

  it('prefetches users on add button hover when admin', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.hover(screen.getByRole('button', { name: 'addBtn' }))

    expect(mockedGetPartyUsersList).toHaveBeenCalledWith({
      roles: ['admin', 'security'],
      tenantId: 'org-id',
    })
    expect(mockedPrefetchQuery).toHaveBeenCalledTimes(1)
  })

  it('submits selected operators and closes drawer', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'submit-drawer' }))

    expect(mockedAddOperators).toHaveBeenCalledWith({ clientId: 'client-id', userIds: ['u-2'] })
    expect(mockedCloseDrawer).toHaveBeenCalledTimes(1)
  })

  it('disables add operator action and hides drawer for non admin', () => {
    state.isAdmin = false

    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'addBtn' })).toBeDisabled()
    expect(screen.queryByTestId('add-operators-drawer')).not.toBeInTheDocument()
  })
})
