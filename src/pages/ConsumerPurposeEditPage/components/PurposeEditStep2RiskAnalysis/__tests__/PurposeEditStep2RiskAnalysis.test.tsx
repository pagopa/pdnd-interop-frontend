import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockPurpose,
  createMockRiskAnalysisFormConfig,
} from '@/../__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import { PurposeEditStep2RiskAnalysis } from '../PurposeEditStep2RiskAnalysis'
import type { Purpose, RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { fireEvent, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

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

describe('PurposeEditStep2RiskAnalysis', () => {
  it('should match snapshot', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig())
    const { baseElement } = renderWithApplicationContext(
      <PurposeEditStep2RiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot on loading', () => {
    mockUseGetSinglePurpose(undefined)
    mockUseGetRiskAnalysisLatest(undefined)
    const { baseElement } = renderWithApplicationContext(
      <PurposeEditStep2RiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it("should render a dialog if the purpose's risk analysis form version is not the latest", () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig({ version: '3.0' }))
    const screen = renderWithApplicationContext(
      <PurposeEditStep2RiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(screen.getByRole('dialog', { name: 'title' })).toBeInTheDocument()
  })

  it('should navigate to purposes list if the risk analysis upgrade is refused', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig({ version: '3.0' }))
    const screen = renderWithApplicationContext(
      <PurposeEditStep2RiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    fireEvent.click(screen.getByRole('button', { name: 'cancelButtonLabel' }))
    expect(screen.history.location.pathname).toEqual('/it/fruizione/finalita')
  })

  it('should show the risk analysis form if the risk analysis upgrade is accepted', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig({ version: '3.0' }))
    const screen = renderWithApplicationContext(
      <PurposeEditStep2RiskAnalysis activeStep={1} back={vi.fn()} forward={vi.fn()} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    fireEvent.click(screen.getByRole('button', { name: 'proceedButtonLabel' }))
    expect(screen.getAllByRole('radio')[0]).toBeInTheDocument()
  })

  it("should call the update purpose mutation when the form is submitted and navigate to the next step if it's successful", async () => {
    mockUseGetSinglePurpose(createMockPurpose())
    mockUseGetRiskAnalysisLatest(createMockRiskAnalysisFormConfig())
    const forwardFn = vi.fn()
    const screen = renderWithApplicationContext(
      <PurposeEditStep2RiskAnalysis activeStep={1} back={vi.fn()} forward={forwardFn} />,
      { withRouterContext: true, withReactQueryContext: true }
    )

    fireEvent.click(screen.getByRole('button', { name: 'forwardWithSaveBtn' }))

    await waitFor(() => {
      expect(forwardFn).toHaveBeenCalled()
    })
  })
})
