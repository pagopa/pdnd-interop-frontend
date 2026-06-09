import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogConfirmArchivingAction } from '../DialogConfirmArchivingAction'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockCloseDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

type RenderProps = Partial<React.ComponentProps<typeof DialogConfirmArchivingAction>>

const renderDialog = (overrides: RenderProps = {}) => {
  const props: React.ComponentProps<typeof DialogConfirmArchivingAction> = {
    title: 'Confirm action',
    intro: 'Intro text',
    primaryBulletText: 'Primary bullet',
    archivingNotAffectedBullet: <span>Archiving not affected bullet</span>,
    archivedAfterNoticeText: 'Archived after notice',
    confirmLabel: 'Confirm',
    onConfirm: vi.fn(),
    ...overrides,
  }
  return {
    props,
    ...renderWithApplicationContext(<DialogConfirmArchivingAction {...props} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    }),
  }
}

describe('DialogConfirmArchivingAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, intro, three bullets, cancel and confirm buttons', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm action')).toBeInTheDocument()
    expect(screen.getByText('Intro text')).toBeInTheDocument()
    expect(screen.getByText('Primary bullet')).toBeInTheDocument()
    expect(screen.getByText('Archiving not affected bullet')).toBeInTheDocument()
    expect(screen.getByText('Archived after notice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('closes the dialog when clicking cancel without calling onConfirm', async () => {
    const onConfirm = vi.fn()
    renderDialog({ onConfirm })

    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('invokes onConfirm when clicking the confirm button', async () => {
    const onConfirm = vi.fn()
    renderDialog({ onConfirm })

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('renders the confirm button with error color when confirmColor is "error"', () => {
    renderDialog({ confirmColor: 'error', confirmLabel: 'Suspend' })

    const confirmButton = screen.getByRole('button', { name: 'Suspend' })
    expect(confirmButton).toHaveClass('MuiButton-containedError')
  })
})
