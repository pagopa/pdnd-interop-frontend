import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerEServiceTemplateDetailsPage from '../ConsumerEServiceTemplateDetails.page'

const { mockedUseQuery, mockedGetSingle, mockedGetInstances, mockedUpdateActiveTab, state } =
  vi.hoisted(() => ({
    mockedUseQuery: vi.fn(),
    mockedGetSingle: vi.fn(),
    mockedGetInstances: vi.fn(),
    mockedUpdateActiveTab: vi.fn(),
    state: {
      activeTab: 'eserviceTemplateDetails',
      singleData: {
        hasRequesterRiskAnalysis: true,
        state: 'PUBLISHED',
        eserviceTemplate: {
          name: 'Template Name',
          personalData: true,
          versions: [],
        },
      },
      instancesData: {
        results: [{ id: 'instance-1' }],
      },
    },
  }))

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
  SectionContainerSkeleton: () => <div data-testid="section-skeleton" />,
}))

vi.mock('@/router', () => ({
  useParams: () => ({
    eServiceTemplateId: 'template-id',
    eServiceTemplateVersionId: 'version-id',
  }),
}))

vi.mock('@/hooks/useActiveTab', () => ({
  useActiveTab: () => ({
    activeTab: state.activeTab,
    updateActiveTab: mockedUpdateActiveTab,
  }),
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getSingle: mockedGetSingle,
    getMyEServiceTemplateInstancesList: mockedGetInstances,
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: mockedUseQuery,
}))

vi.mock('../components', () => ({
  ConsumerEServiceTemplateDetails: () => <div data-testid="consumer-template-details" />,
  ConsumerEServiceTemplateInstancesTab: () => <div data-testid="consumer-template-instances-tab" />,
}))

vi.mock('../hooks/useGetConsumerEServiceTemplateActions', () => ({
  useGetConsumerEServiceTemplateActions: () => ({ actions: [] }),
}))

describe('ConsumerEServiceTemplateDetailsPage', () => {
  beforeEach(() => {
    state.activeTab = 'eserviceTemplateDetails'
    state.singleData = {
      hasRequesterRiskAnalysis: true,
      state: 'PUBLISHED',
      eserviceTemplate: {
        name: 'Template Name',
        personalData: true,
        versions: [],
      },
    }
    state.instancesData = {
      results: [{ id: 'instance-1' }],
    }

    mockedUpdateActiveTab.mockReset()
    mockedGetSingle.mockReturnValue({ queryKey: ['EServiceTemplateGetSingle'] })
    mockedGetInstances.mockReturnValue({
      queryKey: ['EServiceTemplatesGetMyTemplateInstancesList'],
    })

    mockedUseQuery.mockImplementation((queryOptions: { queryKey?: unknown[] }) => {
      const firstKey = queryOptions?.queryKey?.[0]

      if (firstKey === 'EServiceTemplateGetSingle') {
        return { data: state.singleData }
      }

      if (firstKey === 'EServiceTemplatesGetMyTemplateInstancesList') {
        return { data: state.instancesData }
      }

      return { data: undefined }
    })
  })

  it('shows details and instances tabs when at least one instance is available', () => {
    renderWithApplicationContext(<ConsumerEServiceTemplateDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('tab', { name: 'tabs.eserviceTemplateDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.eserviceTemplateInstances' })).toBeInTheDocument()
    expect(screen.getByTestId('consumer-template-details')).toBeInTheDocument()
  })

  it('hides tabs and instances panel when no instances are available', () => {
    state.instancesData = { results: [] }

    renderWithApplicationContext(<ConsumerEServiceTemplateDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.queryByRole('tab', { name: 'tabs.eserviceTemplateInstances' })
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('consumer-template-instances-tab')).not.toBeInTheDocument()
  })

  it('resets active tab to details when current tab is equal to eserviceTemplateInstances but there are no instances', async () => {
    state.activeTab = 'eserviceTemplateInstances'
    state.instancesData = { results: [] }

    renderWithApplicationContext(<ConsumerEServiceTemplateDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(mockedUpdateActiveTab).toHaveBeenCalledWith(null, 'eserviceTemplateDetails')
    })
  })
})
