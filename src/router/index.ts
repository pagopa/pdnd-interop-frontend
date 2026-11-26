export { RouterProvider } from './components/RouterProvider'
export { useCurrentRoute } from './hooks/useCurrentRoute'

import * as _routes from './routes'

export const {
  useNavigate,
  useParams,
  useLocation,
  useAuthGuard,
  useGeneratePath,
  useSwitchPathLang,
} = _routes.hooks
export const { Link, Redirect, Breadcrumbs } = _routes.components

export const { getParentRoutes } = _routes.utils
export type RouteKey = _routes.RouteKey

/**
 * Key used to store the parent route's query parameters in navigation state.
 * Pass the current query string under this key when navigating to a child route.
 * Breadcrumbs use it to restore the query parameters when navigating to the parent.
 * Preserve the location state during subsequent navigation, such as tab changes.
 *
 * This way when you from the catalog, go to the details page, and then navigate back to the catalog,
 * the query parameters from the catalog are restored automatically.
 */
export const PARENT_QUERY_PARAMS_STATE_KEY = 'parentQueryParams'

export type NavigationTarget = {
  [K in RouteKey]: {
    to: K
    params?: ReturnType<typeof useParams<K>>
    urlParams?: Record<string, string>
  }
}[RouteKey]
export const routes = _routes.routes
