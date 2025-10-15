import { Sidebar } from '../components/Sidebar'
import { renderWithApplicationContext } from '@/utils/testing.utils'

export const renderWithSidebarContext = ({
  mobile = false,
  open = true,
  children,
}: { mobile?: boolean; open?: boolean; children?: React.ReactNode } = {}) => {
  return renderWithApplicationContext(
    <Sidebar open={open} labelMobile="sidebar-mock-test" mobile={mobile} onSidebarOpen={vi.fn()}>
      {children}
    </Sidebar>,
    {
      withRouterContext: true,
    }
  )
}
