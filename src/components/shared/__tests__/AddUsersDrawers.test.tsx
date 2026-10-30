import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TenantServices } from '@/api/tenant'
import type { Users } from '@/api/api.generatedTypes'
import { AddOperatorsToClientDrawer } from '../AddOperatorsToClientDrawer'
import { AddUsersToKeychainDrawer } from '../AddUsersToKeychainDrawer'

vi.mock('@/api/auth', () => ({
  AuthHooks: { useJwt: () => ({ jwt: { organizationId: 'tenant-id' } }) },
}))

const users: Users = [
  {
    userId: 'alice',
    tenantId: 'tenant-id',
    name: 'Alice',
    familyName: 'Available',
    roles: ['security'],
  },
  {
    userId: 'excluded',
    tenantId: 'tenant-id',
    name: 'Excluded',
    familyName: 'Member',
    roles: ['admin'],
  },
]

function deferred<Value>() {
  let resolve!: (value: Value) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

describe.each(['operators', 'keychain'] as const)('add $0 drawer', (kind) => {
  let client: QueryClient

  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    vi.spyOn(TenantServices, 'getPartyUsersList').mockResolvedValue(users)
  })

  afterEach(() => {
    client.clear()
    vi.restoreAllMocks()
  })

  function setup(onSubmit: (selected: Users) => void | Promise<void>) {
    const onClose = vi.fn()
    function content(isOpen: boolean) {
      const props = { isOpen, onClose, onSubmit }
      return (
        <QueryClientProvider client={client}>
          {kind === 'operators' ? (
            <AddOperatorsToClientDrawer {...props} excludeOperatorsIdsList={['excluded']} />
          ) : (
            <AddUsersToKeychainDrawer {...props} excludeUsersIdsList={['excluded']} />
          )}
        </QueryClientProvider>
      )
    }
    const view = render(content(true))
    return { ...view, onClose, content, user: userEvent.setup() }
  }

  async function selectAlice(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('combobox'))
    const option = await screen.findByRole('option', { name: 'Alice Available' })
    expect(screen.queryByRole('option', { name: 'Excluded Member' })).not.toBeInTheDocument()
    await user.click(option)
  }

  it('filters existing members and closes after a synchronous local callback', async () => {
    const onSubmit = vi.fn()
    const { user, onClose } = setup(onSubmit)
    await selectAlice(user)
    await user.click(screen.getByRole('button', { name: 'addBtn' }))
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(onSubmit).toHaveBeenCalledWith([users[0]])
    expect(onSubmit.mock.invocationCallOrder[0]).toBeLessThan(onClose.mock.invocationCallOrder[0])
    expect(TenantServices.getPartyUsersList).toHaveBeenCalledWith({
      tenantId: 'tenant-id',
      roles: ['admin', 'security'],
    })
  })

  it.each(['resolve', 'reject'] as const)(
    'retains selection until async %s and permits retry on failure',
    async (outcome) => {
      const request = deferred<void>()
      const onSubmit = vi
        .fn<(selected: Users) => Promise<void>>()
        .mockReturnValueOnce(request.promise)
        .mockResolvedValue(undefined)
      const { user, onClose } = setup(onSubmit)
      await selectAlice(user)
      await user.click(screen.getByRole('button', { name: 'addBtn' }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
      expect(onClose).not.toHaveBeenCalled()
      expect(screen.getByText('Alice Available')).toBeInTheDocument()
      await act(async () => {
        if (outcome === 'resolve') request.resolve()
        else request.reject(new Error('backend failure'))
      })
      if (outcome === 'reject') {
        expect(onClose).not.toHaveBeenCalled()
        expect(screen.getByText('Alice Available')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'addBtn' }))
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2))
        expect(onSubmit).toHaveBeenLastCalledWith([users[0]])
      }
      await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    }
  )

  it('cancels without submitting and resets only after the exit transition', async () => {
    const onSubmit = vi.fn()
    const { user, onClose, rerender, content } = setup(onSubmit)
    await selectAlice(user)
    const input = screen.getByRole('combobox')
    await user.click(screen.getByRole('button', { name: 'closeIconAriaLabel' }))
    expect(onClose).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
    rerender(content(false))
    await waitFor(() => expect(input).not.toBeInTheDocument())
    rerender(content(true))
    expect(screen.queryByText('Alice Available')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'addBtn' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith([]))
  })

  it('renders safely before the party-user query resolves', async () => {
    const request = deferred<Users>()
    vi.mocked(TenantServices.getPartyUsersList).mockReturnValue(request.promise)
    const { user, onClose } = setup(vi.fn())
    await user.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    await act(async () => request.resolve(users))
    expect(await screen.findByRole('option', { name: 'Alice Available' })).toBeInTheDocument()
  })
})
