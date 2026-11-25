import type { ComponentProps } from 'react'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Drawer } from '@/components/shared/Drawer'
import { queryClient } from '@/config/query-client'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PurposeAddClientDrawer } from '../PurposeAddClientDrawer'

const boundary = vi.hoisted(() => ({
  add: vi.fn(),
  list: vi.fn(),
  purpose: vi.fn(),
  drawer: undefined as ComponentProps<typeof Drawer> | undefined,
}))

vi.mock('@/components/shared/Drawer', () => ({
  Drawer: (props: ComponentProps<typeof Drawer>) => {
    boundary.drawer = props
    return props.isOpen ? <section>{props.children}</section> : null
  },
}))
vi.mock('@/api/client', () => ({ ClientQueries: { getList: boundary.list } }))
vi.mock('@/api/purpose', () => ({
  PurposeQueries: { getSingle: boundary.purpose },
  PurposeMutations: { useAddClient: () => ({ mutateAsync: boundary.add }) },
}))

describe('PurposeAddClientDrawer', () => {
  beforeEach(() => {
    queryClient.clear()
    boundary.add.mockReset().mockResolvedValue(undefined)
    boundary.purpose.mockReset().mockReturnValue({
      queryKey: ['purpose'],
      queryFn: async () => ({ clients: [{ id: 'existing' }] }),
    })
    boundary.list.mockReset().mockImplementation((params) => ({
      queryKey: ['clients', params],
      queryFn: async () => ({
        results: [
          { id: 'existing', name: 'Existing client' },
          { id: 'new-client', name: 'Available client' },
        ],
      }),
    }))
  })

  function renderDrawer() {
    const onClose = vi.fn()
    return {
      onClose,
      ...renderWithApplicationContext(
        <PurposeAddClientDrawer purposeId="purpose-id" isOpen onClose={onClose} />,
        { withReactQueryContext: true }
      ),
    }
  }

  async function selectClient() {
    const user = userEvent.setup()
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.click(await screen.findByRole('option', { name: 'Available client' }))
    return { user, input }
  }

  it('disables empty submission, excludes linked clients, and clears selected-name searches', async () => {
    renderDrawer()
    expect(boundary.drawer?.buttonAction?.disabled).toBe(true)
    const user = userEvent.setup()
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByRole('combobox'), 'Available')
    await waitFor(() =>
      expect(boundary.list).toHaveBeenLastCalledWith({
        kind: 'CONSUMER',
        q: 'Available',
        offset: 0,
        limit: 50,
      })
    )
    expect(await screen.findByRole('option', { name: 'Available client' })).toBeVisible()
    expect(screen.queryByRole('option', { name: 'Existing client' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Available client' }))
    expect(boundary.drawer?.buttonAction?.disabled).toBe(false)
    await waitFor(() =>
      expect(boundary.list).toHaveBeenLastCalledWith({
        kind: 'CONSUMER',
        q: '',
        offset: 0,
        limit: 50,
      })
    )
    expect(boundary.purpose).toHaveBeenCalledWith('purpose-id')
  })

  it('returns the pending/rejected submit promise, retains selection, and closes once after retry', async () => {
    const { onClose } = renderDrawer()
    const { input } = await selectClient()
    let reject!: (reason: Error) => void
    boundary.add.mockImplementationOnce(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail
        })
    )
    let submission!: Promise<unknown>
    await act(async () => {
      submission = boundary.drawer!.buttonAction!.action() as Promise<unknown>
    })
    expect(boundary.add).toHaveBeenCalledWith({ clientId: 'new-client', purposeId: 'purpose-id' })
    expect(onClose).not.toHaveBeenCalled()
    const error = new Error('request failed')
    await act(async () => {
      reject(error)
      await expect(submission).rejects.toBe(error)
    })
    expect(onClose).not.toHaveBeenCalled()
    expect(input).toHaveValue('Available client')
    await act(async () => boundary.drawer?.buttonAction?.action())
    expect(boundary.add).toHaveBeenCalledTimes(2)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes only after successful mutation settlement and resets selection on exit', async () => {
    const { onClose, rerender } = renderDrawer()
    await selectClient()
    let resolve!: () => void
    boundary.add.mockImplementationOnce(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
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
    rerender(<PurposeAddClientDrawer purposeId="purpose-id" isOpen={false} onClose={onClose} />)
    act(() => boundary.drawer?.onTransitionExited?.())
    rerender(<PurposeAddClientDrawer purposeId="purpose-id" isOpen onClose={onClose} />)
    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(boundary.drawer?.buttonAction?.disabled).toBe(true)
  })

  it('offers no options while purpose data is pending or the client response has no results', async () => {
    boundary.purpose.mockReturnValue({
      queryKey: ['pending-purpose'],
      queryFn: () => new Promise(() => undefined),
    })
    boundary.list.mockReturnValue({ queryKey: ['empty-clients'], queryFn: async () => ({}) })
    const { rerender, onClose } = renderDrawer()
    const user = userEvent.setup()
    await user.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    await act(async () => {
      queryClient.setQueryData(['pending-purpose'], { clients: [] })
    })
    rerender(<PurposeAddClientDrawer purposeId="purpose-id" isOpen onClose={onClose} />)
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(boundary.add).not.toHaveBeenCalled()
  })
})
