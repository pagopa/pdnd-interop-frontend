import type { DialogDelegatorConfirmArchivingProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DialogDelegatorConfirmArchiving from '../DialogDelegatorConfirmArchiving'

const mockCloseDialog = vi.fn()
const mockOpenDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: mockOpenDialog }),
  }
})

const mockApproveArchiveEServiceRequest = vi.fn((_params, options) => {
  options?.onSuccess?.()
})

const mockApproveArchiveVersionRequest = vi.fn((_params, options) => {
  options?.onSuccess?.()
})

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useApproveDelegatedArchivingEServiceRequest: () => ({
      mutate: mockApproveArchiveEServiceRequest,
    }),
    useApproveDelegatedArchivingVersionRequest: () => ({
      mutate: mockApproveArchiveVersionRequest,
    }),
  },
}))

const renderDialog = (overrides: Partial<DialogDelegatorConfirmArchivingProps> = {}) => {
  const props: DialogDelegatorConfirmArchivingProps = {
    type: 'delegatorConfirmArchiving',
    eserviceId: 'eservice-id',
    delegatedName: 'delegated-name',
    gracePeriodDays: 60,
    ...overrides,
  }
  return renderWithApplicationContext(<DialogDelegatorConfirmArchiving {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogDelegatorConfirmArchiving', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('render DialogDelegatorConfirmArchiving for eservice archiving request', async () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.eservice.title')).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.firstParagraph')
    ).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.secondParagraph')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.cancel' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    ).toBeInTheDocument()
  })

  it('renders DialogDelegatorConfirmArchiving for eservice version archiving request', async () => {
    renderDialog({ descriptorId: 'descriptor-id' })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.version.title')).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.firstParagraph')
    ).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.secondParagraph')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.cancel' })
    ).toBeInTheDocument()
  })

  it('should call function on button click when confirming eservice archiving request', async () => {
    renderDialog()

    const button = screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockApproveArchiveEServiceRequest).toBeCalled()
  })

  it('should call function on button click when  confirming eservice version archiving request', async () => {
    renderDialog({ descriptorId: 'descriptor-id' })

    const button = screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockApproveArchiveVersionRequest).toBeCalled()
  })
})
