import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogCancelVersionArchiving } from '../DialogCancelVersionArchiving'
import type { DialogCancelVersionArchivingProps } from '@/types/dialog.types'
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
const mockCancelArchiveRequest = vi.fn((_params, options) => {
  options?.onSuccess?.()
})
vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useCancelDescriptorArchiving: () => ({ mutate: mockCancelArchive }),
    useCancelDelegatedArchivingRequest: () => ({ mutate: mockCancelArchiveRequest }),
  },
}))

const renderDialog = (overrides: Partial<DialogCancelVersionArchivingProps> = {}) => {
  const props: DialogCancelVersionArchivingProps = {
    type: 'cancelVersionArchiving',
    eserviceId: 'eservice-id',
    descriptorId: 'descriptor-id',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogCancelVersionArchiving {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogCancelVersionArchiving', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dialog with title, description, keep and cancel-archiving buttons', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.keepArchiving' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.cancelArchiving' })).toBeInTheDocument()
  })

  it('renders delegate-specific action labels when opened in delegation context', () => {
    renderDialog({ isDelegate: true, delegatorName: 'Comune di Milano' })

    expect(
      screen.getByRole('button', { name: 'actions.keepArchivingDelegate' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'actions.cancelArchivingDelegate' })
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('alertDelegate')
    expect(screen.getByRole('button', { name: 'actions.cancelArchivingDelegate' })).toHaveClass(
      'MuiButton-containedPrimary'
    )
  })

  it('renders approved delegate copy and close-only actions when archivingApproved is true', () => {
    renderDialog({
      isDelegate: true,
      delegatorName: 'Comune di Milano',
      archivingApproved: true,
      archivingDate: '2025-01-27T00:00:00.000Z',
    })

    expect(screen.getByRole('button', { name: 'actions.cancelApproved' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.closeApproved' })).toBeInTheDocument()
  })

  it('does not call cancel mutation when archivingApproved is true and user clicks either action', async () => {
    renderDialog({
      isDelegate: true,
      delegatorName: 'Comune di Milano',
      archivingApproved: true,
      archivingDate: '2025-01-27T00:00:00.000Z',
    })

    await userEvent.click(screen.getByRole('button', { name: 'actions.cancelApproved' }))
    await userEvent.click(screen.getByRole('button', { name: 'actions.closeApproved' }))

    expect(mockCancelArchive).not.toHaveBeenCalled()
    expect(mockCancelArchiveRequest).not.toHaveBeenCalled()
    expect(mockCloseDialog).toHaveBeenCalledTimes(2)
  })

  it('closes the dialog when clicking the keep-archiving button without calling the mutation', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.keepArchiving' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockCancelArchive).not.toHaveBeenCalled()
    expect(mockCancelArchiveRequest).not.toHaveBeenCalled()
  })

  it('invokes delegated cancel request mutation when clicking cancel in delegate mode', async () => {
    renderDialog({ isDelegate: true, eserviceId: 'eservice-42', descriptorId: 'descriptor-99' })

    await userEvent.click(screen.getByRole('button', { name: 'actions.cancelArchivingDelegate' }))
    expect(mockCancelArchiveRequest).toHaveBeenCalledTimes(1)
    expect(mockCancelArchiveRequest).toHaveBeenCalledWith(
      { eserviceId: 'eservice-42' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockCancelArchive).not.toHaveBeenCalled()
  })

  it('invokes the cancel archive mutation with the correct ids when clicking the cancel-archiving button', async () => {
    renderDialog({ eserviceId: 'eservice-42', descriptorId: 'descriptor-99' })

    await userEvent.click(screen.getByRole('button', { name: 'actions.cancelArchiving' }))
    expect(mockCancelArchive).toHaveBeenCalledTimes(1)
    expect(mockCancelArchive).toHaveBeenCalledWith(
      { eserviceId: 'eservice-42', descriptorId: 'descriptor-99' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockCancelArchiveRequest).not.toHaveBeenCalled()
  })

  it('closes the dialog after the cancel archive mutation succeeds', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.cancelArchiving' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })
})
