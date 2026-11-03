import { act, cleanup, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { focusManager } from '@tanstack/react-query'
import type { Purpose, RiskAnalysisSignSeed } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import {
  createMockPurpose,
  createMockRiskAnalysisFormConfig,
} from '@/../__mocks__/data/purpose.mocks'
import * as router from '@/router'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  mockUseParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import RiskAnalysisSummaryPage from '../RiskAnalysisSummary.page'

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({ useMarkNotificationsAsRead: vi.fn() }))

const purpose = {
  ...createMockPurpose({
    title: 'Reviewed purpose title',
    riskAnalysisReviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
    reviewerWorkflow: {
      signingState: 'ASSIGNED',
      reviewers: [
        { userId: 'reviewer-a', name: 'Reviewer', familyName: 'A' },
        { userId: 'reviewer-b', name: 'Reviewer', familyName: 'B' },
      ],
    },
    currentVersion: { state: 'DRAFT' },
  }),
  riskAnalysisForm: {
    version: '2.0',
    answers: { institutionalPurpose: ['Reviewer A answer'] },
  },
} satisfies Purpose

let metadataVersion = 3
let currentPurpose = purpose
const signRequest = vi.fn<(seed: RiskAnalysisSignSeed) => void>()
const navigate = vi.fn()

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/purposes/:purposeId`, (_, res, ctx) =>
    res(ctx.set('X-Metadata-Version', String(metadataVersion)), ctx.json(currentPurpose))
  ),
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/purposes/riskAnalysis/version/:version`, (_, res, ctx) =>
    res(ctx.json(createMockRiskAnalysisFormConfig()))
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/purposes/:purposeId/riskAnalysis/sign`,
    async (req, res, ctx) => {
      const seed = await req.json<RiskAnalysisSignSeed>()
      signRequest(seed)
      if (seed.metadataVersionToSign !== metadataVersion) {
        return res(
          ctx.status(409),
          ctx.json({
            correlationId: 'conflict-correlation-id',
            errors: [{ code: '004-0064', detail: 'Purpose metadata version mismatch' }],
          })
        )
      }
      return res(ctx.status(204))
    }
  )
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())

beforeEach(() => {
  vi.clearAllMocks()
  queryClient.clear()
  metadataVersion = 3
  currentPurpose = purpose
  mockUseParams({ purposeId: purpose.id })
  mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_RISK_ANALYSIS_SUMMARY' })
  mockUseJwt({ isAdmin: false, isReviewer: true, jwt: { uid: 'reviewer-a' } })
  vi.spyOn(router, 'useNavigate').mockReturnValue(navigate)
})

afterEach(() => {
  cleanup()
  queryClient.clear()
  server.resetHandlers()
  focusManager.setFocused(undefined)
})

function overwriteAnalysis() {
  metadataVersion = 4
  currentPurpose = {
    ...purpose,
    title: 'Updated purpose title',
    riskAnalysisForm: {
      ...purpose.riskAnalysisForm,
      answers: { institutionalPurpose: ['Reviewer B answer'] },
    },
  }
}

function renderPage() {
  return renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('approval from the risk analysis summary', () => {
  it('still redirects an assigned reviewer when a background update reports the analysis as signed', async () => {
    renderPage()
    expect(await screen.findByText('Reviewed purpose title')).toBeVisible()
    currentPurpose = {
      ...purpose,
      reviewerWorkflow: { ...purpose.reviewerWorkflow, signingState: 'SIGNED' },
    }

    await act(() =>
      queryClient.refetchQueries({ queryKey: PurposeQueries.getSingle(purpose.id).queryKey })
    )

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_DETAILS', {
        params: { purposeId: purpose.id },
        replace: true,
      })
    )
    expect(screen.queryByRole('button', { name: 'approveBtn' })).not.toBeInTheDocument()
  })

  it.each(['before opening the confirmation', 'on window focus', 'while the confirmation is open'])(
    'preserves the reviewed content and version after a background update %s',
    async (overwriteTiming) => {
      const user = userEvent.setup()
      const page = renderPage()
      await user.click(await screen.findByRole('button', { name: '2 riskAnalysisSection.title' }))
      expect(await screen.findByText('Reviewer A answer')).toBeVisible()

      if (overwriteTiming !== 'while the confirmation is open') {
        overwriteAnalysis()
        if (overwriteTiming === 'on window focus') {
          act(() => focusManager.setFocused(false))
          act(() => focusManager.setFocused(true))
          await waitFor(() =>
            expect(
              queryClient.getQueryData(PurposeQueries.getSingle(purpose.id).queryKey)
            ).toMatchObject({ metadataVersion: 4 })
          )
        } else {
          await act(() =>
            queryClient.refetchQueries({ queryKey: PurposeQueries.getSingle(purpose.id).queryKey })
          )
        }
      }

      await user.click(screen.getByRole('button', { name: 'approveBtn' }))
      const dialog = screen.getByRole('dialog')
      expect(signRequest).not.toHaveBeenCalled()

      if (overwriteTiming === 'while the confirmation is open') {
        overwriteAnalysis()
        await act(() =>
          queryClient.refetchQueries({ queryKey: PurposeQueries.getSingle(purpose.id).queryKey })
        )
      }

      expect(screen.getByText('Reviewer A answer')).toBeVisible()
      expect(screen.getByText('Reviewed purpose title')).toBeVisible()
      expect(screen.queryByText('Reviewer B answer')).not.toBeInTheDocument()
      expect(screen.queryByText('Updated purpose title')).not.toBeInTheDocument()
      await user.click(within(dialog).getByRole('button', { name: 'actions.confirm' }))

      expect(await screen.findByText('versionChanged')).toBeVisible()
      expect(screen.getByRole('dialog')).toBeVisible()
      expect(signRequest).toHaveBeenCalledExactlyOnceWith({ metadataVersionToSign: 3 })
      expect(navigate).not.toHaveBeenCalled()

      await user.click(within(dialog).getByRole('button', { name: 'actions.cancel' }))
      page.unmount()
      queryClient.clear()
      renderPage()

      await user.click(await screen.findByRole('button', { name: '2 riskAnalysisSection.title' }))
      expect(await screen.findByText('Reviewer B answer')).toBeVisible()
      expect(screen.getByText('Updated purpose title')).toBeVisible()
      await user.click(screen.getByRole('button', { name: 'approveBtn' }))
      await user.click(
        within(screen.getByRole('dialog')).getByRole('button', { name: 'actions.confirm' })
      )

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledExactlyOnceWith(
          'SUBSCRIBE_RISK_ANALYSIS_APPROVAL_SUCCESS',
          { params: { purposeId: purpose.id } }
        )
      })
      expect(signRequest).toHaveBeenCalledTimes(2)
      expect(signRequest).toHaveBeenLastCalledWith({ metadataVersionToSign: 4 })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    }
  )
})
