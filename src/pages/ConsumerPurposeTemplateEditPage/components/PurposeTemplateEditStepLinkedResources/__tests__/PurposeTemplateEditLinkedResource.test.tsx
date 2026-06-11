import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateEditLinkedResource } from '../PurposeTemplateEditLinkedResource'
import type { LinkableResources } from '@/api/api.generatedTypes'
import type { LinkableCandidate } from '@/utils/purposeTemplate.utils'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurposeTemplate } from '../../../../../../__mocks__/data/purposeTemplate.mocks'

const TEST_PURPOSE_TEMPLATE_ID = 'template-123'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...(actual as Record<string, unknown>),
    useQuery: vi.fn(),
  }
})

vi.mock('@/router', () => ({
  useParams: vi.fn(() => ({ purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID })),
  useNavigate: vi.fn(() => vi.fn()),
  useGeneratePath: vi.fn(() => (route: string) => `/${route}`),
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getSingle: vi.fn(() => ({ queryKey: ['getSingle'], queryFn: vi.fn() })),
    getLinkableResources: vi.fn(() => ({
      queryKey: ['getLinkableResources'],
      queryFn: vi.fn(),
    })),
  },
}))

function setupQueries(pT?: unknown, lR?: unknown) {
  vi.mocked(useQuery).mockImplementation((opts) => {
    const key = (opts as { queryKey?: unknown[] } | undefined)?.queryKey?.[0]
    if (key === 'getSingle') return { data: pT } as ReturnType<typeof useQuery>
    if (key === 'getLinkableResources') return { data: lR } as ReturnType<typeof useQuery>
    return { data: undefined } as ReturnType<typeof useQuery>
  })
}

vi.mock('../AddResourceToForm', () => ({
  AddResourceToForm: ({
    linkedResources,
    showWarning,
  }: {
    linkedResources: LinkableCandidate[]
    showWarning: boolean
  }) => (
    <div data-testid="add-resource-form">
      <span data-testid="resource-count">{linkedResources.length}</span>
      <ul>
        {linkedResources.map((c) => (
          <li
            key={`${c.resourceKind}:${c.value.id}`}
            data-testid={`linked-${c.resourceKind}-${c.value.id}`}
          >
            {c.value.name}
          </li>
        ))}
      </ul>
      {showWarning && <div data-testid="warning" />}
    </div>
  ),
}))

vi.mock('@/components/shared/StepActions', () => ({
  StepActions: ({
    forward,
  }: {
    forward: { label: string; type: 'button' | 'submit' | 'link' }
  }) => {
    const handleClick = () => {
      const form = document.querySelector('form')
      if (form && forward.type === 'submit') form.requestSubmit()
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

const mockPurposeTemplate = createMockPurposeTemplate({
  id: TEST_PURPOSE_TEMPLATE_ID,
  state: 'DRAFT',
})

describe('PurposeTemplateEditLinkedResource', () => {
  const mockForward = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    setupQueries()
  })

  it('renders null while purposeTemplate is loading', () => {
    setupQueries()

    const { container } = renderWithApplicationContext(
      <PurposeTemplateEditLinkedResource forward={mockForward} back={vi.fn()} activeStep={1} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('passes linked resources to AddResourceToForm in normalized LinkableCandidate shape (mixed kinds)', () => {
    const linkableResources: LinkableResources = {
      results: [
        {
          resourceKind: 'ESERVICE',
          purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
          eservice: {
            id: 'es-1',
            name: 'Eservice A',
            producer: { id: 'p-1', name: 'Org1' },
          },
          descriptor: { id: 'desc-1', state: 'PUBLISHED', version: '1', audience: [] },
          createdAt: '2025-01-01',
        },
        {
          resourceKind: 'ESERVICE_TEMPLATE',
          purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
          eserviceTemplate: {
            id: 'tpl-1',
            name: 'Template B',
            creator: { id: 'c-1', name: 'Org2' },
          },
          eserviceTemplateVersion: { id: 'tplv-1', version: 1, state: 'PUBLISHED' },
          createdAt: '2025-01-02',
        },
      ],
      pagination: { offset: 0, limit: 50, totalCount: 2 },
    }

    setupQueries(mockPurposeTemplate, linkableResources)

    renderWithApplicationContext(
      <PurposeTemplateEditLinkedResource forward={mockForward} back={vi.fn()} activeStep={1} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByTestId('resource-count')).toHaveTextContent('2')
    expect(screen.getByTestId('linked-ESERVICE-es-1')).toBeInTheDocument()
    expect(screen.getByTestId('linked-ESERVICE_TEMPLATE-tpl-1')).toBeInTheDocument()
  })

  it('calls forward when submitting with all resources in valid state (DRAFT, all PUBLISHED)', async () => {
    const linkableResources: LinkableResources = {
      results: [
        {
          resourceKind: 'ESERVICE',
          purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
          eservice: { id: 'es-1', name: 'Eservice A', producer: { id: 'p-1', name: 'Org1' } },
          descriptor: { id: 'desc-1', state: 'PUBLISHED', version: '1', audience: [] },
          createdAt: '2025-01-01',
        },
      ],
      pagination: { offset: 0, limit: 50, totalCount: 1 },
    }

    setupQueries(mockPurposeTemplate, linkableResources)

    renderWithApplicationContext(
      <PurposeTemplateEditLinkedResource forward={mockForward} back={vi.fn()} activeStep={1} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: /forward/i }))

    await waitFor(() => expect(mockForward).toHaveBeenCalled())
  })

  it('shows warning when any linked e-service descriptor is ARCHIVED or SUSPENDED', async () => {
    const linkableResources: LinkableResources = {
      results: [
        {
          resourceKind: 'ESERVICE',
          purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
          eservice: { id: 'es-1', name: 'Eservice A', producer: { id: 'p-1', name: 'Org1' } },
          descriptor: { id: 'desc-1', state: 'SUSPENDED', version: '1', audience: [] },
          createdAt: '2025-01-01',
        },
      ],
      pagination: { offset: 0, limit: 50, totalCount: 1 },
    }

    setupQueries(mockPurposeTemplate, linkableResources)

    renderWithApplicationContext(
      <PurposeTemplateEditLinkedResource forward={mockForward} back={vi.fn()} activeStep={1} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: /forward/i }))

    await waitFor(() => {
      expect(screen.getByTestId('warning')).toBeInTheDocument()
    })
    expect(mockForward).not.toHaveBeenCalled()
  })

  it('shows warning when any linked template version is DEPRECATED or SUSPENDED', async () => {
    const linkableResources: LinkableResources = {
      results: [
        {
          resourceKind: 'ESERVICE_TEMPLATE',
          purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
          eserviceTemplate: {
            id: 'tpl-1',
            name: 'Template B',
            creator: { id: 'c-1', name: 'Org2' },
          },
          eserviceTemplateVersion: { id: 'tplv-1', version: 1, state: 'DEPRECATED' },
          createdAt: '2025-01-02',
        },
      ],
      pagination: { offset: 0, limit: 50, totalCount: 1 },
    }

    setupQueries(mockPurposeTemplate, linkableResources)

    renderWithApplicationContext(
      <PurposeTemplateEditLinkedResource forward={mockForward} back={vi.fn()} activeStep={1} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: /forward/i }))

    await waitFor(() => {
      expect(screen.getByTestId('warning')).toBeInTheDocument()
    })
    expect(mockForward).not.toHaveBeenCalled()
  })
})
