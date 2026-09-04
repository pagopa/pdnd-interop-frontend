import type { DialogDelegatorConfirmArchivingEServiceProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DialogDelegatorConfirmArchivingEService from '../DialogDelegatorConfirmArchivingEService'

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

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useApproveDelegatedArchivingEServiceRequest: () => ({
      mutate: mockApproveArchiveEServiceRequest,
    }),
  },
}))

const renderDialog = (overrides: Partial<DialogDelegatorConfirmArchivingEServiceProps> = {}) => {
  const props: DialogDelegatorConfirmArchivingEServiceProps = {
    type: 'delegatorConfirmArchivingEService',
    eserviceId: 'eservice-id',
    delegatedName: 'delegated-name',
    gracePeriodDays: 60,
    ...overrides,
  }
  return renderWithApplicationContext(<DialogDelegatorConfirmArchivingEService {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogDelegatorConfirmArchivingEService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('render DialogConfirmArchivingDelegated', async () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.eservice.title')).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.firstParagraph')
    ).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.secondParagraph')
    ).toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockApproveArchiveEServiceRequest).toBeCalled()
  })

  it('check for function call on button  click', async () => {
    renderDialog()

    const button = screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockApproveArchiveEServiceRequest).toBeCalled()
  })
})
