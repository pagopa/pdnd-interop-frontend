import { InteropSidebarRoutes } from './InteropSidebarRoutes'
import { useGetSidebarItems } from './useGetSidebarItems'

export const InteropSidebar: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const interopRoutes = useGetSidebarItems()
  return <InteropSidebarRoutes routes={interopRoutes} />
}
