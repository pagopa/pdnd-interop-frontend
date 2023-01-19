import { routes } from '@/router/routes'
import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'
import useNavigateRouter from '../useNavigateRouter'

describe('tests for useNavigate router functions', () => {
  it('the navigate function should correctly navigate to the given routeKey path', () => {
    const { result, history } = renderHookWithApplicationContext(() => useNavigateRouter(), {
      withRouterContext: true,
    })

    expect(history.location.pathname).toBe('/')

    result.current.navigate('TOS')

    expect(history.location.pathname).toContain(routes.TOS.PATH.it)
  })

  it('the navigate function should correctly navigate to the given routeKey path with the dynamic segment set', () => {
    const { result, history } = renderHookWithApplicationContext(() => useNavigateRouter(), {
      withRouterContext: true,
    })

    expect(history.location.pathname).toBe('/')

    result.current.navigate('PROVIDE_AGREEMENT_READ', {
      params: { agreementId: 'test-agreementId' },
    })

    expect(history.location.pathname).toContain('test-agreementId')
  })

  it('the getRouteUrl function should correctly return the url of the given routeKey', () => {
    const { result } = renderHookWithApplicationContext(() => useNavigateRouter(), {
      withRouterContext: true,
    })

    expect(result.current.getRouteUrl('TOS')).toContain(routes.TOS.PATH.it)
  })

  it('the getRouteUrl function should correctly return the url of the given routeKey with the dynamic segment set', () => {
    const { result } = renderHookWithApplicationContext(() => useNavigateRouter(), {
      withRouterContext: true,
    })

    const routeUrl = result.current.getRouteUrl('PROVIDE_AGREEMENT_READ', {
      params: { agreementId: 'test-agreementId' },
    })

    expect(routeUrl).toContain('test-agreementId')
  })
})
