import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogArchiveVersion } from '../DialogArchiveVersion'
import type { DialogArchiveVersionProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockCloseDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

const mockScheduleArchive = vi.fn((_params, options) => {
  options?.onSuccess?.()
})
vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useScheduleArchiveDescriptor: () => ({ mutate: mockScheduleArchive }),
  },
}))

const renderDialog = (overrides: Partial<DialogArchiveVersionProps> = {}) => {
  const props: DialogArchiveVersionProps = {
    type: 'archiveVersion',
    eserviceId: 'eservice-id',
    descriptorId: 'descriptor-id',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogArchiveVersion {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogArchiveVersion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dialog with title, description, alert, cancel and archive buttons', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'archive' })).toBeInTheDocument()
  })

  it('closes the dialog when clicking the cancel button without calling the mutation', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockScheduleArchive).not.toHaveBeenCalled()
  })

  it('invokes the schedule archive mutation with the correct ids when clicking the archive button', async () => {
    renderDialog({ eserviceId: 'eservice-42', descriptorId: 'descriptor-99' })

    await userEvent.click(screen.getByRole('button', { name: 'archive' }))
    expect(mockScheduleArchive).toHaveBeenCalledTimes(1)
    expect(mockScheduleArchive).toHaveBeenCalledWith(
      { eserviceId: 'eservice-42', descriptorId: 'descriptor-99' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('closes the dialog after the schedule archive mutation succeeds', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'archive' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })
})
