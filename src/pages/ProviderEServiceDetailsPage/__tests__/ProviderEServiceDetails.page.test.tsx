import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ProviderEServiceDetailsPage from '../ProviderEServiceDetails.page'
import type * as ReactQuery from '@tanstack/react-query'
import type * as Stores from '@/stores'

const { mockedGetDescriptorProvider, mockedUseQuery } = vi.hoisted(() => ({
  mockedGetDescriptorProvider: vi.fn(),
  mockedUseQuery: vi.fn(),
}))

const mockedNavigate = vi.fn()

mockUseJwt()

vi.mock('@/components/layout/containers/NewPageContainer', () => ({
  NewPageContainer: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

vi.mock('@/router', () => ({
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
  useNavigate: () => mockedNavigate,
}))

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({
  useMarkNotificationsAsRead: vi.fn(),
}))

vi.mock('@/hooks/useDrawerState', () => ({
  useDrawerState: () => ({ isOpen: false, openDrawer: vi.fn(), closeDrawer: vi.fn() }),
}))

vi.mock('@/stores', async (importOriginal) => ({
  ...(await importOriginal<typeof Stores>()),
  useDialog: () => ({ openDialog: vi.fn() }),
}))

vi.mock('@/hooks/useGetProviderEServiceActions', () => ({
  useGetProviderEServiceActions: () => ({
    primaryAction: undefined,
    secondaryAction: undefined,
    menuActions: [],
    headerInfoActions: [],
  }),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorProvider: mockedGetDescriptorProvider,
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQuery: mockedUseQuery,
}))

vi.mock('../components/ProviderEServiceDetailsTab/ProviderEServiceDetailsTab', () => ({
  ProviderEserviceDetailsTab: () => <div data-testid="eservice-details-tab" />,
}))

vi.mock('../components/ProviderEServiceKeychainsTab/ProviderEServiceKeychainsTab', () => ({
  ProviderEserviceKeychainsTab: () => <div data-testid="eservice-keychains-tab" />,
}))

vi.mock('../components/ProviderEServiceMonitoringTab/ProviderEServiceMonitoringTab', () => ({
  ProviderEServiceMonitoringTab: ({
    eserviceName,
    dailyCallsPerConsumer,
  }: {
    eserviceName?: string
    dailyCallsPerConsumer?: number
  }) => (
    <div
      data-testid="eservice-monitoring-tab"
      data-eservice-name={eserviceName}
      data-daily-calls-per-consumer={dailyCallsPerConsumer}
    />
  ),
}))

vi.mock('../components/ProviderEServiceDetailsTab/ProviderEServiceDetailsAlerts', () => ({
  ProviderEServiceDetailsAlerts: ({ onViewKeychains }: { onViewKeychains?: () => void }) => (
    <div data-testid="alerts" data-has-view-keychains={String(Boolean(onViewKeychains))} />
  ),
}))

vi.mock('@/components/shared/EServiceVersionSelectorDrawer', () => ({
  EServiceVersionSelectorDrawer: () => <div data-testid="version-selector-drawer" />,
}))

function renderPage(search = '') {
  const history = createMemoryHistory({ initialEntries: [`/${search}`] })

  return renderWithApplicationContext(
    <ProviderEServiceDetailsPage />,
    {
      withReactQueryContext: true,
      withRouterContext: true,
    },
    history
  )
}

describe('ProviderEServiceDetailsPage', () => {
  beforeEach(() => {
    mockUseJwt()
    mockedGetDescriptorProvider.mockReturnValue({ queryKey: ['EServiceGetDescriptorProvider'] })
    mockedUseQuery.mockReturnValue({
      data: {
        id: 'descriptor-id',
        version: '1',
        state: 'PUBLISHED',
        dailyCallsPerConsumer: 2000,
        eservice: {
          name: 'E-Service Name',
          descriptors: [{ id: 'descriptor-id', state: 'PUBLISHED', version: '1' }],
        },
      },
    })
  })

  it('passes the loaded e-service name and configured threshold to monitoring', () => {
    renderPage('?tab=monitoring')
    expect(screen.getByTestId('eservice-monitoring-tab')).toHaveAttribute(
      'data-eservice-name',
      'E-Service Name'
    )
    expect(screen.getByTestId('eservice-monitoring-tab')).toHaveAttribute(
      'data-daily-calls-per-consumer',
      '2000'
    )
  })

  it('shows both tabs and wires the view-keychains action for admin users', () => {
    renderPage()

    expect(screen.getByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.keychain' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'tabs.eserviceDetails',
      'tabs.keychain',
      'tabs.monitoring',
    ])
    expect(screen.getByTestId('alerts')).toHaveAttribute('data-has-view-keychains', 'true')
  })

  it('shows the keychain tab and wires the view-keychains action for support users', () => {
    mockUseJwt({ isAdmin: false, isSupport: true })

    renderPage()

    expect(screen.getByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.keychain' })).toBeInTheDocument()
    expect(screen.getByTestId('alerts')).toHaveAttribute('data-has-view-keychains', 'true')
  })

  it('shows the keychain tab and wires the view-keychains action for security operators', () => {
    mockUseJwt({ isAdmin: false, isOperatorSecurity: true })

    renderPage()

    expect(screen.getByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.keychain' })).toBeInTheDocument()
    expect(screen.getByTestId('alerts')).toHaveAttribute('data-has-view-keychains', 'true')
  })

  it('hides the keychain tab and view-keychains action from API operators', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })

    renderPage()

    expect(screen.getByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'tabs.keychain' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('eservice-keychains-tab')).not.toBeInTheDocument()
    expect(screen.getByTestId('alerts')).toHaveAttribute('data-has-view-keychains', 'false')
  })

  it('normalizes the keychains tab URL for API operators', () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })

    const { history } = renderPage('?tab=keychains')

    expect(screen.getByTestId('eservice-details-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('eservice-keychains-tab')).not.toBeInTheDocument()
    expect(history.location.search).toBe('?tab=eserviceDetails')
  })

  it('shows details and monitoring tabs but hides keychains for viewer users', () => {
    mockUseJwt({ isAdmin: false, isViewer: true })

    renderPage()

    expect(screen.getByRole('tab', { name: 'tabs.eserviceDetails' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'tabs.monitoring' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'tabs.keychain' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('eservice-keychains-tab')).not.toBeInTheDocument()
    expect(screen.getByTestId('eservice-details-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('eservice-monitoring-tab')).not.toBeInTheDocument()
    expect(screen.getByTestId('alerts')).toHaveAttribute('data-has-view-keychains', 'false')
  })

  it.each([
    ['admin', {}],
    ['API operator', { isAdmin: false, isOperatorAPI: true }],
    ['security operator', { isAdmin: false, isOperatorSecurity: true }],
    ['viewer', { isAdmin: false, isViewer: true }],
  ])('opens the monitoring tab from ?tab=monitoring for %s users', (_, jwt) => {
    mockUseJwt(jwt)

    const { history } = renderPage('?tab=monitoring')

    expect(screen.getByRole('tab', { name: 'tabs.monitoring' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByTestId('eservice-monitoring-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('eservice-details-tab')).not.toBeInTheDocument()
    expect(history.location.search).toBe('?tab=monitoring')
  })

  it('writes the monitoring tab to the URL when clicked', () => {
    const { history } = renderPage()

    fireEvent.click(screen.getByRole('tab', { name: 'tabs.monitoring' }))

    expect(history.location.search).toBe('?tab=monitoring')
  })

  it('normalizes unknown tab values to the e-service details tab', () => {
    const { history } = renderPage('?tab=unknown')

    expect(screen.getByTestId('eservice-details-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('eservice-monitoring-tab')).not.toBeInTheDocument()
    expect(history.location.search).toBe('?tab=eserviceDetails')
  })

  it('keeps normalizing the keychains tab for viewer users', () => {
    mockUseJwt({ isAdmin: false, isViewer: true })

    const { history } = renderPage('?tab=keychains')

    expect(screen.queryByTestId('eservice-keychains-tab')).not.toBeInTheDocument()
    expect(screen.getByTestId('eservice-details-tab')).toBeInTheDocument()
    expect(history.location.search).toBe('?tab=eserviceDetails')
  })

  it('does not show the delegator archiving alert when the descriptor is ARCHIVED and the request targets the current descriptor', () => {
    mockUseJwt({ jwt: { organizationId: 'delegator-id' } })

    mockedUseQuery.mockReturnValue({
      data: {
        id: 'descriptor-id',
        version: '1',
        state: 'ARCHIVED',
        archivingSchedule: { scope: 'ESERVICE' },
        archivedAt: '2026-12-01T00:00:00.000Z',
        delegation: {
          delegator: { id: 'delegator-id', name: 'Delegator name' },
          delegate: { id: 'delegate-id', name: 'Delegate name' },
        },
        eservice: {
          name: 'E-Service Name',
          descriptors: [{ id: 'descriptor-id', state: 'ARCHIVED', version: '1' }],
          delegatedArchivingRequest: {
            requestedAt: '2026-12-01T00:00:00.000Z',
            descriptorId: 'descriptor-id',
            requesterId: 'requester-id',
            gracePeriodDays: 30,
            archivingReason: 'Motivo archiviazione',
          },
        },
      },
    })

    renderPage()

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the delegator archiving alert when the descriptor is ARCHIVED but the request targets the whole e-service', () => {
    mockUseJwt({ jwt: { organizationId: 'delegator-id' } })

    mockedUseQuery.mockReturnValue({
      data: {
        id: 'descriptor-id',
        version: '1',
        state: 'ARCHIVED',
        archivingSchedule: { scope: 'ESERVICE' },
        archivedAt: '2026-12-01T00:00:00.000Z',
        delegation: {
          delegator: { id: 'delegator-id', name: 'Delegator name' },
          delegate: { id: 'delegate-id', name: 'Delegate name' },
        },
        eservice: {
          name: 'E-Service Name',
          descriptors: [{ id: 'descriptor-id', state: 'ARCHIVED', version: '1' }],
          delegatedArchivingRequest: {
            requestedAt: '2026-12-01T00:00:00.000Z',
            requesterId: 'requester-id',
            gracePeriodDays: 30,
            archivingReason: 'Motivo archiviazione',
          },
        },
      },
    })

    renderPage()

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
