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
      path: '/erogazione/panoramica/fruitori/dettaglio',
      public: false,
      hideSideNav: false,
      authLevels: routes.PROVIDE_DASHBOARD.authLevels,
      element: expect.objectContaining({ type: ProviderDashboardConsumerDetail }),
    })
    expect(ProviderDashboardConsumerDetail).toBe(ProviderDashboardConsumerDetailComponent)
  })

  it('provides localized breadcrumb labels for consumer routes', () => {
    expect(itSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMERS).toBe('Tutti i fruitori')
    expect(enSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMERS).toBe('All consumers')
    expect(itSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL).toBe(
      'Comune di Empoli'
    )
    expect(enSharedComponents.routeLabels.PROVIDE_DASHBOARD_CONSUMER_DETAIL).toBe(
      'Empoli Municipality'
    )
  })
})
