import type { DialogDelegatorConfirmArchivingVersionProps } from '@/types/dialog.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DialogDelegatorConfirmArchivingVersion from '../DialogDelegatorConfirmArchivingVersion'

const mockCloseDialog = vi.fn()
const mockOpenDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: mockOpenDialog }),
  }
})

const mockApproveArchiveVersionRequest = vi.fn((_params, options) => {
  options?.onSuccess?.()
})

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useApproveDelegatedArchivingVersionRequest: () => ({
      mutate: mockApproveArchiveVersionRequest,
    }),
  },
}))

const renderDialog = (overrides: Partial<DialogDelegatorConfirmArchivingVersionProps> = {}) => {
  const props: DialogDelegatorConfirmArchivingVersionProps = {
    type: 'delegatorConfirmArchivingVersion',
    eserviceId: 'eservice-id',
    descriptorId: 'descriptor-id',
    delegatedName: 'delegated-name',
    gracePeriodDays: 60,
    ...overrides,
  }
  return renderWithApplicationContext(<DialogDelegatorConfirmArchivingVersion {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogDelegatorConfirmArchivingVersion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders DialogDelegatorConfirmArchivingVersion', async () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.version.title')).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.firstParagraph')
    ).toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.secondParagraph')
    ).toBeInTheDocument()
  })

  it('check for function call on button  click', async () => {
    renderDialog()

    const button = screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockApproveArchiveVersionRequest).toBeCalled()
  })
})
