import { createElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, matchRoutes, RouterProvider } from 'react-router-dom'
import { isProviderOrConsumerRoute } from '@/router/router.utils'
import { routes } from '@/router'
import {
  ProviderDashboardConsumerDetail,
  ProviderDashboardConsumerList,
  ProviderDashboardPage,
} from '@/pages'
import ProviderDashboardPageComponent from '@/pages/ProviderDashboardPage/ProviderDashboard.page'
import ProviderDashboardConsumerListComponent from '@/pages/ProviderDashboardConsumerList/ProviderDashboardConsumerList.page'
import ProviderDashboardConsumerDetailComponent from '@/pages/ProviderDashboardConsumerDetail/ProviderDashboardConsumerDetail.page'
import itSharedComponents from '@/static/locales/it/shared-components.json'
import enSharedComponents from '@/static/locales/en/shared-components.json'

describe('checks router utils functions behavior', () => {
  it('checks that isProviderOrConsumerRoute return the right string - if provider', () => {
    const result = isProviderOrConsumerRoute('/erogazione/test/1')

    expect(result).toEqual('provider')
  })

  it('checks that isProviderOrConsumerRoute return the right string - if consumer', () => {
    const result = isProviderOrConsumerRoute('/fruizione/test/1')

    expect(result).toEqual('consumer')
  })

  it('checks that isProviderOrConsumerRoute return the right string - if nor provider or consumer', () => {
    const result = isProviderOrConsumerRoute('/test/1')

    expect(result).toBeNull()
  })

  it('registers the private provider dashboard with the sidebar and exact role contract', () => {
    expect(routes.PROVIDE_DASHBOARD).toMatchObject({
      path: '/erogazione/panoramica',
      public: false,
      hideSideNav: false,
      authLevels: ['admin', 'support', 'api', 'security', 'viewer'],
      element: expect.objectContaining({ type: ProviderDashboardPage }),
    })
    expect(routes.PROVIDE_DASHBOARD.authLevels).not.toContain('reviewer')
    expect(isProviderOrConsumerRoute(routes.PROVIDE_DASHBOARD.path)).toBe('provider')
  })

  it('exports the dashboard component through the page barrel', () => {
    expect(ProviderDashboardPage).toBe(ProviderDashboardPageComponent)
  })

  it('registers the consumer list route with the dashboard role contract', () => {
    expect(routes.PROVIDE_DASHBOARD_CONSUMERS).toMatchObject({
      path: '/erogazione/panoramica/fruitori',
      public: false,
      hideSideNav: false,
      authLevels: routes.PROVIDE_DASHBOARD.authLevels,
      element: expect.objectContaining({ type: ProviderDashboardConsumerList }),
    })
    expect(ProviderDashboardConsumerList).toBe(ProviderDashboardConsumerListComponent)
  })

  it('registers the consumer detail route with the dashboard role contract', () => {
    expect(routes.PROVIDE_DASHBOARD_CONSUMER_DETAIL).toMatchObject({
      path: '/erogazione/panoramica/fruitori/:consumerId',
      public: false,
      hideSideNav: false,
      authLevels: routes.PROVIDE_DASHBOARD.authLevels,
      element: expect.objectContaining({ type: ProviderDashboardConsumerDetail }),
    })
    expect(ProviderDashboardConsumerDetail).toBe(ProviderDashboardConsumerDetailComponent)
  })

  it('redirects the legacy static detail path to the consumer list', () => {
    expect(routes.PROVIDE_DASHBOARD_CONSUMER_DETAIL_LEGACY).toMatchObject({
      path: '/erogazione/panoramica/fruitori/dettaglio',
      redirect: 'PROVIDE_DASHBOARD_CONSUMERS',
      public: false,
      authLevels: routes.PROVIDE_DASHBOARD.authLevels,
    })
    expect(routes.PROVIDE_DASHBOARD_CONSUMER_DETAIL_LEGACY).not.toHaveProperty('element')

    // React Router ranks the static segment above `:consumerId`, so `dettaglio` never reaches GET.
    const candidates = [
      routes.PROVIDE_DASHBOARD_CONSUMER_DETAIL,
      routes.PROVIDE_DASHBOARD_CONSUMER_DETAIL_LEGACY,
    ]
    const match = (pathname: string) =>
      matchRoutes(
        candidates.map(({ key, path }) => ({ id: key, path })),
        pathname
      )?.[0]
    expect(match('/erogazione/panoramica/fruitori/dettaglio')?.route.id).toBe(
      'PROVIDE_DASHBOARD_CONSUMER_DETAIL_LEGACY'
    )
    const consumerId = '00000000-0000-4000-8000-000000000013'
    const detailMatch = match(`/erogazione/panoramica/fruitori/${consumerId}`)
    expect(detailMatch?.route.id).toBe('PROVIDE_DASHBOARD_CONSUMER_DETAIL')
    expect(detailMatch?.params).toEqual({ consumerId })
  })

  it('provides generic localized breadcrumb labels for consumer routes', () => {
    expect(itSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMERS).toBe('Tutti i fruitori')
    expect(enSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMERS).toBe('All consumers')
    expect(itSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL).toBe(
      'Dettaglio fruitore'
    )
    expect(enSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL).toBe('Consumer detail')
    expect(JSON.stringify([itSharedComponents, enSharedComponents])).not.toMatch(/Empoli/)
  })

  it('renders the generated legacy redirect and reaches the list, never the ID detail', async () => {
    const { reactRouterDOMRoutes } = await import('@/router/routes')
    const generated = reactRouterDOMRoutes[0].children!
    const legacy = generated.find(
      ({ path }) => path === '/it/erogazione/panoramica/fruitori/dettaglio'
    )!
    expect(legacy.element).toBeDefined()
    const router = createMemoryRouter(
      [
        legacy,
        {
          path: '/it/erogazione/panoramica/fruitori',
          element: createElement('div', null, 'Consumer list destination'),
        },
        {
          path: '/it/erogazione/panoramica/fruitori/:consumerId',
          element: createElement('div', null, 'Unexpected consumer detail'),
        },
      ],
      { initialEntries: ['/it/erogazione/panoramica/fruitori/dettaglio'] }
    )
    try {
      render(createElement(RouterProvider, { router }))
      await waitFor(() =>
        expect(router.state.location.pathname).toBe('/it/erogazione/panoramica/fruitori')
      )
      expect(screen.getByText('Consumer list destination')).toBeInTheDocument()
      expect(screen.queryByText('Unexpected consumer detail')).not.toBeInTheDocument()
    } finally {
      router.dispose()
    }
  })
})
