import { renderHook } from '@testing-library/react'
import { useGetSidebarItems } from '../useGetSidebarItems'
import { mockUseGetActiveUserParty, mockUseJwt } from '@/utils/testing.utils'
import { CatalogIcon } from '@/assets/CatalogIcon'
import { SidebarRoutes } from '../sidebar.types'

const routes = vi.mock('@/router', () => ({
  routes: {
    SUBSCRIBE_CATALOG_LIST: { authLevels: ['admin'] },
    PROVIDE_AGREEMENT_LIST: { authLevels: ['admin'] },
    PROVIDE_PURPOSE_LIST: { authLevels: ['admin'] },
  },
  RouteKey: {},
}))

describe('useGetSidebarItems', () => {
  it('should return empty navigation list if jwt not contain roles', () => {
    mockUseJwt({ currentRoles: [] })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSidebarItems())
    expect(result.current).toEqual([])
  })

  it('should return the entire navigation list for admin', () => {
    mockUseJwt({ currentRoles: ['admin'], isOrganizationAllowedToProduce: true })
    mockUseGetActiveUserParty()
    const { result } = renderHook(() => useGetSidebarItems())

    expect(result.current.length).toBe(6)
    // expect(result.current).toMatchInlineSnapshot(`
    //   [
    //     {
    //       "children": [],
    //       "divider": true,
    //       "icon": [Function],
    //       "rootRouteKey": "SUBSCRIBE_CATALOG_LIST",
    //     },
    //     {
    //       "children": [
    //         {
    //           "label": "Richieste inoltrate",
    //           "to": "PROVIDE_AGREEMENT_LIST",
    //         },
    //         {
    //           "label": "Finalità inoltrate",
    //           "to": "PROVIDE_PURPOSE_LIST",
    //         },
    //       ],
    //       "divider": false,
    //       "icon": [Function],
    //       "label": "Fruizione",
    //       "rootRouteKey": "PROVIDE_AGREEMENT_LIST",
    //       "showNotification": false,
    //     },
    //   ]
    // `)
  })
})
