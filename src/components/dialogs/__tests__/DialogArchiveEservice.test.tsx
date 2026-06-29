import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DialogArchiveEservice from '../DialogArchiveEservice'
import type { DialogArchiveEserviceProps } from '@/types/dialog.types'
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
    useScheduleArchiveEservice: () => ({ mutate: mockScheduleArchive }),
  },
}))

const renderDialog = (overrides: Partial<DialogArchiveEserviceProps> = {}) => {
  const props: DialogArchiveEserviceProps = {
    type: 'archiveEservice',
    eserviceId: 'eservice-id',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogArchiveEservice {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogArchiveEservice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ADVISE step with cancel and forward buttons', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.forward' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('closes the dialog when clicking cancel on ADVISE step without calling the mutation', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockScheduleArchive).not.toHaveBeenCalled()
  })

  it('moves to CONFIRM step with back and archive buttons + reason input when clicking forward', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.forward' }))
    expect(screen.getByRole('button', { name: 'actions.back' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'archive' })).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('returns to ADVISE step when clicking back on CONFIRM step', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.forward' }))
    await userEvent.click(screen.getByRole('button', { name: 'actions.back' }))
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.forward' })).toBeInTheDocument()
  })

  it('does not invoke the mutation when submitting an empty reason (validation fails)', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.forward' }))
    await userEvent.click(screen.getByRole('button', { name: 'archive' }))
    expect(mockScheduleArchive).not.toHaveBeenCalled()
  })

  it('invokes the schedule archive mutation with eserviceId and reason when submitting a valid reason', async () => {
    renderDialog({ eserviceId: 'eservice-42' })

    await userEvent.click(screen.getByRole('button', { name: 'actions.forward' }))
    await userEvent.type(screen.getByRole('textbox'), 'Sostituito da nuova versione integrata')
    await userEvent.click(screen.getByRole('button', { name: 'archive' }))
    expect(mockScheduleArchive).toHaveBeenCalledTimes(1)
    expect(mockScheduleArchive).toHaveBeenCalledWith(
      { eserviceId: 'eservice-42', archivingReason: 'Sostituito da nuova versione integrata' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('closes the dialog after the schedule archive mutation succeeds', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'actions.forward' }))
    await userEvent.type(screen.getByRole('textbox'), 'Sostituito da nuova versione')
    await userEvent.click(screen.getByRole('button', { name: 'archive' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })
})
