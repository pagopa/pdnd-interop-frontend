import type { DialogDelegatorRejectArchivingEServiceProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DialogDelegatorRejectArchivingEService from '../DialogDelegatorRejectArchivingEService'

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

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useRejectDelegatedArchivingEServiceRequest: () => ({
      mutate: mockRejectArchiveEServiceRequest,
    }),
  },
}))

const renderDialog = (overrides: Partial<DialogDelegatorRejectArchivingEServiceProps> = {}) => {
  const props: DialogDelegatorRejectArchivingEServiceProps = {
    type: 'delegatorRejectArchivingEService',
    eserviceId: 'eservice-id',
    delegatedName: 'delegated-name',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogDelegatorRejectArchivingEService {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogDelegatorRejectArchivingEService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders DialogDelegatorRejectArchivingEService', async () => {
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
    expect(mockRejectArchiveEServiceRequest).toBeCalled()
  })
})
