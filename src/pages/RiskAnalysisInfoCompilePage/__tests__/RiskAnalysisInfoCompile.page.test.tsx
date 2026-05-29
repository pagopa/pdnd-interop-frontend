import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import RiskAnalysisInfoCompilePage from '../RiskAnalysisInfoCompile.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

mockUseParams({
  purposeId: 'purpose-id-001',
})

const mockNavigate = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate)

mockUseJwt()

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ['purpose', id],
  },
}))

const useQueryMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()

  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

describe('RiskAnalysisInfoCompilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page title', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render general information section', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('generalInfoSection.label')).toBeInTheDocument()
    expect(screen.getByText(createMockPurpose().title)).toBeInTheDocument()
    expect(screen.getByText(createMockPurpose().description)).toBeInTheDocument()
    expect(screen.getByText(createMockPurpose().eservice.name)).toBeInTheDocument()
    expect(screen.getByText(createMockPurpose().eservice.producer.name)).toBeInTheDocument()
  })

  it('should render load estimation section', () => {
    const mockPurpose = createMockPurpose()

    useQueryMock.mockReturnValue({
      data: mockPurpose,
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('loadEstimationSection.label')).toBeInTheDocument()
    expect(screen.getByText(`${mockPurpose.currentVersion?.dailyCalls}`)).toBeInTheDocument()
  })

  it('should render YES when purpose is free of charge', () => {
    const mockPurpose = {
      ...createMockPurpose(),
      isFreeOfCharge: true,
    }

    useQueryMock.mockReturnValue({
      data: mockPurpose,
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('generalInfoSection.isFreeOfCharge.options.YES')).toBeInTheDocument()
  })

  it('should render NO when purpose is not free of charge', () => {
    const mockPurpose = {
      ...createMockPurpose(),
      isFreeOfCharge: false,
    }

    useQueryMock.mockReturnValue({
      data: mockPurpose,
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('generalInfoSection.isFreeOfCharge.options.NO')).toBeInTheDocument()
  })

  it('should render begin compile button', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurpose(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByRole('button', {
        name: 'beginCompileBtn',
      })
    ).toBeInTheDocument()
  })

  it('should navigate to compile page on begin compile click', () => {
    const mockPurpose = createMockPurpose()

    useQueryMock.mockReturnValue({
      data: mockPurpose,
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const button = screen.getByRole('button', {
      name: 'beginCompileBtn',
    })

    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
      params: {
        purposeId: mockPurpose.id,
      },
    })
  })

  it('should not navigate if purpose id is missing', () => {
    const mockPurpose = {
      ...createMockPurpose(),
      id: undefined,
    }

    useQueryMock.mockReturnValue({
      data: mockPurpose,
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisInfoCompilePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const button = screen.getByRole('button', {
      name: 'beginCompileBtn',
    })

    fireEvent.click(button)

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
