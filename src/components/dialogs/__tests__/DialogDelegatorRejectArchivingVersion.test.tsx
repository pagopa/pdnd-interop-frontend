import type { DialogDelegatorRejectArchivingVersionProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DialogDelegatorRejectArchivingVersion from '../DialogDelegatorRejectArchivingVersion'

const mockCloseDialog = vi.fn()
const mockOpenDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: mockOpenDialog }),
  }
})

const mockRejectArchiveVersionRequest = vi.fn((_params, options) => {
  options?.onSuccess?.()
})

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useRejectDelegatedArchivingVersionRequest: () => ({
      mutate: mockRejectArchiveVersionRequest,
    }),
  },
}))

const renderDialog = (overrides: Partial<DialogDelegatorRejectArchivingVersionProps> = {}) => {
  const props: DialogDelegatorRejectArchivingVersionProps = {
    type: 'delegatorRejectArchivingVersion',
    descriptorId: 'descriptor-id',
    eserviceId: 'eservice-id',
    delegatedName: 'delegated-name',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogDelegatorRejectArchivingVersion {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogDelegatorRejectArchivingVersion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders DialogRejectArchivingDelegated', async () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.title')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.paragraph')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.fieldLabel')).toBeInTheDocument()
  })

  it('check for function call on button click', async () => {
    renderDialog()

    const button = screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockRejectArchiveVersionRequest).toBeCalled()
  })
})
