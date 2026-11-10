import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@mui/material'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import { TempNextDrawer } from '../TempNextDrawer'

const renderDrawer = (props: React.ComponentProps<typeof TempNextDrawer>) =>
  renderWithApplicationContext(<TempNextDrawer {...props} />, {
    withReactQueryContext: true,
  })

describe('TempNextDrawer', () => {
  it('should invoke the action when the button is enabled', async () => {
    const user = userEvent.setup()
    const action = vi.fn()
    renderDrawer({
      isOpen: true,
      onClose: vi.fn(),
      title: 'Update details',
      footerActions: <Button onClick={action}>Save</Button>,
      children: <p>Drawer content</p>,
    })

    const saveButton = screen.getByRole('button', { name: 'Save' })
    expect(saveButton).toBeEnabled()
    await user.click(saveButton)

    expect(action).toHaveBeenCalledOnce()
  })

  it('should render multiple footer actions from the slot', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onSave = vi.fn()
    renderDrawer({
      isOpen: true,
      onClose: vi.fn(),
      title: 'Update details',
      footerActions: (
        <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </>
      ),
      children: <p>Drawer content</p>,
    })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('should invoke onTransitionExited after closing', async () => {
    const onTransitionExited = vi.fn()
    const props = {
      onClose: vi.fn(),
      onTransitionExited,
      title: 'Update details',
      children: <p>Drawer content</p>,
    }
    const { rerender } = renderDrawer({ ...props, isOpen: true })

    rerender(<TempNextDrawer {...props} isOpen={false} />)

    await waitFor(() => expect(onTransitionExited).toHaveBeenCalledOnce())
  })
})
