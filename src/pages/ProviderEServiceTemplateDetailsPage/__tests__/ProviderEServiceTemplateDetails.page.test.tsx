import React from 'react'
import { screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ProviderEServiceTemplateDetailsPage from '../ProviderEServiceTemplateDetails.page'
import type * as ReactQuery from '@tanstack/react-query'
import type { ActionItemButton } from '@/types/common.types'

const { mockedGetSingle, mockedUseQuery } = vi.hoisted(() => ({
  mockedGetSingle: vi.fn(),
  mockedUseQuery: vi.fn(),
}))

mockUseJwt()

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({
    children,
    title,
    topSideActions,
  }: {
    children: React.ReactNode
    title: string
    topSideActions?: Array<ActionItemButton>
  }) => (
    <div>
      <h1>{title}</h1>
      <div data-testid="top-side-actions">
        {(topSideActions ?? []).map((action) => (
          <span key={action.label}>{action.label}</span>
        ))}
      </div>
      {children}
    </div>
  ),
}))

vi.mock('@/router', () => ({
  useParams: () => ({
    eServiceTemplateId: 'template-id',
    eServiceTemplateVersionId: 'version-id',
  }),
}))

vi.mock('@/hooks/useActiveTab', () => ({
  useActiveTab: () => ({
    activeTab: 'eserviceTemplateDetails',
    updateActiveTab: vi.fn(),
  }),
}))

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({
  useMarkNotificationsAsRead: vi.fn(),
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingle: mockedGetSingle,
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQuery: mockedUseQuery,
}))

vi.mock(
  '../components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateDetailsTab',
  () => ({
    ProviderEServiceTemplateDetailsTab: () => <div data-testid="template-details-tab" />,
  })
)

vi.mock(
  '../components/ProviderEServiceTemplateTenantsTab/ProviderEServiceTemplateTenantsTab',
  () => ({
    ProviderEServiceTemplateTenantsTab: () => <div data-testid="template-tenants-tab" />,
  })
)

vi.mock('@/hooks/useGetProviderEServiceTemplateActions', () => ({
  useGetProviderEServiceTemplateActions: () => ({
    actions: [{ action: vi.fn(), label: 'edit-action' }],
  }),
}))

describe('ProviderEServiceTemplateDetailsPage', () => {
  beforeEach(() => {
    mockedGetSingle.mockReturnValue({ queryKey: ['EServiceTemplateGetSingle'] })
    mockedUseQuery.mockReturnValue({
      data: {
        state: 'PUBLISHED',
        eserviceTemplate: {
          name: 'Template Name',
          draftVersion: undefined,
          mode: 'DELIVER',
          versions: [],
        },
      },
    })
  })

  it('shows the edit actions for admin users', () => {
    renderWithApplicationContext(<ProviderEServiceTemplateDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByText('edit-action')).toBeInTheDocument()
  })

  it('hides the edit actions for viewer users', () => {
    mockUseJwt({ isAdmin: false, isViewer: true })
    renderWithApplicationContext(<ProviderEServiceTemplateDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryByText('edit-action')).not.toBeInTheDocument()
  })
})
