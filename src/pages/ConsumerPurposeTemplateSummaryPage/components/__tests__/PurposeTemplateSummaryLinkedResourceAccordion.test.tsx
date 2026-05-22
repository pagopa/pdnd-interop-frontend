import React from 'react'
import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import type { LinkableResources } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PurposeTemplateSummaryLinkedResourceAccordion } from '../PurposeTemplateSummaryLinkedResourceAccordion'

const TEST_PURPOSE_TEMPLATE_ID = 'pt-1'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...(actual as Record<string, unknown>),
    useQuery: vi.fn(),
  }
})

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getLinkableResources: vi.fn(() => ({ queryKey: ['mocked'], queryFn: vi.fn() })),
  },
}))

vi.mock('@/router', () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode
    to: string
    params?: Record<string, string>
  }) => (
    <a data-testid={`link-${to}`} data-params={JSON.stringify(params ?? {})} href={`/${to}`}>
      {children}
    </a>
  ),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      if (key === 'subtitle') return 'E-service e template e-service suggeriti'
      if (key === 'providedBy.eservice') return `e-service erogato da ${opts?.publisher}`
      if (key === 'providedBy.eserviceTemplate') return `template erogato da ${opts?.publisher}`
      if (key === 'noLinkedResources') return 'Nessuna risorsa collegata'
      return key
    },
  }),
}))

describe('PurposeTemplateSummaryLinkedResourceAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders accordion with renamed title for the unified resources section', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: {
        results: [],
        pagination: { offset: 0, limit: 50, totalCount: 0 },
      } as LinkableResources,
    } as ReturnType<typeof useQuery>)

    renderWithApplicationContext(
      <PurposeTemplateSummaryLinkedResourceAccordion
        purposeTemplateId={TEST_PURPOSE_TEMPLATE_ID}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('E-service e template e-service suggeriti')).toBeInTheDocument()
  })

  it('renders an ESERVICE row with discriminated label and link to SUBSCRIBE_CATALOG_VIEW', () => {
    const data: LinkableResources = {
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
    vi.mocked(useQuery).mockReturnValue({ data } as ReturnType<typeof useQuery>)

    renderWithApplicationContext(
      <PurposeTemplateSummaryLinkedResourceAccordion
        purposeTemplateId={TEST_PURPOSE_TEMPLATE_ID}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('Eservice A')).toBeInTheDocument()
    expect(screen.getByText(/e-service erogato da Org1/)).toBeInTheDocument()
    const link = screen.getByTestId('link-SUBSCRIBE_CATALOG_VIEW')
    expect(link).toBeInTheDocument()
    expect(JSON.parse(link.getAttribute('data-params')!)).toMatchObject({
      eserviceId: 'es-1',
      descriptorId: 'desc-1',
    })
  })

  it('renders an ESERVICE_TEMPLATE row with discriminated label and link to SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS', () => {
    const data: LinkableResources = {
      results: [
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
      pagination: { offset: 0, limit: 50, totalCount: 1 },
    }
    vi.mocked(useQuery).mockReturnValue({ data } as ReturnType<typeof useQuery>)

    renderWithApplicationContext(
      <PurposeTemplateSummaryLinkedResourceAccordion
        purposeTemplateId={TEST_PURPOSE_TEMPLATE_ID}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('Template B')).toBeInTheDocument()
    expect(screen.getByText(/template erogato da Org2/)).toBeInTheDocument()
    const link = screen.getByTestId('link-SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS')
    expect(link).toBeInTheDocument()
    expect(JSON.parse(link.getAttribute('data-params')!)).toMatchObject({
      eServiceTemplateId: 'tpl-1',
      eServiceTemplateVersionId: 'tplv-1',
    })
  })

  it('renders both kinds of rows when results contain mixed resources', () => {
    const data: LinkableResources = {
      results: [
        {
          resourceKind: 'ESERVICE',
          purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
          eservice: { id: 'es-1', name: 'Eservice A', producer: { id: 'p-1', name: 'Org1' } },
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
    vi.mocked(useQuery).mockReturnValue({ data } as ReturnType<typeof useQuery>)

    renderWithApplicationContext(
      <PurposeTemplateSummaryLinkedResourceAccordion
        purposeTemplateId={TEST_PURPOSE_TEMPLATE_ID}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByTestId('link-SUBSCRIBE_CATALOG_VIEW')).toBeInTheDocument()
    expect(screen.getByTestId('link-SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS')).toBeInTheDocument()
  })

  it('renders empty state when there are no linked resources', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: {
        results: [],
        pagination: { offset: 0, limit: 50, totalCount: 0 },
      } as LinkableResources,
    } as ReturnType<typeof useQuery>)

    renderWithApplicationContext(
      <PurposeTemplateSummaryLinkedResourceAccordion
        purposeTemplateId={TEST_PURPOSE_TEMPLATE_ID}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('Nessuna risorsa collegata')).toBeInTheDocument()
  })
})
