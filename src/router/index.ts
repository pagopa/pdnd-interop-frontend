export { RouterProvider } from './components/RouterProvider'
export { useCurrentRoute } from './hooks/useCurrentRoute'

import * as _routes from './routes'

export const { useNavigate, useParams, useLocation, useAuthGuard, useGeneratePath } = _routes.hooks
export const { Link, Redirect, Breadcrumbs } = _routes.components
export const { getParentRoutes } = _routes.utils
export type RouteKey = _routes.RouteKey
