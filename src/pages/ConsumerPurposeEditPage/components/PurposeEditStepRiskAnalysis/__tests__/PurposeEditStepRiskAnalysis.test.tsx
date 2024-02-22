import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockPurpose,
  createMockRiskAnalysisFormConfig,
} from '@/../__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import { PurposeEditStepRiskAnalysis } from '../PurposeEditStepRiskAnalysis'
import type { Purpose, RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { fireEvent, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import * as router from '@/router'

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/purposes/:purposeId`, (_, res, ctx) => {
    return res(ctx.json({}))
  })
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

const mockUseGetSinglePurpose = (data?: Purpose) => {
  vi.spyOn(PurposeQueries, 'useGetSingle').mockReturnValue({
    data,
  } as unknown as ReturnType<typeof PurposeQueries.useGetSingle>)
}

const mockUseGetRiskAnalysisLatest = (data?: RiskAnalysisFormConfig) => {
  vi.spyOn(PurposeQueries, 'useGetRiskAnalysisLatest').mockReturnValue({
    data,
  } as unknown as ReturnType<typeof PurposeQueries.useGetRiskAnalysisLatest>)
}

describe('PurposeEditStepRiskAnalysis', () => {
  it('should match snapshot', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig())
    const { baseElement } = renderWithApplicationContext(
      <PurposeEditStepRiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot on loading', () => {
    mockUseGetSinglePurpose(undefined)
    mockUseGetRiskAnalysisLatest(undefined)
    const { baseElement } = renderWithApplicationContext(
      <PurposeEditStepRiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it("should render a dialog if the purpose's risk analysis form version is not the latest", () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig({ version: '3.0' }))
    const screen = renderWithApplicationContext(
      <PurposeEditStepRiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument()
  })

  it('should navigate to purposes list if the risk analysis upgrade is refused', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig({ version: '3.0' }))
    const screen = renderWithApplicationContext(
      <PurposeEditStepRiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    fireEvent.click(screen.getByRole('button', { name: 'cancelButtonLabel' }))
    expect(screen.history.location.pathname).toEqual('/it/fruizione/finalita')
  })

  it('should show the risk analysis form if the risk analysis upgrade is accepted', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig({ version: '3.0' }))
    const screen = renderWithApplicationContext(
      <PurposeEditStepRiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    fireEvent.click(screen.getByRole('button', { name: 'proceedButtonLabel' }))
    expect(screen.getAllByRole('radio')[0]).toBeInTheDocument()
  })

  it("should call the update purpose mutation when the form is submitted and navigate to the summary page if it's successful", async () => {
    const purposeMock = createMockPurpose()
    mockUseGetSinglePurpose(purposeMock)
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig())
    vi.spyOn(router, 'useParams').mockReturnValue({ purposeId: purposeMock.id })
    const screen = renderWithApplicationContext(
      <PurposeEditStepRiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    fireEvent.click(screen.getByRole('button', { name: 'forwardWithSaveBtn' }))

    await waitFor(() => {
      expect(screen.history.location.pathname).toBe(
        `/it/fruizione/finalita/${purposeMock.id}/riepilogo`
      )
    })
  })
})
