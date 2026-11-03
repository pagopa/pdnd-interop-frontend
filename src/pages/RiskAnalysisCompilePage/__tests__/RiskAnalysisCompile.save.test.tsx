import { cleanup, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { RiskAnalysisFormSeed } from '@/api/api.generatedTypes'
import {
  createMockPurpose,
  createMockRiskAnalysisFormConfig,
} from '@/../__mocks__/data/purpose.mocks'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import * as router from '@/router'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { useRiskAnalysisReviewStore } from '../../RiskAnalysisSummaryPage/riskAnalysisReview.store'
import RiskAnalysisCompilePage from '../RiskAnalysisCompile.page'

vi.mock(
  '@/pages/ConsumerPurposeEditPage/components/PurposeEditStepRiskAnalysis/RiskAnalysisForm',
  () => ({
    RiskAnalysisForm: ({ onSubmit }: { onSubmit: (answers: Record<string, string[]>) => void }) => (
      <button
        onClick={() =>
          onSubmit({ institutionalPurpose: ['  Saved answer \n'], optionalQuestion: [] })
        }
      >
        Save analysis
      </button>
    ),
    RiskAnalysisFormSkeleton: () => <div />,
  })
)

const purpose = createMockPurpose({ riskAnalysisForm: { version: '2.0' } })
const receivedForm = vi.fn<(form: RiskAnalysisFormSeed) => void>()
const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/purposes/${purpose.id}`, (_, res, ctx) =>
    res(ctx.set('X-Metadata-Version', '3'), ctx.json(purpose))
  ),
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/purposes/riskAnalysis/version/:version`, (_, res, ctx) =>
    res(ctx.json(createMockRiskAnalysisFormConfig()))
  ),
  rest.put(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/${purpose.id}/riskAnalysis/form`,
    async (req, res, ctx) => {
      receivedForm(await req.json<RiskAnalysisFormSeed>())
      return res(ctx.status(204))
    }
  )
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(() => {
  vi.clearAllMocks()
  queryClient.clear()
  useRiskAnalysisReviewStore.getState().setPendingReview(undefined)
  mockUseParams({ purposeId: purpose.id })
  mockUseJwt({ isReviewer: true })
  vi.spyOn(router, 'useNavigate').mockReturnValue(vi.fn())
})
afterEach(() => {
  cleanup()
  queryClient.clear()
  useRiskAnalysisReviewStore.getState().setPendingReview(undefined)
  server.resetHandlers()
})

it('uses the normalized answers without optional empty arrays as the pending review baseline', async () => {
  const user = userEvent.setup()
  renderWithApplicationContext(<RiskAnalysisCompilePage />, {
    withRouterContext: true,
    withReactQueryContext: true,
  })
  await user.click(await screen.findByRole('button', { name: 'Save analysis' }))
  const expectedForm = { version: '2.0', answers: { institutionalPurpose: ['Saved answer'] } }
  await waitFor(() => expect(receivedForm).toHaveBeenCalledExactlyOnceWith(expectedForm))
  await waitFor(() =>
    expect(useRiskAnalysisReviewStore.getState().pendingReview).toEqual({
      purposeId: purpose.id,
      previousMetadataVersion: 3,
      riskAnalysisForm: expectedForm,
    })
  )
})
