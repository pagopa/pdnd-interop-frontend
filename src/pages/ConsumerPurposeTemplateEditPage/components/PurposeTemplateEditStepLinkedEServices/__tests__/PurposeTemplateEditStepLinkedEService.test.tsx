import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { PurposeTemplateEditLinkedEService } from '../PurposeTemplateEditLinkedEService'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...(actual as Record<string, unknown>),
    useQuery: vi.fn(),
  }
})

vi.mock('@/router', () => ({
  useParams: vi.fn(() => ({ purposeTemplateId: 'template-123' })),
  useNavigate: vi.fn(() => vi.fn()),
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getSingle: vi.fn(),
    getEservicesLinkedToPurposeTemplatesList: vi.fn(() => ({
      queryKey: ['mocked'],
      queryFn: vi.fn(),
    })),
  },
}))

vi.mock('../AddEServiceToForm', () => ({
  AddEServiceToForm: ({ showWarning }: { showWarning: boolean }) => (
    <div data-testid="add-eservice-form">
      {showWarning && <div data-testid="warning">Warning shown</div>}
    </div>
  ),
}))

vi.mock('@/components/shared/StepActions', () => ({
  StepActions: ({
    forward,
  }: {
    forward: { label: string; type: 'button' | 'submit' | 'link' }
  }) => {
    // For submit buttons, we need to trigger the form submit
    const handleClick = () => {
      const form = document.querySelector('form')
      if (form && forward.type === 'submit') {
        form.requestSubmit()
      }
    }
    return (
      <button
        data-testid="forward-button"
        type={forward.type === 'submit' ? 'submit' : 'button'}
        onClick={handleClick}
      >
        {forward.label}
      </button>
    )
  },
}))

vi.mock('@/components/layout/containers', () => ({
  SectionContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('PurposeTemplateEditLinkedEService', () => {
  const mockForward = vi.fn()

  const mockPurposeTemplate: PurposeTemplateWithCompactCreator = {
    id: 'template-123',
    purposeTitle: 'Test Purpose',
    purposeDescription: 'desc',
    purposeFreeOfChargeReason: '',
    purposeIsFreeOfCharge: false,
    purposeDailyCalls: 100,
    targetDescription: 'desc',
    handlesPersonalData: true,
    targetTenantKind: 'PA',
    creator: {
      id: 'org-1',
      name: 'Test Org',
      kind: 'PA',
    },
    state: 'DRAFT',
    createdAt: '',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useQuery as Mock).mockImplementation(() => ({ data: undefined }))
  })

  it('renders nothing when purposeTemplate is undefined', () => {
    ;(useQuery as Mock)
      .mockReturnValueOnce({ data: undefined })
      .mockReturnValueOnce({ data: undefined })

    const { container } = render(
      <PurposeTemplateEditLinkedEService forward={mockForward} back={() => {}} activeStep={0} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders form when purposeTemplate is defined', () => {
    ;(useQuery as Mock)
      .mockReturnValueOnce({ data: mockPurposeTemplate })
      .mockReturnValueOnce({ data: { results: [] } })

    const { container } = renderWithApplicationContext(
      <PurposeTemplateEditLinkedEService forward={mockForward} back={() => {}} activeStep={0} />,
      {
        withReactQueryContext: true,
      }
    )

    // Check that the component renders (not empty)
    expect(container).not.toBeEmptyDOMElement()
    expect(screen.getByTestId('add-eservice-form')).toBeInTheDocument()
  })

  it('renders form with linked eservices', () => {
    const linkedEServices = [
      {
        eservice: { id: 'eservice-1', name: 'E-Service 1' },
        descriptor: { id: 'desc-1', state: 'ARCHIVED' as const },
      },
    ]

    ;(useQuery as Mock)
      .mockReturnValueOnce({ data: mockPurposeTemplate })
      .mockReturnValueOnce({ data: { results: linkedEServices } })

    renderWithApplicationContext(
      <PurposeTemplateEditLinkedEService forward={mockForward} back={() => {}} activeStep={0} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByTestId('add-eservice-form')).toBeInTheDocument()
  })

  it('calls forward when in draft state and form is valid', async () => {
    ;(useQuery as Mock)
      .mockReturnValueOnce({ data: mockPurposeTemplate })
      .mockReturnValueOnce({ data: { results: [] } })

    renderWithApplicationContext(
      <PurposeTemplateEditLinkedEService forward={mockForward} back={() => {}} activeStep={0} />,
      {
        withReactQueryContext: true,
      }
    )

    await waitFor(() => {
      expect(screen.getByTestId('add-eservice-form')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /forward/i })

    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockForward).toHaveBeenCalled()
    })
  })
})
