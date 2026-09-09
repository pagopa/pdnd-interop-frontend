import type { DialogDelegatorRejectArchivingProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DialogDelegatorRejectArchiving from '../DialogDelegatorRejectArchiving'

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

const renderDialog = (overrides: Partial<DialogDelegatorRejectArchivingProps> = {}) => {
  const props: DialogDelegatorRejectArchivingProps = {
    type: 'delegatorRejectArchiving',
    eserviceId: 'eservice-id',
    delegatedName: 'delegated-name',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogDelegatorRejectArchiving {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogDelegatorRejectArchiving', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders DialogDelegatorRejectArchivingEService', async () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.title')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.paragraph')).toBeInTheDocument()
    expect(screen.getByText('dialogRejectArchivingDelegated.fieldLabel')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.cancel' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.confirm' })
    ).toBeInTheDocument()
  })

  it('should call function on button click when rejecting eservice archiving request', async () => {
    renderDialog()
    const input = screen.getByRole('textbox', {
      name: /dialogRejectArchivingDelegated\.fieldLabel/i,
    })

    await userEvent.type(input, 'rejection-reason-test-input')
    const button = screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.confirm' })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockRejectArchiveEServiceRequest).toBeCalledWith(
      {
        eserviceId: 'eservice-id',
        rejectionReason: 'rejection-reason-test-input',
      },
      {
        onSuccess: mockCloseDialog,
      }
    )
  })

  it('should call function on button click when rejecting eservice version archiving request', async () => {
    renderDialog({ descriptorId: 'descriptor-id' })
    const input = screen.getByRole('textbox', {
      name: /dialogRejectArchivingDelegated\.fieldLabel/i,
    })

    await userEvent.type(input, 'rejection-reason-test-input')
    const button = screen.getByRole('button', { name: 'dialogRejectArchivingDelegated.confirm' })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockRejectArchiveVersionRequest).toBeCalledWith(
      {
        eserviceId: 'eservice-id',
        descriptorId: 'descriptor-id',
        rejectionReason: 'rejection-reason-test-input',
      },
      {
        onSuccess: mockCloseDialog,
      }
    )
  })
})
