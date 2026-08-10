import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { DialogBlockArchivingRequest } from '../DialogBlockArchivingRequest'

const mockCloseDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

describe('DialogBlockArchivingRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, description and go-back action', () => {
    renderWithApplicationContext(<DialogBlockArchivingRequest />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.goBack' })).toBeInTheDocument()
  })

  it('closes the dialog when clicking go back', async () => {
    renderWithApplicationContext(<DialogBlockArchivingRequest />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByRole('button', { name: 'actions.goBack' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })
})
