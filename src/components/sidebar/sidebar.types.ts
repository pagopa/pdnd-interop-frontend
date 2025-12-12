import type { SvgIconComponent } from '@mui/icons-material'
import { type RouteKey } from '@/router'

export type SidebarRoute = {
  icon: SvgIconComponent
  label: string
  rootRouteKey: RouteKey
  hide?: boolean
  children?: SidebarChildRoutes
  divider?: boolean
}
export type SidebarRoutes = Array<SidebarRoute>

export type SidebarChildRoutes = Array<{ to: RouteKey; hide?: boolean; label: string }>
