import { isProviderOrConsumerRoute } from '@/router/router.utils'
import { routes } from '@/router'
import { DashboardPage } from '@/pages'
import DashboardPageComponent from '@/pages/DashboardPage/Dashboard.page'

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
      element: expect.objectContaining({ type: DashboardPage }),
    })
    expect(routes.PROVIDE_DASHBOARD.authLevels).not.toContain('reviewer')
    expect(isProviderOrConsumerRoute(routes.PROVIDE_DASHBOARD.path)).toBe('provider')
  })

  it('exports the dashboard component through the page barrel', () => {
    expect(DashboardPage).toBe(DashboardPageComponent)
  })
})
