import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArchivingDetailsDrawer } from '../ArchivingDetailsDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const renderDrawer = (
  overrides: {
    isOpen?: boolean
    archivingReason?: string | undefined
    onClose?: VoidFunction
  } = {}
) => {
  const onClose = overrides.onClose ?? vi.fn()
  return {
    onClose,
    ...renderWithApplicationContext(
      <ArchivingDetailsDrawer
        isOpen={overrides.isOpen ?? true}
        onClose={onClose}
        archivingReason={overrides.archivingReason}
      />,
      { withRouterContext: true }
    ),
  }
}

describe('ArchivingDetailsDrawer', () => {
  it('does not show drawer content when isOpen is false', () => {
    renderDrawer({ isOpen: false, archivingReason: 'a reason' })
    expect(screen.queryByRole('presentation')).toBeNull()
  })

  it('renders the archiving reason when provided', () => {
    renderDrawer({ isOpen: true, archivingReason: 'Mandato di archiviazione amministrativo' })
    expect(screen.getByText('Mandato di archiviazione amministrativo')).toBeInTheDocument()
  })

  it('renders the placeholder when archivingReason is undefined', () => {
    renderDrawer({ isOpen: true, archivingReason: undefined })
    expect(screen.getByText('reasonPlaceholder')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    renderDrawer({ isOpen: true, archivingReason: 'a reason', onClose })
    const closeButton = screen.getByLabelText('closeIconAriaLabel')
    await userEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })
})
