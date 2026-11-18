import type { ComponentProps } from 'react'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { Drawer } from '@/components/shared/Drawer'
import { DelegationAvailabilityDrawer } from '../DelegationAvailabilityDrawer'

const boundary = vi.hoisted(() => ({
  update: vi.fn(),
  drawer: undefined as ComponentProps<typeof Drawer> | undefined,
}))

vi.mock('@/api/tenant', () => ({
  TenantMutations: { useUpdateTenantDelegatedFeatures: () => ({ mutateAsync: boundary.update }) },
}))

vi.mock('@/components/shared/Drawer', () => ({
  Drawer: (props: ComponentProps<typeof Drawer>) => {
    boundary.drawer = props
    return props.isOpen ? <section>{props.children}</section> : null
  },
}))

describe('DelegationAvailabilityDrawer', () => {
  beforeEach(() => {
    boundary.update.mockReset().mockResolvedValue(undefined)
  })

  function renderDrawer(producer = false, consumer = false) {
    const onClose = vi.fn()
    const props = {
      isOpen: true,
      onClose,
      isAvailableProducerDelegations: producer,
      isAvailableConsumerDelegations: consumer,
    }
    return {
      ...renderWithApplicationContext(<DelegationAvailabilityDrawer {...props} />, {}),
      props,
      onClose,
    }
  }

  it('closes unchanged availability locally without a mutation', async () => {
    const { onClose } = renderDrawer(true, false)
    expect(screen.getByRole('checkbox', { name: 'produceDelegation.value.true' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'consumeDelegation.value.true' })).not.toBeChecked()
    await act(async () => boundary.drawer?.buttonAction?.action())
    expect(boundary.update).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('awaits both changed flags, retains them on rejection, and closes once after retry', async () => {
    const user = userEvent.setup()
    const { onClose } = renderDrawer()
    let reject!: (reason: Error) => void
    boundary.update.mockImplementationOnce(
      () =>
        new Promise<void>((_, rejectPromise) => {
          reject = rejectPromise
        })
    )
    await user.click(screen.getByRole('checkbox', { name: 'consumeDelegation.value.true' }))
    await user.click(screen.getByRole('checkbox', { name: 'produceDelegation.value.true' }))
    let submission!: Promise<unknown>
    act(() => {
      submission = boundary.drawer!.buttonAction!.action() as Promise<unknown>
    })
    expect(boundary.update).toHaveBeenCalledWith({
      isDelegatedConsumerFeatureEnabled: true,
      isDelegatedProducerFeatureEnabled: true,
    })
    expect(onClose).not.toHaveBeenCalled()
    const failure = new Error('unavailable')
    await act(async () => {
      reject(failure)
      await expect(submission).rejects.toBe(failure)
    })
    expect(onClose).not.toHaveBeenCalled()
    expect(
      screen.getAllByRole('checkbox').every((input) => (input as HTMLInputElement).checked)
    ).toBe(true)
    await act(async () => boundary.drawer?.buttonAction?.action())
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(boundary.update).toHaveBeenCalledTimes(2)
  })

  it('waits for a successful consumer-only change before closing', async () => {
    const user = userEvent.setup()
    const { onClose } = renderDrawer(true, false)
    let resolve!: () => void
    boundary.update.mockImplementationOnce(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    await user.click(screen.getByRole('checkbox', { name: 'consumeDelegation.value.true' }))
    let submission!: Promise<unknown>
    act(() => {
      submission = boundary.drawer!.buttonAction!.action() as Promise<unknown>
    })
    expect(onClose).not.toHaveBeenCalled()
    await act(async () => {
      resolve()
      await submission
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('restores both authoritative flags on cancel and accepts updated flags while closed', async () => {
    const user = userEvent.setup()
    const { props, rerender, onClose } = renderDrawer()
    await user.click(screen.getByRole('checkbox', { name: 'consumeDelegation.value.true' }))
    await user.click(screen.getByRole('checkbox', { name: 'produceDelegation.value.true' }))
    act(() => boundary.drawer?.onClose())
    expect(onClose).toHaveBeenCalledTimes(1)
    rerender(<DelegationAvailabilityDrawer {...props} isOpen={false} />)
    rerender(<DelegationAvailabilityDrawer {...props} />)
    expect(screen.getByRole('checkbox', { name: 'consumeDelegation.value.true' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'produceDelegation.value.true' })).not.toBeChecked()
    rerender(
      <DelegationAvailabilityDrawer {...props} isOpen={false} isAvailableProducerDelegations />
    )
    rerender(<DelegationAvailabilityDrawer {...props} isAvailableProducerDelegations />)
    expect(screen.getByRole('checkbox', { name: 'produceDelegation.value.true' })).toBeChecked()
    expect(boundary.update).not.toHaveBeenCalled()
  })
})
