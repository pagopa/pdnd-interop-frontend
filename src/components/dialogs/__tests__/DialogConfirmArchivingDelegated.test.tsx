import type { DialogConfirmArchivingDelegatedProps } from '@/types/dialog.types'
import DialogConfirmArchivingDelegated from '../DialogConfirmArchivingDelegated'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

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

const renderDialog = (overrides: Partial<DialogConfirmArchivingDelegatedProps> = {}) => {
  const props: DialogConfirmArchivingDelegatedProps = {
    type: 'confirmArchivingDelegated',
    eserviceId: 'eservice-id',
    delegatedName: 'delegated-name',
    gracePeriodDays: 60,
    ...overrides,
  }
  return renderWithApplicationContext(<DialogConfirmArchivingDelegated {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogConfirmArchivingDelegated', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders DialogConfirmArchivingDelegated for eservice', async () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.eservice.title')).toBeInTheDocument()
    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.title')
    ).not.toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.firstParagraph')
    ).toBeInTheDocument()
    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.firstParagraph')
    ).not.toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.secondParagraph')
    ).toBeInTheDocument()
    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.secondParagraph')
    ).not.toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockApproveArchiveEServiceRequest).toBeCalled()
  })

  it('renders DialogConfirmArchivingDelegated for eservice version', async () => {
    renderDialog({ descriptorId: 'descriptor-id' })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('dialogConfirmArchivingDelegated.version.title')).toBeInTheDocument()
    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.title')
    ).not.toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.firstParagraph')
    ).toBeInTheDocument()
    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.firstParagraph')
    ).not.toBeInTheDocument()

    expect(
      screen.getByText('dialogConfirmArchivingDelegated.version.secondParagraph')
    ).toBeInTheDocument()
    expect(
      screen.getByText('dialogConfirmArchivingDelegated.eservice.secondParagraph')
    ).not.toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.cancel' })
    expect(button).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'dialogConfirmArchivingDelegated.confirm' })
    ).toBeInTheDocument()
    await userEvent.click(button)
    expect(mockApproveArchiveVersionRequest).toBeCalled()
  })
})
