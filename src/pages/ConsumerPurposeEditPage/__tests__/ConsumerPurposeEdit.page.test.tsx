import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import ConsumerPurposeEditPage from '../ConsumerPurposeEdit.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

mockUseJwt()
mockUseParams({ purposeId: 'test-purpose-id' })

vi.mock('../components/PurposeEditStepGeneral', () => ({
  PurposeEditStepGeneral: () => <div>PurposeEditStepGeneral</div>,
}))
vi.mock('../components/PurposeEditStepAssignment', () => ({
  PurposeEditStepAssignment: () => <div>PurposeEditStepAssignment</div>,
}))
vi.mock('../components/PurposeEditStepRiskAnalysis', () => ({
  PurposeEditStepRiskAnalysis: () => <div>PurposeEditStepRiskAnalysis</div>,
}))

const useQueryMock = vi.fn()

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

describe('ConsumerPurposeEditPage', () => {
  beforeEach(() => {
    useQueryMock.mockReturnValue({ data: createMockPurpose(), isLoading: false })
  })

  it('shows the create title when the draft is opened right after creation (isFirstEdit location state)', () => {
    const history = createMemoryHistory({
      initialEntries: [{ pathname: '/', state: { isFirstEdit: true } }],
    })

    renderWithApplicationContext(
      <ConsumerPurposeEditPage />,
      { withReactQueryContext: true, withRouterContext: true },
      history
    )

    expect(screen.getByText('create.emptyTitle')).toBeInTheDocument()
    expect(screen.queryByText('edit.emptyTitle')).not.toBeInTheDocument()
  })

  it('shows the edit title on a regular draft edit (no location state)', () => {
    renderWithApplicationContext(<ConsumerPurposeEditPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('edit.emptyTitle')).toBeInTheDocument()
    expect(screen.queryByText('create.emptyTitle')).not.toBeInTheDocument()
  })
})
