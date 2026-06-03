import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQuery } from '@tanstack/react-query'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import { PurposeMutations } from '@/api/purpose'
import RiskAnalysisCompilePage from '../RiskAnalysisCompile.page'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')

  return {
    ...(actual as Record<string, unknown>),
    useQuery: vi.fn(),
  }
})

const navigateMock = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
vi.spyOn(router, 'useParams').mockReturnValue({
  purposeId: 'purpose-1',
})

const updateRiskAnalysisMock = vi.fn()

vi.spyOn(PurposeMutations, 'useUpdateRiskAnalysis').mockReturnValue({
  mutate: updateRiskAnalysisMock,
} as never)

vi.mock(
  '@/pages/ConsumerPurposeEditPage/components/PurposeEditStepRiskAnalysis/RiskAnalysisForm',
  () => ({
    RiskAnalysisForm: ({
      onSubmit,
      onCancel,
    }: {
      onSubmit: (answers: Record<string, string[]>) => void
      onCancel: () => void
    }) => (
      <>
        <button
          onClick={() =>
            onSubmit({
              question1: ['answer1'],
            })
          }
        >
          Submit
        </button>

        <button onClick={onCancel}>Cancel</button>
      </>
    ),
    RiskAnalysisFormSkeleton: () => <div data-testid="risk-analysis-skeleton" />,
  })
)

function setQueryData({
  purpose,
  riskAnalysis,
  isLoading = false,
}: {
  purpose?: unknown
  riskAnalysis?: unknown
  isLoading?: boolean
}) {
  vi.mocked(useQuery)
    .mockReturnValueOnce({
      data: purpose,
      isLoading,
    } as ReturnType<typeof useQuery>)
    .mockReturnValueOnce({
      data: riskAnalysis,
      isLoading: false,
    } as ReturnType<typeof useQuery>)
}

describe('RiskAnalysisCompilePage', () => {
  const purpose = {
    id: 'purpose-1',
    title: 'Purpose title',
    description: 'Purpose description',
    freeOfChargeReason: 'reason',
    isFreeOfCharge: false,
    currentVersion: {
      dailyCalls: 10,
    },
    consumer: {
      kind: 'PA',
    },
    eservice: {
      id: 'eservice-1',
      personalData: [],
    },
    riskAnalysisForm: {
      version: '1',
      answers: {
        oldAnswer: ['a'],
      },
    },
  }

  const riskAnalysis = {
    version: '2',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useQuery>)
  })

  it('should render skeleton when purpose is missing', () => {
    setQueryData({
      purpose: undefined,
      riskAnalysis: undefined,
      isLoading: true,
    })

    renderWithApplicationContext(<RiskAnalysisCompilePage />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('risk-analysis-skeleton')).toBeInTheDocument()
  })

  it('should render skeleton when risk analysis is missing', () => {
    setQueryData({
      purpose,
      riskAnalysis: undefined,
    })

    renderWithApplicationContext(<RiskAnalysisCompilePage />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('risk-analysis-skeleton')).toBeInTheDocument()
  })

  it('should render form when purpose and risk analysis exist', () => {
    setQueryData({
      purpose,
      riskAnalysis,
    })

    renderWithApplicationContext(<RiskAnalysisCompilePage />, {
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should call updateRiskAnalysis on submit', async () => {
    const user = userEvent.setup()

    setQueryData({
      purpose,
      riskAnalysis,
    })

    renderWithApplicationContext(<RiskAnalysisCompilePage />, {
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(updateRiskAnalysisMock).toHaveBeenCalledWith(
      {
        purposeId: 'purpose-1',
        title: 'Purpose title',
        description: 'Purpose description',
        riskAnalysisForm: {
          version: '2',
          answers: {
            question1: ['answer1'],
          },
        },
        freeOfChargeReason: 'reason',
        isFreeOfCharge: false,
        dailyCalls: 10,
      },
      expect.any(Object)
    )
  })

  it('should navigate to summary after successful submit', async () => {
    const user = userEvent.setup()

    updateRiskAnalysisMock.mockImplementation((_payload, options) => {
      options.onSuccess()
    })

    setQueryData({
      purpose,
      riskAnalysis,
    })

    renderWithApplicationContext(<RiskAnalysisCompilePage />, {
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_SUMMARY', {
      params: {
        purposeId: 'purpose-1',
      },
    })
  })

  it('should navigate back when cancel is clicked', async () => {
    const user = userEvent.setup()

    setQueryData({
      purpose,
      riskAnalysis,
    })

    renderWithApplicationContext(<RiskAnalysisCompilePage />, {
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE', {
      params: {
        purposeId: 'purpose-1',
      },
    })
  })
})
