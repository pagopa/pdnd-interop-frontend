import type { DialogRejectArchivingDelegatedProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DialogRejectArchivingDelegated from '../DialogRejectArchivingDelegated'

const mockCloseDialog = vi.fn()
const mockOpenDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: mockOpenDialog }),
  }
})

const mockRejectArchiveEServiceRequest = vi.fn((_params, options) => {
  options?.onSuccess?.()
})
const mockRejectArchiveVersionRequest = vi.fn((_params, options) => {
  options?.onSuccess?.()
})

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useRejectDelegatedArchivingEServiceRequest: () => ({
      mutate: mockRejectArchiveEServiceRequest,
    }),
    useRejectDelegatedArchivingVersionRequest: () => ({
      mutate: mockRejectArchiveVersionRequest,
    }),
  },
}))

const renderDialog = (overrides: Partial<DialogRejectArchivingDelegatedProps> = {}) => {
  const props: DialogRejectArchivingDelegatedProps = {
    type: 'rejectArchivingDelegated',
    eserviceId: 'eservice-id',
    delegatedName: 'delegated-name',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogRejectArchivingDelegated {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogRejectArchivingDelegated', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders DialogRejectArchivingDelegated for eservice', async () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.title')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.paragraph')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.fieldLabel')).toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockRejectArchiveEServiceRequest).toBeCalled()
  })

  it('renders DialogRejectArchivingDelegated for eservice', async () => {
    renderDialog({ descriptorId: 'descriptor-id' })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.title')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.paragraph')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.fieldLabel')).toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockRejectArchiveVersionRequest).toBeCalled()
  })
})
