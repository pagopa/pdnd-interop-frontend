import type { SvgIconComponent } from '@mui/icons-material'
import { type RouteKey } from '@/router'

export type SidebarRoutes = Array<{
  icon: SvgIconComponent
  label: string
  rootRouteKey: RouteKey
  hide?: boolean
  children?: SidebarChildRoutes
  divider?: boolean
  showNotification?: boolean
}>

export type Notification = {
  show: boolean
  content: number
}

export type SidebarChildRoutes = Array<{ to: RouteKey; hide?: boolean; label?: string }>
