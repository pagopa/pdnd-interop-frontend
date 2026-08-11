import { useState } from 'react'
import { InteropSidebarItems } from './InteropSidebarItems'
import { useGetSidebarItems } from './useGetSidebarItems'
import { useTranslation } from 'react-i18next'
import { Sidenav } from '@pagopa/mui-italia/components/Sidenav'
export const InteropSidebar: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const interopRoutes = useGetSidebarItems()
  const [open, setIsOpen] = useState(true)
  const { t } = useTranslation('sidebar')

  return (
    <Sidenav
      labelMobile={t('navigationMenu')}
      mobile={mobile}
      open={open}
      onSidenavOpen={setIsOpen}
    >
      <InteropSidebarItems routes={interopRoutes} />
    </Sidenav>
  )
}
