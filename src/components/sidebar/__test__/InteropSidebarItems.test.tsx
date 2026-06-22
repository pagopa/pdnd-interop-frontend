import { mockUseJwt } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'

import { renderWithSidebarContext } from './testing.sidebar.commons'
import { InteropSidebarItems } from '../InteropSidebarItems'
import { CatalogIcon, ConsumerIcon } from '@/icons'
import type { SidebarRoutes } from '../sidebar.types'

mockUseJwt()

const mockRoutes: SidebarRoutes = [
  {
    label: 'item-root-1',
    rootRouteKey: 'SUBSCRIBE_CATALOG_LIST',
    icon: CatalogIcon,
    children: [],
  },
  {
    icon: ConsumerIcon,
    label: 'item-root-2',
    rootRouteKey: 'PROVIDE_AGREEMENT_LIST',
    children: [
      { to: 'PROVIDE_AGREEMENT_LIST', label: 'item-child-1' },
      { to: 'SUBSCRIBE_PURPOSE_LIST', label: 'item-child-2' },
    ],
    divider: false,
  },
]
describe('InteropSidebarItems', () => {
  describe('render InteropSidebarItems on desktop', () => {
    beforeEach(() => {
      renderWithSidebarContext({
        children: <InteropSidebarItems routes={mockRoutes} />,
      })
    })

    it('should render the sidebar with routes', () => {
      expect(screen.getByText('item-root-1')).toBeInTheDocument()
      expect(screen.getByText('item-root-2')).toBeInTheDocument()
    })

    it('should be able to expand root menu item if it has children', async () => {
      const user = userEvent.setup()
      const menuItemExpandable = screen.getByText('item-root-2')

      // Check if the child items are not visible initially
      const childItem1 = screen.queryByText('item-child-1')
      const childItem2 = screen.queryByText('item-child-2')
      expect(childItem1).not.toBeInTheDocument()
      expect(childItem2).not.toBeInTheDocument()

      // Expand the collapsable menu
      await user.click(menuItemExpandable)
      expect(screen.getByText('item-child-1')).toBeInTheDocument()
      expect(screen.getByText('item-child-2')).toBeInTheDocument()
    })

    it('should be able to close menu and show only main sidebar icons', async () => {
      const user = userEvent.setup()
      const hamburgerIcon = screen.getByTestId('hamburger-box-icon')

      // Expand the collapsable menu
      await user.click(hamburgerIcon)

      expect(screen.queryByText('item-child-1')).not.toBeInTheDocument()
      expect(screen.queryByText('item-child-2')).not.toBeInTheDocument()
    })
  })

  describe('render InteropSidebarItems on mobile', () => {
    beforeEach(() => {
      renderWithSidebarContext({
        mobile: true,
        children: <InteropSidebarItems routes={mockRoutes} />,
      })
    })
    it('should render only burger icon when menu is closed', async () => {
      expect(screen.queryByText('item-root-1')).not.toBeInTheDocument()
      expect(screen.queryByText('item-root-2')).not.toBeInTheDocument()
    })

    it('should render root items when menu is open and root items are not expanded', async () => {
      const hamburgerMobileIcon = screen.getByTestId('hamburger-mobile-icon')
      const user = userEvent.setup()
      await user.click(hamburgerMobileIcon)

      expect(screen.getByText('item-root-1')).toBeInTheDocument()
      expect(screen.getByText('item-root-2')).toBeInTheDocument()
    })
  })
})
