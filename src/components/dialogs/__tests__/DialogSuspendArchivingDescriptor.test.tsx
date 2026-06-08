import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogSuspendArchivingDescriptor } from '../DialogSuspendArchivingDescriptor'
import type { DialogSuspendArchivingDescriptorProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockCloseDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

const mockSuspend = vi.fn((_params, options) => {
  options?.onSuccess?.()
})
vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useSuspendVersion: () => ({ mutate: mockSuspend }),
  },
}))

const renderDialog = (overrides: Partial<DialogSuspendArchivingDescriptorProps> = {}) => {
  const props: DialogSuspendArchivingDescriptorProps = {
    type: 'suspendArchivingDescriptor',
    eserviceId: 'eservice-id',
    descriptorId: 'descriptor-id',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogSuspendArchivingDescriptor {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogSuspendArchivingDescriptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dialog with cancel and suspend buttons', () => {
    renderDialog()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'suspend' })).toBeInTheDocument()
  })

  it('closes the dialog when clicking cancel without calling the mutation', async () => {
    renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockSuspend).not.toHaveBeenCalled()
  })

  it('invokes the suspend mutation with the correct ids when clicking suspend', async () => {
    renderDialog({ eserviceId: 'eservice-42', descriptorId: 'descriptor-99' })
    await userEvent.click(screen.getByRole('button', { name: 'suspend' }))
    expect(mockSuspend).toHaveBeenCalledTimes(1)
    expect(mockSuspend).toHaveBeenCalledWith(
      { eserviceId: 'eservice-42', descriptorId: 'descriptor-99' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('closes the dialog after the suspend mutation succeeds', async () => {
    renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'suspend' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })
})
