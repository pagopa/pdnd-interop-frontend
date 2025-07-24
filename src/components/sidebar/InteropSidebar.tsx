import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { InteropSidebarItems } from './InteropSidebarItems'
import { useGetSidebarItems } from './useGetSidebarItems'
import { useTranslation } from 'react-i18next'

export const InteropSidebar: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const interopRoutes = useGetSidebarItems()
  const [open, setIsOpen] = useState(true)
  const { t } = useTranslation('sidebar')

  return (
    <Sidebar
      labelMobile={t('navigationMenu')}
      mobile={mobile}
      open={open}
      onSidebarOpen={setIsOpen}
    >
      <InteropSidebarItems routes={interopRoutes} />
    </Sidebar>
  )
}
