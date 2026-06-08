import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogReactivateArchivingDescriptor } from '../DialogReactivateArchivingDescriptor'
import type { DialogReactivateArchivingDescriptorProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockCloseDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

const mockReactivate = vi.fn((_params, options) => {
  options?.onSuccess?.()
})
vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useReactivateVersion: () => ({ mutate: mockReactivate }),
  },
}))

const renderDialog = (overrides: Partial<DialogReactivateArchivingDescriptorProps> = {}) => {
  const props: DialogReactivateArchivingDescriptorProps = {
    type: 'reactivateArchivingDescriptor',
    eserviceId: 'eservice-id',
    descriptorId: 'descriptor-id',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogReactivateArchivingDescriptor {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogReactivateArchivingDescriptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dialog with cancel and proceed buttons', () => {
    renderDialog()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'proceedLabel' })).toBeInTheDocument()
  })

  it('closes the dialog when clicking cancel without calling the mutation', async () => {
    renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    expect(mockReactivate).not.toHaveBeenCalled()
  })

  it('invokes the reactivate mutation with the correct ids when clicking proceed', async () => {
    renderDialog({ eserviceId: 'eservice-42', descriptorId: 'descriptor-99' })
    await userEvent.click(screen.getByRole('button', { name: 'proceedLabel' }))
    expect(mockReactivate).toHaveBeenCalledTimes(1)
    expect(mockReactivate).toHaveBeenCalledWith(
      { eserviceId: 'eservice-42', descriptorId: 'descriptor-99' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('closes the dialog after the reactivate mutation succeeds', async () => {
    renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'proceedLabel' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })
})
