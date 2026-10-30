import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ClientOperators } from '../ClientOperators'
import type * as ReactQuery from '@tanstack/react-query'

const {
  mockedAddOperators,
  mockedCloseDrawer,
  mockedOpenDrawer,
  mockedPrefetchQuery,
  mockedGetOperatorsList,
  mockedGetPartyUsersList,
  boundary,
  state,
} = vi.hoisted(() => ({
  mockedAddOperators: vi.fn(),
  mockedCloseDrawer: vi.fn(),
  mockedOpenDrawer: vi.fn(),
  mockedPrefetchQuery: vi.fn(),
  mockedGetOperatorsList: vi.fn(),
  mockedGetPartyUsersList: vi.fn(),
  boundary: {
    submit: undefined as
      | ((operators: Array<{ userId: string }>) => void | Promise<void>)
      | undefined,
  },
  state: {
    isAdmin: true,
    isOpen: false,
    currentOperators: [{ userId: 'u-1', name: 'Mario', familyName: 'Rossi' }] as
      | Array<{ userId: string; name: string; familyName: string }>
      | undefined,
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
  ...(await importOriginal<typeof ReactQuery>()),
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
    onClose,
    isOpen,
    excludeOperatorsIdsList,
  }: {
    onSubmit: (operators: Array<{ userId: string }>) => void | Promise<void>
    onClose: VoidFunction
    isOpen: boolean
    excludeOperatorsIdsList: string[]
  }) => {
    boundary.submit = onSubmit
    return (
      <div data-testid="add-operators-drawer">
        <span>{isOpen ? 'open' : 'closed'}</span>
        <span>{excludeOperatorsIdsList.join(',')}</span>
        <button
          type="button"
          onClick={() => {
            const result = onSubmit([{ userId: 'u-2' }])
            if (result) {
              void result.then(onClose, () => undefined)
            } else {
              onClose()
            }
          }}
        >
          submit-drawer
        </button>
      </div>
    )
  },
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
    mockedAddOperators.mockResolvedValue(undefined)
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

    await waitFor(() => {
      expect(mockedAddOperators).toHaveBeenCalledWith({ clientId: 'client-id', userIds: ['u-2'] })
      expect(mockedCloseDrawer).toHaveBeenCalledTimes(1)
    })
  })

  it('keeps the drawer open when adding operators fails', async () => {
    const user = userEvent.setup()
    mockedAddOperators.mockRejectedValue(new Error('request failed'))

    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'submit-drawer' }))

    await waitFor(() => {
      expect(mockedAddOperators).toHaveBeenCalledWith({ clientId: 'client-id', userIds: ['u-2'] })
    })
    expect(mockedCloseDrawer).not.toHaveBeenCalled()
  })

  it('disables add operator action and hides drawer for non admin', () => {
    state.isAdmin = false

    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'addBtn' })).toBeDisabled()
    expect(screen.queryByTestId('add-operators-drawer')).not.toBeInTheDocument()
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'addBtn' }))
    expect(mockedPrefetchQuery).not.toHaveBeenCalled()
  })

  it('returns the pending submission promise and leaves closing to the drawer after resolution', async () => {
    let resolve!: () => void
    mockedAddOperators.mockImplementationOnce(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
    })
    let submission!: Promise<void>
    act(() => {
      submission = boundary.submit!([{ userId: 'first' }, { userId: 'second' }]) as Promise<void>
    })
    expect(submission).toBeInstanceOf(Promise)
    expect(mockedAddOperators).toHaveBeenCalledWith({
      clientId: 'client-id',
      userIds: ['first', 'second'],
    })
    expect(mockedCloseDrawer).not.toHaveBeenCalled()
    await act(async () => {
      resolve()
      await expect(submission).resolves.toBeUndefined()
    })
    expect(mockedCloseDrawer).not.toHaveBeenCalled()
  })

  it('returns rejection to the caller without closing and supports the initial empty operator list', async () => {
    state.currentOperators = undefined
    const error = new Error('conflict')
    mockedAddOperators.mockRejectedValueOnce(error)
    renderWithApplicationContext(<ClientOperators clientId="client-id" />, {
      withReactQueryContext: true,
    })
    await act(async () => {
      await expect(boundary.submit!([{ userId: 'new' }])).rejects.toBe(error)
    })
    expect(mockedCloseDrawer).not.toHaveBeenCalled()
    expect(screen.getByTestId('add-operators-drawer')).toHaveTextContent('closed')
  })
})
