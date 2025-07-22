import { InteropSidebar } from './InteropSidebar'
import { useGetSidebarItems } from './useGetSidebarItems'

type SidebarProps = {
  mobile: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile }) => {
  const interopRoutes = useGetSidebarItems()
  return <InteropSidebar routes={interopRoutes} mobile={mobile} />
}
