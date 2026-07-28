import React from 'react'
import { screen } from '@testing-library/react'
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
        eservice: {
          name: 'E-Service Name',
          descriptors: [{ id: 'descriptor-id', state: 'PUBLISHED', version: '1' }],
        },
      },
    })
  })

  it('shows both tabs and wires the view-keychains action for admin users', () => {
    renderPage()

    expect(screen.getByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.keychain' })).toBeInTheDocument()
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

  it('hides the tabs and the view-keychains action for viewer users', () => {
    mockUseJwt({ isAdmin: false, isViewer: true })

    renderPage()

    expect(screen.queryByRole('tab', { name: 'tabs.eserviceDetails' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'tabs.keychain' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('eservice-keychains-tab')).not.toBeInTheDocument()
    expect(screen.getByTestId('eservice-details-tab')).toBeInTheDocument()
    expect(screen.getByTestId('alerts')).toHaveAttribute('data-has-view-keychains', 'false')
  })
})
