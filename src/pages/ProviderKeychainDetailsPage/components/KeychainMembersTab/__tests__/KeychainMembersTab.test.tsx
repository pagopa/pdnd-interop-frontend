import type { ComponentProps } from 'react'
import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthHooks } from '@/api/auth'
import { KeychainQueries, KeychainMutations } from '@/api/keychain'
import { TenantQueries } from '@/api/tenant'
import { queryClient } from '@/config/query-client'
import { PREFETCH_STALE_TIME } from '@/config/constants'
import { queryOptions } from '@tanstack/react-query'
import type { Users, GetInstitutionUsersParams } from '@/api/api.generatedTypes'
import { createMockSelfCareUser } from '../../../../../../__mocks__/data/user.mocks'
import type { AddUsersToKeychainDrawer } from '@/components/shared/AddUsersToKeychainDrawer'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { KeychainMembersTab } from '../KeychainMembersTab'

const boundary = vi.hoisted(() => ({
  add: vi.fn(),
  drawer: undefined as ComponentProps<typeof AddUsersToKeychainDrawer> | undefined,
}))
vi.mock('@/components/shared/AddUsersToKeychainDrawer', () => ({
  AddUsersToKeychainDrawer: (props: ComponentProps<typeof AddUsersToKeychainDrawer>) => {
    boundary.drawer = props
    return <div data-testid="members-drawer">{props.isOpen ? 'open' : 'closed'}</div>
  },
}))
vi.mock('../KeychainMembersTable', () => ({
  KeychainMembersTable: ({ keychainId }: { keychainId: string }) => <div>{keychainId}</div>,
  KeychainMembersTableSkeleton: () => <div>loading members</div>,
}))

describe('KeychainMembersTab', () => {
  beforeEach(() => {
    queryClient.clear()
    boundary.drawer = undefined
    boundary.add.mockReset().mockResolvedValue(undefined)
    mockUseJwt()
    vi.spyOn(KeychainMutations, 'useAddProducerKeychainUsers').mockReturnValue({
      mutateAsync: boundary.add,
    } as unknown as ReturnType<typeof KeychainMutations.useAddProducerKeychainUsers>)
    vi.spyOn(KeychainQueries, 'getProducerKeychainUsersList').mockReturnValue(
      queryOptions({
        queryKey: ['members'],
        queryFn: async () => [{ userId: 'existing', name: 'Existing', familyName: 'Member' }],
      })
    )
    vi.spyOn(TenantQueries, 'getPartyUsersList').mockReturnValue(
      queryOptions<Users, Error, Users, Array<string | GetInstitutionUsersParams>>({
        queryKey: ['available-members'],
        queryFn: async () => [],
      })
    )
  })

  afterEach(() => vi.restoreAllMocks())

  function renderTab() {
    return renderWithApplicationContext(<KeychainMembersTab keychainId="keychain-id" />, {
      withReactQueryContext: true,
    })
  }

  it('opens and closes locally, excludes existing members, and prefetches on pointer and keyboard focus', async () => {
    const user = userEvent.setup()
    const prefetch = vi.spyOn(queryClient, 'prefetchQuery').mockResolvedValue(undefined)
    renderTab()
    const add = screen.getByRole('button', { name: 'addBtn' })
    await user.hover(add)
    await user.tab()
    expect(TenantQueries.getPartyUsersList).toHaveBeenCalledWith({
      roles: ['admin', 'security'],
      tenantId: 'organizationId',
    })
    expect(prefetch).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['available-members'], staleTime: PREFETCH_STALE_TIME })
    )
    await user.click(add)
    expect(boundary.drawer?.isOpen).toBe(true)
    expect(boundary.drawer?.excludeUsersIdsList).toEqual(['existing'])
    act(() => boundary.drawer?.onClose())
    expect(boundary.drawer?.isOpen).toBe(false)
    expect(boundary.add).not.toHaveBeenCalled()
  })

  it('returns a pending/rejected mutation promise, preserves open state, and resolves a retry', async () => {
    const user = userEvent.setup()
    renderTab()
    await user.click(screen.getByRole('button', { name: 'addBtn' }))
    let reject!: (reason: Error) => void
    boundary.add.mockImplementationOnce(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail
        })
    )
    const members = [createMockSelfCareUser({ userId: 'new' })]
    let submission!: Promise<unknown>
    act(() => {
      submission = boundary.drawer!.onSubmit(members) as Promise<unknown>
    })
    expect(boundary.add).toHaveBeenCalledWith({
      producerKeychainId: 'keychain-id',
      userIds: ['new'],
    })
    expect(boundary.drawer?.isOpen).toBe(true)
    const error = new Error('conflict')
    await act(async () => {
      reject(error)
      await expect(submission).rejects.toBe(error)
    })
    expect(boundary.drawer?.isOpen).toBe(true)
    await act(async () => {
      await expect(boundary.drawer!.onSubmit(members)).resolves.toBeUndefined()
    })
    expect(boundary.add).toHaveBeenCalledTimes(2)
  })

  it('keeps read access but disables mutations and prefetch for non-admins', async () => {
    mockUseJwt({ isAdmin: false })
    const prefetch = vi.spyOn(queryClient, 'prefetchQuery').mockResolvedValue(undefined)
    renderTab()
    const add = screen.getByRole('button', { name: 'addBtn' })
    expect(add).toBeDisabled()
    expect(screen.getByText('keychain-id')).toBeVisible()
    expect(boundary.drawer).toBeUndefined()
    fireEvent.pointerEnter(add)
    expect(prefetch).not.toHaveBeenCalled()
    expect(boundary.add).not.toHaveBeenCalled()
    expect(AuthHooks.useJwt).toHaveBeenCalled()
  })
})
