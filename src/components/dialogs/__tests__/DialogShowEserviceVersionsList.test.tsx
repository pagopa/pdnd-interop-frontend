import React from 'react'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogShowEserviceVersionsList } from '../DialogShowEserviceVersionsList/DialogShowEserviceVersionsList'
import type { DialogShowEserviceVersionsListProps } from '@/types/dialog.types'
import type { CompactDescriptorWithArchivingSchedule } from '@/types/eservice.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockCloseDialog = vi.fn()
vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof import('@/stores')>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: mockCloseDialog, openDialog: vi.fn() }),
  }
})

const makeDescriptor = (
  overrides: Partial<CompactDescriptorWithArchivingSchedule>
): CompactDescriptorWithArchivingSchedule => ({
  id: 'descriptor-id',
  version: '1',
  state: 'PUBLISHED',
  audience: [],
  ...overrides,
})

const renderDialog = (overrides: Partial<DialogShowEserviceVersionsListProps> = {}) => {
  const props: DialogShowEserviceVersionsListProps = {
    type: 'showEserviceVersionsList',
    eserviceId: 'eservice-id',
    eserviceName: 'My eservice',
    descriptors: [],
    routeKey: 'PROVIDE_ESERVICE_MANAGE',
    ...overrides,
  }
  return renderWithApplicationContext(<DialogShowEserviceVersionsList {...props} />, {
    withRouterContext: true,
  })
}

describe('DialogShowEserviceVersionsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title, the eservice name and the close button', () => {
    renderDialog({ descriptors: [makeDescriptor({ id: 'd1', version: '1' })] })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('My eservice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'closeBtn' })).toBeInTheDocument()
  })

  it('hides DRAFT and WAITING_FOR_APPROVAL descriptors', () => {
    renderDialog({
      descriptors: [
        makeDescriptor({ id: 'd1', version: '1', state: 'PUBLISHED' }),
        makeDescriptor({ id: 'd2', version: '2', state: 'DRAFT' }),
        makeDescriptor({ id: 'd3', version: '3', state: 'WAITING_FOR_APPROVAL' }),
      ],
    })

    const rows = screen.getAllByRole('link')
    expect(rows).toHaveLength(1)
  })

  it('sorts descriptors by version ascending', () => {
    renderDialog({
      descriptors: [
        makeDescriptor({ id: 'd-three', version: '3', state: 'PUBLISHED' }),
        makeDescriptor({ id: 'd-one', version: '1', state: 'ARCHIVED' }),
        makeDescriptor({ id: 'd-two', version: '2', state: 'DEPRECATED' }),
      ],
    })

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('d-one'))
    expect(links[1]).toHaveAttribute('href', expect.stringContaining('d-two'))
    expect(links[2]).toHaveAttribute('href', expect.stringContaining('d-three'))
  })

  it('closes the dialog when clicking the close button', async () => {
    renderDialog({ descriptors: [makeDescriptor({ id: 'd1', version: '1' })] })

    await userEvent.click(screen.getByRole('button', { name: 'closeBtn' }))
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })

  it('closes the dialog when clicking a version link', async () => {
    renderDialog({ descriptors: [makeDescriptor({ id: 'd1', version: '1' })] })

    await userEvent.click(screen.getByRole('link'))
    expect(mockCloseDialog).toHaveBeenCalled()
  })

  it('shows the scheduled-archival badge for ARCHIVING_SUSPENDED descriptors', () => {
    renderDialog({
      descriptors: [
        makeDescriptor({
          id: 'd1',
          version: '1',
          state: 'ARCHIVING_SUSPENDED',
          archivingSchedule: { archivableOn: '2026-12-31', scope: 'Descriptor' },
        }),
      ],
    })

    const row = screen.getByRole('link').closest('div')!
    expect(within(row).getByTestId('ArchiveIcon')).toBeInTheDocument()
  })

  it('does not show the archival badge for non-archiving states', () => {
    renderDialog({
      descriptors: [makeDescriptor({ id: 'd1', version: '1', state: 'PUBLISHED' })],
    })

    expect(screen.queryByTestId('ArchiveIcon')).not.toBeInTheDocument()
  })
})
