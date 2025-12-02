import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposeTemplateListPage from '../ConsumerPurposeTemplateList.page'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
