import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Drawer } from '../Drawer'
import { beforeEach, vi } from 'vitest'
import { Typography } from '@mui/material'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import userEvent from '@testing-library/user-event'

describe('Drawer test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Should not render when isOpen is false', () => {
    const { container } = render(
      <Drawer isOpen={false} onClose={vi.fn()} title="test title">
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should disable the action button for support users', () => {
    render(
      <SupportActionGuardProvider isSupport>
        <Drawer
          isOpen
          onClose={vi.fn()}
          title="test title"
          buttonAction={{ label: 'Confirm', action: vi.fn() }}
        >
          <Typography>TEST CHILDREN</Typography>
        </Drawer>
      </SupportActionGuardProvider>
    )

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  })

  it('should explain when the action button is disabled for support users', async () => {
    const user = userEvent.setup()

    render(
      <SupportActionGuardProvider isSupport>
        <Drawer
          isOpen
          onClose={vi.fn()}
          title="test title"
          buttonAction={{ label: 'Confirm', action: vi.fn() }}
        >
          <Typography>TEST CHILDREN</Typography>
        </Drawer>
      </SupportActionGuardProvider>
    )

    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    await user.hover(confirmButton.parentElement!)

    expect(await screen.findByText('supportDisableInfo')).toBeVisible()
  })

  it('keeps the drawer open when an async action rejects', async () => {
    const user = userEvent.setup()
    const mutation = vi.fn().mockRejectedValue(new Error('request failed'))
    const onClose = vi.fn()

    render(
      <Drawer
        isOpen
        onClose={onClose}
        title="test title"
        buttonAction={{
          label: 'Confirm',
          action: async () => {
            await mutation()
            onClose()
          },
        }}
      >
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => expect(mutation).toHaveBeenCalledOnce())
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByText('TEST CHILDREN')).toBeInTheDocument()
  })

  it('closes the drawer after an async action succeeds', async () => {
    const user = userEvent.setup()
    const mutation = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()

    render(
      <Drawer
        isOpen
        onClose={onClose}
        title="test title"
        buttonAction={{
          label: 'Confirm',
          action: async () => {
            await mutation()
            onClose()
          },
        }}
      >
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
  })
})
