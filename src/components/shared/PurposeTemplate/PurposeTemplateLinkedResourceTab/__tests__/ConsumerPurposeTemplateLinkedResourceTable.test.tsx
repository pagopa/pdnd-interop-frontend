import React from 'react'
import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import type { LinkableResources } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ConsumerPurposeTemplateLinkedResourceTable } from '../ConsumerPurposeTemplateLinkedResourceTable'
import { createMockPurposeTemplate } from '../../../../../../__mocks__/data/purposeTemplate.mocks'

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
    getLinkableResources: vi.fn(() => ({ queryKey: ['linkable'], queryFn: vi.fn() })),
  },
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getProducers: vi.fn(() => ({ queryKey: ['producers'], queryFn: vi.fn() })),
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
    t: (key: string) => {
      const dict: Record<string, string> = {
        linkedResourceName: 'E-service o template e-service',
        linkedResourceKind: 'Tipo',
        linkedResourceProviderName: 'Nome erogatore',
        'actions.inspect': 'Visualizza',
        'kind.eservice': 'E-service',
        'kind.eserviceTemplate': 'Template e-service',
        'filters.resourceField.label': 'Nome e-service',
        'filters.providerField.label': 'Nome erogatore',
      }
      return dict[key] ?? key
    },
  }),
}))

const mockPurposeTemplate = createMockPurposeTemplate({
  id: TEST_PURPOSE_TEMPLATE_ID,
  state: 'PUBLISHED',
})

function setData(data: LinkableResources | undefined) {
  // First useQuery: producers (always empty for these tests)
  // Second useQuery: linkable resources
  vi.mocked(useQuery)
    .mockReturnValueOnce({ data: [] } as unknown as ReturnType<typeof useQuery>)
    .mockReturnValueOnce({ data, isFetching: false } as unknown as ReturnType<typeof useQuery>)
}

describe('ConsumerPurposeTemplateLinkedResourceTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the new Tipo column header', () => {
    setData({ results: [], pagination: { offset: 0, limit: 10, totalCount: 0 } })

    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTable purposeTemplate={mockPurposeTemplate} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('Tipo')).toBeInTheDocument()
  })

  it('renders an ESERVICE row with kind label "E-service" and Visualizza link to SUBSCRIBE_CATALOG_VIEW', () => {
    setData({
      results: [
        {
          resourceKind: 'ESERVICE',
          purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
          eservice: { id: 'es-1', name: 'Eservice A', producer: { id: 'p-1', name: 'Org1' } },
          descriptor: { id: 'desc-1', state: 'PUBLISHED', version: '1', audience: [] },
          createdAt: '2025-01-01',
        },
      ],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })

    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTable purposeTemplate={mockPurposeTemplate} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('Eservice A')).toBeInTheDocument()
    expect(screen.getByText('Org1')).toBeInTheDocument()
    expect(screen.getByText('E-service')).toBeInTheDocument()

    const link = screen.getByTestId('link-SUBSCRIBE_CATALOG_VIEW')
    expect(link).toBeInTheDocument()
    expect(JSON.parse(link.getAttribute('data-params')!)).toMatchObject({
      eserviceId: 'es-1',
      descriptorId: 'desc-1',
    })
  })

  it('renders an ESERVICE_TEMPLATE row with kind label "Template e-service" and Visualizza link to SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS', () => {
    setData({
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
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })

    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTable purposeTemplate={mockPurposeTemplate} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('Template B')).toBeInTheDocument()
    expect(screen.getByText('Org2')).toBeInTheDocument()
    expect(screen.getByText('Template e-service')).toBeInTheDocument()

    const link = screen.getByTestId('link-SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS')
    expect(link).toBeInTheDocument()
    expect(JSON.parse(link.getAttribute('data-params')!)).toMatchObject({
      eServiceTemplateId: 'tpl-1',
      eServiceTemplateVersionId: 'tplv-1',
    })
  })

  it('renders both kind labels when the result set is mixed', () => {
    setData({
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
      pagination: { offset: 0, limit: 10, totalCount: 2 },
    })

    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTable purposeTemplate={mockPurposeTemplate} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('E-service')).toBeInTheDocument()
    expect(screen.getByText('Template e-service')).toBeInTheDocument()
  })

  it('renders the filters area (smoke: filters do not break with mixed rows)', () => {
    setData({
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
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    })

    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTable purposeTemplate={mockPurposeTemplate} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    // Filter inputs are rendered by @pagopa/interop-fe-commons Filters component;
    // we assert the row is rendered, proving the table did not throw.
    expect(screen.getByText('Template B')).toBeInTheDocument()
  })
})
