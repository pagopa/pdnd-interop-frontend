import { render, screen } from '@testing-library/react'
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
})
