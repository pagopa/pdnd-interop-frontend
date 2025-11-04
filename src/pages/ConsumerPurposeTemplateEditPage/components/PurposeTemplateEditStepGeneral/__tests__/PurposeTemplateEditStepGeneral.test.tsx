import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateEditStepGeneral } from '../PurposeTemplateEditStepGeneral'
import { NotFoundError } from '@/utils/errors.utils'
import PurposeTemplateEditStepGeneralForm from '../PurposeTemplateEditStepGeneralForm'

// --- mocks ---
vi.mock('@/router', () => ({
  useParams: vi.fn(() => ({ purposeTemplateId: 'template-123' })),
  useNavigate: vi.fn(() => vi.fn()),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getSingle: vi.fn(),
  },
}))

vi.mock('../PurposeTemplateEditStepGeneralForm', () => ({
  default: vi.fn(() => <div data-testid="general-form" />),
  PurposeTemplateEditStepGeneralFormSkeleton: vi.fn(() => <div data-testid="skeleton" />),
}))

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => key,
  })),
}))

describe('PurposeTemplateEditStepGeneral', () => {
  const mockBack = vi.fn()
  const mockForward = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders skeleton when loading', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    })

    render(<PurposeTemplateEditStepGeneral back={mockBack} forward={mockForward} activeStep={0} />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('renders form when data is loaded', async () => {
    const purposeTemplate = {
      id: 'template-123',
      purposeTitle: 'Test Purpose',
      purposeDescription: 'Test Description',
      purposeFreeOfChargeReason: '',
      purposeIsFreeOfCharge: false,
      purposeDailyCalls: 100,
      targetDescription: 'Target Description',
      handlesPersonalData: true,
      targetTenantKind: 'PA',
      creator: {
        id: 'org-1',
        name: 'Test Org',
        kind: 'PA',
      },
      state: 'PUBLISHED',
      createdAt: '',
    }

    ;(useQuery as Mock).mockReturnValue({
      data: purposeTemplate,
      isLoading: false,
    })

    render(<PurposeTemplateEditStepGeneral back={mockBack} forward={mockForward} activeStep={0} />)

    await waitFor(() => {
      expect(screen.getByTestId('general-form')).toBeInTheDocument()
    })

    expect(PurposeTemplateEditStepGeneralForm).toHaveBeenCalled()
  })

  it('throws NotFoundError when purposeTemplate is not found', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    })

    expect(() => {
      render(
        <PurposeTemplateEditStepGeneral back={mockBack} forward={mockForward} activeStep={0} />
      )
    }).toThrow(NotFoundError)
  })
})
