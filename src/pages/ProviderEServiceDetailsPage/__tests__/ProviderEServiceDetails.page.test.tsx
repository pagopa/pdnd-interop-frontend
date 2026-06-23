import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import ProviderEServiceDetailsPage from '../ProviderEServiceDetails.page'
import { EServiceQueries } from '@/api/eservice'
import { queryClient } from '@/config/query-client'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({
  useMarkNotificationsAsRead: vi.fn(),
}))

vi.mock('@/hooks/useGetProviderEServiceActions', () => ({
  useGetProviderEServiceActions: () => ({
    primaryAction: undefined,
    secondaryAction: undefined,
    menuActions: [],
    headerInfoActions: [],
  }),
}))

vi.mock('../components/ProviderEServiceDetailsTab/ProviderEServiceDetailsTab', () => ({
  ProviderEserviceDetailsTab: () => <div>ProviderEserviceDetailsTab</div>,
}))

vi.mock('../components/ProviderEServiceKeychainsTab/ProviderEServiceKeychainsTab', () => ({
  ProviderEserviceKeychainsTab: () => <div>ProviderEserviceKeychainsTab</div>,
}))

vi.mock('@/components/shared/EServiceVersionSelectorDrawer', () => ({
  EServiceVersionSelectorDrawer: () => null,
}))

const eserviceId = 'eservice-id'
const descriptorId = 'descriptor-id'

function renderPage(search = '') {
  mockUseParams({ eserviceId, descriptorId })

  queryClient.setQueryData(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId).queryKey,
    createMockEServiceDescriptorProvider({
      id: descriptorId,
      eservice: {
        id: eserviceId,
        descriptors: [
          {
            id: descriptorId,
            state: 'PUBLISHED',
            version: '1',
            audience: [],
          },
        ],
      },
    })
  )

  const history = createMemoryHistory({ initialEntries: [`/${search}`] })

  return renderWithApplicationContext(
    <ProviderEServiceDetailsPage />,
    {
      withReactQueryContext: true,
      withRouterContext: true,
      withDialogContext: true,
    },
    history
  )
}

describe('ProviderEServiceDetailsPage', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('shows the keychain tab to admins', async () => {
    mockUseJwt({ isAdmin: true, isOperatorAPI: false })

    renderPage()

    expect(await screen.findByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.keychain' })).toBeInTheDocument()
  })

  it('shows the keychain tab to support users', async () => {
    mockUseJwt({ isAdmin: false, isSupport: true })

    renderPage()

    expect(await screen.findByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.keychain' })).toBeInTheDocument()
  })

  it('shows the keychain tab to security operators', async () => {
    mockUseJwt({ isAdmin: false, isOperatorSecurity: true })

    renderPage()

    expect(await screen.findByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.keychain' })).toBeInTheDocument()
  })

  it('hides the keychain tab from API operators', async () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })

    renderPage()

    expect(await screen.findByRole('tab', { name: 'tabs.eserviceDetails' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'tabs.keychain' })).not.toBeInTheDocument()
  })

  it('keeps API operators on the details tab when the URL requests the keychains tab', async () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })

    renderPage('?tab=keychains')

    expect(await screen.findByText('ProviderEserviceDetailsTab')).toBeInTheDocument()
    expect(screen.queryByText('ProviderEserviceKeychainsTab')).not.toBeInTheDocument()
  })
})
