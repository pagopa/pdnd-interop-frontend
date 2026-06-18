import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { PurposeEditStepGeneral } from '../PurposeEditStepGeneral'
import PurposeEditStepGeneralForm from '../PurposeEditStepGeneralForm'
import { NotFoundError } from '@/utils/errors.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

vi.mock('@/router', () => ({
  useParams: () => ({ purposeId: 'purpose-123' }),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (purposeId: string) => ({ queryKey: ['PurposeGetSingle', purposeId] }),
  },
}))

vi.mock('../PurposeEditStepGeneralForm', async () => {
  const actual = await vi.importActual<typeof import('../PurposeEditStepGeneralForm')>(
    '../PurposeEditStepGeneralForm'
  )
  return {
    ...actual,
    default: vi.fn(() => <div data-testid="purpose-edit-step-general-form" />),
    PurposeEditStepGeneralFormSkeleton: vi.fn(() => (
      <div data-testid="purpose-edit-step-general-skeleton" />
    )),
  }
})

function mockPurposeQuery({
  purpose,
  isLoadingPurpose = false,
}: {
  purpose?: ReturnType<typeof createMockPurpose>
  isLoadingPurpose?: boolean
}) {
  ;(useQuery as Mock).mockReturnValue({ data: purpose, isLoading: isLoadingPurpose })
}

describe('PurposeEditStepGeneral', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the skeleton while purpose is loading', () => {
    mockPurposeQuery({ purpose: undefined, isLoadingPurpose: true })

    render(<PurposeEditStepGeneral back={vi.fn()} forward={vi.fn()} activeStep={0} />)

    expect(screen.getByTestId('purpose-edit-step-general-skeleton')).toBeInTheDocument()
  })

  it('throws NotFoundError when purpose is missing after loading', () => {
    mockPurposeQuery({ purpose: undefined, isLoadingPurpose: false })

    expect(() =>
      render(<PurposeEditStepGeneral back={vi.fn()} forward={vi.fn()} activeStep={0} />)
    ).toThrow(NotFoundError)
  })

  it('passes purpose and computed defaultValues to PurposeEditStepGeneralForm', () => {
    const purpose = createMockPurpose({
      id: 'purpose-123',
      title: 'Purpose title',
      description: 'Purpose description',
      isFreeOfCharge: true,
      freeOfChargeReason: 'No cost for testing',
      versions: [
        {
          createdAt: '2023-02-03T07:59:52.458Z',
          dailyCalls: 99,
          id: 'version-1',
          state: 'DRAFT',
        },
      ],
    })

    mockPurposeQuery({ purpose, isLoadingPurpose: false })

    const forwardMock = vi.fn()
    const backMock = vi.fn()

    render(<PurposeEditStepGeneral back={backMock} forward={forwardMock} activeStep={1} />)

    expect(PurposeEditStepGeneralForm).toHaveBeenCalledWith(
      expect.objectContaining({
        purpose,
        defaultValues: {
          title: 'Purpose title',
          description: 'Purpose description',
          dailyCalls: 99,
          isFreeOfCharge: true,
          freeOfChargeReason: 'No cost for testing',
        },
        activeStep: 1,
        forward: forwardMock,
        back: backMock,
      }),
      expect.anything()
    )
  })

  it('falls back dailyCalls to 1 when purpose has no versions', () => {
    const purpose = createMockPurpose({
      id: 'purpose-123',
      versions: [],
    })

    mockPurposeQuery({ purpose, isLoadingPurpose: false })

    render(<PurposeEditStepGeneral back={vi.fn()} forward={vi.fn()} activeStep={0} />)

    expect(PurposeEditStepGeneralForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: expect.objectContaining({
          dailyCalls: 1,
        }),
      }),
      expect.anything()
    )
  })
})
