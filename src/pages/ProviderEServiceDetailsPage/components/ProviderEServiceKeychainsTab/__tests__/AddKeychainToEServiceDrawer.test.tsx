import type { ComponentProps } from 'react'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Drawer } from '@/components/shared/Drawer'
import { queryClient } from '@/config/query-client'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { AddKeychainToEServiceDrawer } from '../AddKeychainToEServiceDrawer'

const boundary = vi.hoisted(() => ({
  list: vi.fn(),
  drawer: undefined as ComponentProps<typeof Drawer> | undefined,
}))
vi.mock('@/api/keychain', () => ({ KeychainQueries: { getKeychainsList: boundary.list } }))
vi.mock('@/components/shared/Drawer', () => ({
  Drawer: (props: ComponentProps<typeof Drawer>) => {
    boundary.drawer = props
    return props.isOpen ? <section>{props.children}</section> : null
  },
}))

describe('AddKeychainToEServiceDrawer', () => {
  beforeEach(() => {
    queryClient.clear()
    boundary.list.mockReset().mockImplementation((params) => ({
      queryKey: ['keychains', params],
      queryFn: async () => ({
        results: [
          { id: 'existing', name: 'Existing keychain' },
          { id: 'new-keychain', name: 'Available keychain' },
        ],
      }),
    }))
  })

  function renderDrawer(
    onSubmit = vi.fn<NonNullable<ComponentProps<typeof AddKeychainToEServiceDrawer>['onSubmit']>>()
  ) {
    const onClose = vi.fn()
    return {
      onClose,
      onSubmit,
      ...renderWithApplicationContext(
        <AddKeychainToEServiceDrawer
          isOpen
          onClose={onClose}
          onSubmit={onSubmit}
          excludeKeychainsIdsList={['existing']}
        />,
        { withReactQueryContext: true, withRouterContext: true }
      ),
    }
  }

  async function selectKeychain() {
    const user = userEvent.setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.click(await screen.findByRole('option', { name: 'Available keychain' }))
    return input
  }

  it('filters already linked keychains, disables empty selection, and supports a synchronous callback', async () => {
    const { onClose, onSubmit } = renderDrawer()
    expect(boundary.drawer?.buttonAction?.disabled).toBe(true)
    const user = userEvent.setup()
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByRole('combobox'), 'Available')
    await waitFor(() =>
      expect(boundary.list).toHaveBeenLastCalledWith({ q: 'Available', limit: 50, offset: 0 })
    )
    expect(await screen.findByRole('option', { name: 'Available keychain' })).toBeVisible()
    expect(screen.queryByRole('option', { name: 'Existing keychain' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Available keychain' }))
    await waitFor(() =>
      expect(boundary.list).toHaveBeenLastCalledWith({ q: '', limit: 50, offset: 0 })
    )
    await act(async () => boundary.drawer?.buttonAction?.action())
    expect(onSubmit).toHaveBeenCalledWith({ id: 'new-keychain', name: 'Available keychain' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('propagates rejection without closing or clearing the selection and allows retry', async () => {
    let reject!: (reason: Error) => void
    const submit = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<void>((_, fail) => {
            reject = fail
          })
      )
      .mockResolvedValue(undefined)
    const { onClose } = renderDrawer(submit)
    const input = await selectKeychain()
    let submission!: Promise<unknown>
    await act(async () => {
      submission = boundary.drawer!.buttonAction!.action() as Promise<unknown>
    })
    expect(submit).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
    const error = new Error('conflict')
    await act(async () => {
      reject(error)
      await expect(submission).rejects.toBe(error)
    })
    expect(onClose).not.toHaveBeenCalled()
    expect(input).toHaveValue('Available keychain')
    await act(async () => boundary.drawer?.buttonAction?.action())
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(submit).toHaveBeenCalledTimes(2)
  })

  it('awaits success and resets the real form on transition exit', async () => {
    let resolve!: () => void
    const submit = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    const { onClose, rerender } = renderDrawer(submit)
    await selectKeychain()
    let submission!: Promise<unknown>
    await act(async () => {
      submission = boundary.drawer!.buttonAction!.action() as Promise<unknown>
    })
    expect(onClose).not.toHaveBeenCalled()
    await act(async () => {
      resolve()
      await submission
    })
    expect(onClose).toHaveBeenCalledTimes(1)
    rerender(
      <AddKeychainToEServiceDrawer
        isOpen={false}
        onClose={onClose}
        onSubmit={submit}
        excludeKeychainsIdsList={['existing']}
      />
    )
    act(() => boundary.drawer?.onTransitionExited?.())
    rerender(
      <AddKeychainToEServiceDrawer
        isOpen
        onClose={onClose}
        onSubmit={submit}
        excludeKeychainsIdsList={['existing']}
      />
    )
    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(boundary.drawer?.buttonAction?.disabled).toBe(true)
  })

  it('shows the empty-list alert and closes locally on cancellation', async () => {
    boundary.list.mockReturnValue({
      queryKey: ['empty-keychains'],
      queryFn: async () => ({ results: [] }),
    })
    const { onClose, onSubmit } = renderDrawer()
    expect(await screen.findByRole('alert')).toHaveTextContent('noKeychainAlert')
    act(() => boundary.drawer?.onClose())
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
