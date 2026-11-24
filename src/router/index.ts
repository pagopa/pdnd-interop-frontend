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
export type NavigationTarget = {
  [K in RouteKey]: {
    to: K
    params?: ReturnType<typeof useParams<K>>
    urlParams?: Record<string, string>
  }
}[RouteKey]
export const routes = _routes.routes
