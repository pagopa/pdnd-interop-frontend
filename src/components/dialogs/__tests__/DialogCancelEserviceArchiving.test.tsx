import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DialogCancelEserviceArchiving from '../DialogCancelEserviceArchiving'
import type { DialogCancelEserviceArchivingProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockCloseDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

const mockCancelArchive = vi.fn((_params, options) => {
  options?.onSuccess?.()
})
vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useCancelEserviceArchiving: () => ({ mutate: mockCancelArchive }),
  },
}))

const renderDialog = (overrides: Partial<DialogCancelEserviceArchivingProps> = {}) => {
  const props: DialogCancelEserviceArchivingProps = {
    type: 'cancelEserviceArchiving',
    eserviceId: 'eservice-id',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogCancelEserviceArchiving {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogCancelEserviceArchiving', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dialog with cancel and destructive cancel-archiving buttons', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.cancelArchiving' })).toBeInTheDocument()
  })

  it('closes the dialog when clicking the outlined cancel button without calling the mutation', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockCancelArchive).not.toHaveBeenCalled()
  })

  it('invokes the cancel archive mutation with the correct eserviceId when clicking the destructive button', async () => {
    renderDialog({ eserviceId: 'eservice-42' })

    await userEvent.click(screen.getByRole('button', { name: 'actions.cancelArchiving' }))
    expect(mockCancelArchive).toHaveBeenCalledTimes(1)
    expect(mockCancelArchive).toHaveBeenCalledWith(
      { eserviceId: 'eservice-42' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('closes the dialog after the cancel archive mutation succeeds', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.cancelArchiving' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })
})
