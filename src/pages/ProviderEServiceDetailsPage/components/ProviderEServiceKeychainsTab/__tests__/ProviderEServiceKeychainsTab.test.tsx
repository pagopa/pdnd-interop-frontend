import type { ComponentProps } from 'react'
import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KeychainQueries, KeychainMutations } from '@/api/keychain'
import { queryClient } from '@/config/query-client'
import { PREFETCH_STALE_TIME } from '@/config/constants'
import { queryOptions } from '@tanstack/react-query'
import type { CompactProducerKeychains, GetProducerKeychainsParams } from '@/api/api.generatedTypes'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import type { AddKeychainToEServiceDrawer } from '../AddKeychainToEServiceDrawer'
import { ProviderEserviceKeychainsTab } from '../ProviderEServiceKeychainsTab'

const boundary = vi.hoisted(() => ({
  add: vi.fn(),
  drawer: undefined as ComponentProps<typeof AddKeychainToEServiceDrawer> | undefined,
}))
vi.mock('../AddKeychainToEServiceDrawer', () => ({
  AddKeychainToEServiceDrawer: (props: ComponentProps<typeof AddKeychainToEServiceDrawer>) => {
    boundary.drawer = props
    return <div data-testid="keychains-drawer">{props.isOpen ? 'open' : 'closed'}</div>
  },
}))
vi.mock('../ProviderEServiceKeychainsTable', () => ({
  ProviderEServiceKeychainsTable: ({ eserviceId }: { eserviceId: string }) => (
    <div>{eserviceId}</div>
  ),
}))

describe('ProviderEserviceKeychainsTab', () => {
  beforeEach(() => {
    queryClient.clear()
    boundary.drawer = undefined
    boundary.add.mockReset().mockResolvedValue(undefined)
    mockUseJwt()
    mockUseParams({ eserviceId: 'eservice-id' })
    vi.spyOn(KeychainMutations, 'useAddKeychainToEService').mockReturnValue({
      mutateAsync: boundary.add,
    } as unknown as ReturnType<typeof KeychainMutations.useAddKeychainToEService>)
    vi.spyOn(KeychainQueries, 'getKeychainsList').mockImplementation((params) =>
      queryOptions<
        CompactProducerKeychains,
        Error,
        CompactProducerKeychains,
        Array<string | GetProducerKeychainsParams>
      >({
        queryKey: ['keychains', params],
        queryFn: async () => ({
          results: [{ id: 'existing', name: 'Existing', hasKeys: true }],
          pagination: { offset: 0, limit: 50, totalCount: 1 },
        }),
      })
    )
  })

  afterEach(() => vi.restoreAllMocks())

  function renderTab() {
    return renderWithApplicationContext(<ProviderEserviceKeychainsTab />, {
      withReactQueryContext: true,
    })
  }

  it('opens/closes locally, excludes linked keychains, and prefetches on pointer and keyboard focus', async () => {
    const user = userEvent.setup()
    const prefetch = vi.spyOn(queryClient, 'prefetchQuery').mockResolvedValue(undefined)
    renderTab()
    const add = screen.getByRole('button', { name: 'addBtn' })
    await user.hover(add)
    await user.tab()
    expect(KeychainQueries.getKeychainsList).toHaveBeenCalledWith({
      eserviceId: 'eservice-id',
      limit: 50,
      offset: 0,
    })
    expect(prefetch).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['keychains', { limit: 50, offset: 0 }],
        staleTime: PREFETCH_STALE_TIME,
      })
    )
    await user.click(add)
    expect(boundary.drawer?.isOpen).toBe(true)
    expect(boundary.drawer?.excludeKeychainsIdsList).toEqual(['existing'])
    act(() => boundary.drawer?.onClose())
    expect(boundary.drawer?.isOpen).toBe(false)
    expect(boundary.add).not.toHaveBeenCalled()
  })

  it('returns the actual pending/rejected callback promise without closing and resolves a retry', async () => {
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
    const selected = { id: 'new-keychain', name: 'New keychain', hasKeys: true }
    let submission!: Promise<unknown>
    act(() => {
      submission = boundary.drawer!.onSubmit(selected) as Promise<unknown>
    })
    expect(boundary.add).toHaveBeenCalledWith({
      eserviceId: 'eservice-id',
      keychainId: 'new-keychain',
    })
    expect(boundary.drawer?.isOpen).toBe(true)
    const error = new Error('unavailable')
    await act(async () => {
      reject(error)
      await expect(submission).rejects.toBe(error)
    })
    expect(boundary.drawer?.isOpen).toBe(true)
    await act(async () => {
      await expect(boundary.drawer!.onSubmit(selected)).resolves.toBeUndefined()
    })
    expect(boundary.add).toHaveBeenCalledTimes(2)
  })

  it('preserves the table but disables addition and prefetch for read-only users', async () => {
    mockUseJwt({ isAdmin: false })
    const prefetch = vi.spyOn(queryClient, 'prefetchQuery').mockResolvedValue(undefined)
    renderTab()
    const add = screen.getByRole('button', { name: 'addBtn' })
    expect(add).toBeDisabled()
    expect(screen.getByText('eservice-id')).toBeVisible()
    expect(boundary.drawer).toBeUndefined()
    fireEvent.pointerEnter(add)
    expect(prefetch).not.toHaveBeenCalled()
    expect(boundary.add).not.toHaveBeenCalled()
  })
})
