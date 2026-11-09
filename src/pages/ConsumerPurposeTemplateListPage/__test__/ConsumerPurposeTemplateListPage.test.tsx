import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposeTemplateListPage from '../ConsumerPurposeTemplateList.page'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as Stores from '@/stores'
import * as Router from '@/router'
import * as Table from '../components/ConsumerPurposeTemplateTable'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { EServiceQueries } from '@/api/eservice'
import { queryClient } from '@/config/query-client'
import { queryOptions } from '@tanstack/react-query'
import { createMockEServiceCatalog } from '../../../../__mocks__/data/eservice.mocks'
import type {
  CatalogEServices,
  CreatorPurposeTemplates,
  GetEServicesCatalogParams,
  GetCreatorPurposeTemplatesParams,
} from '@/api/api.generatedTypes'

mockUseJwt()

vi.mock('../ConsumerPurposeTemplateTable', () => ({
  ConsumerPurposeTemplateTable: () => <div>purpose-template-table</div>,
  ConsumerPurposeTemplateTableSkeleton: () => <div>purpose-template-table-skeleton</div>,
}))

describe('ConsumerPurposeTemplateListPage', () => {
  beforeEach(() => {
    renderWithApplicationContext(<ConsumerPurposeTemplateListPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
  })

  // describe('ConsumerPurposeTemplateListPage is loading data', () => {
  //   it.only('Should be render the skeleton at the beginning', () => {
  //     expect(screen.getByText('purpose-template-table-skeleton')).toBeInTheDocument()
  //   })
  // }) TODO: IT'S NOT WORKING

  describe('Purpose Template list page', () => {
    it('should be visibile Purpose Template list page with title, the table and create button', () => {
      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('createNewBtn')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })

  it('should open the dialog when clicking the create button', async () => {
    const createButton = screen.getByText('createNewBtn')
    await userEvent.click(createButton)

    expect(await screen.findByTestId('create-purpose-modal')).toBeInTheDocument()
  })

  it('should be have four columns (intended target, purpose template, status, actions)', () => {
    expect(screen.getAllByRole('columnheader')).toHaveLength(4)
  })
})

describe('ConsumerPurposeTemplateListPage draft lifecycle', () => {
  const createDraft = vi.fn()
  const navigate = vi.fn()
  const openDialog = vi.fn()

  beforeEach(() => {
    queryClient.clear()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-30T12:30:00Z'))
    mockUseJwt()
    createDraft.mockReset().mockResolvedValue({ id: 'template-id' })
    navigate.mockReset()
    openDialog.mockReset()
    vi.spyOn(PurposeTemplateMutations, 'useCreateDraft').mockReturnValue({
      mutateAsync: createDraft,
    } as unknown as ReturnType<typeof PurposeTemplateMutations.useCreateDraft>)
    vi.spyOn(Router, 'useNavigate').mockReturnValue(navigate)
    vi.spyOn(Stores, 'useDialog').mockReturnValue({ openDialog, closeDialog: vi.fn() })
    vi.spyOn(EServiceQueries, 'getCatalogList').mockReturnValue(
      queryOptions<
        CatalogEServices,
        Error,
        CatalogEServices,
        Array<string | GetEServicesCatalogParams>
      >({
        queryKey: ['catalog-options'],
        queryFn: async () => ({
          results: [createMockEServiceCatalog({ id: 'eservice-id', name: 'Published service' })],
          pagination: { offset: 0, limit: 50, totalCount: 1 },
        }),
      })
    )
    vi.spyOn(PurposeTemplateQueries, 'getConsumerPurposeTemplatesList').mockReturnValue(
      queryOptions<
        CreatorPurposeTemplates,
        Error,
        CreatorPurposeTemplates,
        Array<string | GetCreatorPurposeTemplatesParams>
      >({
        queryKey: ['templates'],
        queryFn: async () => ({ results: [], pagination: { offset: 0, limit: 50, totalCount: 0 } }),
      })
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  function renderPage() {
    return renderWithApplicationContext(<ConsumerPurposeTemplateListPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
  }

  async function getConfirmation() {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'createNewBtn' }))
    expect(openDialog).toHaveBeenCalledTimes(1)
    expect(openDialog).toHaveBeenCalledWith({
      type: 'tenantKindPurposeTemplate',
      onConfirm: expect.any(Function),
    })
    return openDialog.mock.calls[0][0].onConfirm as (
      tenantKind: 'PA' | 'PRIVATE',
      handlesPersonalData: boolean
    ) => Promise<void>
  }

  it('creates the selected tenant/data draft and navigates only after success', async () => {
    let resolve!: (value: { id: string }) => void
    createDraft.mockImplementationOnce(
      () =>
        new Promise<{ id: string }>((done) => {
          resolve = done
        })
    )
    renderPage()
    const confirm = await getConfirmation()
    expect(createDraft).not.toHaveBeenCalled()
    let submission!: Promise<void>
    act(() => {
      submission = confirm('PA', true)
    })
    const date = new Intl.DateTimeFormat('it', { dateStyle: 'short', timeStyle: 'short' })
      .format()
      .replace(',', '')
    expect(createDraft).toHaveBeenCalledWith({
      targetDescription: 'intendedTarget',
      targetTenantKind: 'PA',
      purposeTitle: `Template finalità ${date}`,
      purposeDescription: 'description',
      purposeIsFreeOfCharge: true,
      purposeFreeOfChargeReason: 'freeOfChargeReason',
      purposeDailyCalls: 1,
      handlesPersonalData: true,
    })
    expect(navigate).not.toHaveBeenCalled()
    await act(async () => {
      resolve({ id: 'created-template' })
      await submission
    })
    expect(navigate).toHaveBeenCalledExactlyOnceWith('SUBSCRIBE_PURPOSE_TEMPLATE_EDIT', {
      params: { purposeTemplateId: 'created-template' },
    })
  })

  it('propagates failure without navigating and preserves arguments for a successful retry', async () => {
    const error = new Error('draft unavailable')
    createDraft.mockRejectedValueOnce(error)
    renderPage()
    const confirm = await getConfirmation()
    await act(async () => {
      await expect(confirm('PRIVATE', false)).rejects.toBe(error)
    })
    expect(navigate).not.toHaveBeenCalled()
    await act(async () => {
      await confirm('PRIVATE', false)
    })
    expect(createDraft).toHaveBeenCalledTimes(2)
    expect(createDraft.mock.calls[0][0]).toEqual(createDraft.mock.calls[1][0])
    expect(createDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({ targetTenantKind: 'PRIVATE', handlesPersonalData: false })
    )
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it('keeps read-only users on the list without a create action', async () => {
    mockUseJwt({ isAdmin: false })
    renderPage()
    expect(screen.getByText('title')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'createNewBtn' })).not.toBeInTheDocument()
    expect(createDraft).not.toHaveBeenCalled()
    expect(openDialog).not.toHaveBeenCalled()
  })

  it('renders the loading boundary while list data is pending', () => {
    vi.spyOn(Table, 'ConsumerPurposeTemplateTableSkeleton').mockReturnValue(
      <div>Loading templates</div>
    )
    vi.spyOn(PurposeTemplateQueries, 'getConsumerPurposeTemplatesList').mockReturnValue(
      queryOptions<
        CreatorPurposeTemplates,
        Error,
        CreatorPurposeTemplates,
        Array<string | GetCreatorPurposeTemplatesParams>
      >({
        queryKey: ['pending-templates'],
        queryFn: () => new Promise<CreatorPurposeTemplates>(() => undefined),
      })
    )
    renderPage()
    expect(screen.getByText('Loading templates')).toBeVisible()
    expect(navigate).not.toHaveBeenCalled()
  })
})
