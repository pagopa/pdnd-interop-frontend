import { render, screen } from '@testing-library/react'
import React from 'react'
import { Drawer } from '../Drawer'
import { beforeEach, vi } from 'vitest'
import { Typography } from '@mui/material'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'

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
})
