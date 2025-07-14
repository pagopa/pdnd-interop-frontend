import React from 'react'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { InteropSidebar } from '../InteropSidebar'
import userEvent from '@testing-library/user-event'
// import { vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { SidebarRoutes } from '../sidebar.types'
// import * as useIsRouteInCurrentSubtree from '@/components/layout/SideNav/hooks/useIsRouteInCurrentSubtree'
import { ConsumerIcon } from '@/assets'
import { CatalogIcon } from '@/assets/CatalogIcon'
import { RouteKey } from '@/router'

// mockUseCurrentRoute({ routeKey: 'DEFAULT' })
mockUseJwt()

// vi.spyOn(useIsRouteInCurrentSubtree, 'useIsRouteInCurrentSubtree').mockReturnValue(() => false)

describe('InteropSidebar', () => {
  const mockRoutes: SidebarRoutes = [
    {
      label: 'item-root-1',
      rootRouteKey: 'SUBSCRIBE_CATALOG_LIST',
      icon: CatalogIcon,
      children: [],
    },
    {
      showNotification: false,
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

  it('should render the sidebar with routes', () => {
    renderWithApplicationContext(<InteropSidebar routes={mockRoutes} mobile={false} />, {
      withRouterContext: true,
    })

    expect(screen.getByText('item-root-1')).toBeInTheDocument()
    expect(screen.getByText('item-root-2')).toBeInTheDocument()
  })

  it('should be able to expand root menu item if it has children', async () => {
    renderWithApplicationContext(<InteropSidebar routes={mockRoutes} mobile={false} />, {
      withRouterContext: true,
    })
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

  it('should be able to collapse menu and show only root item icons', async () => {
    renderWithApplicationContext(<InteropSidebar routes={mockRoutes} mobile={false} />, {
      withRouterContext: true,
    })

    const user = userEvent.setup()
    const hamburgerIcon = screen.getByTestId('hamburger-box-icon')

    // Expand the collapsable menu
    await user.click(hamburgerIcon)

    expect(screen.queryByText('item-child-1')).not.toBeInTheDocument()
    expect(screen.queryByText('item-child-2')).not.toBeInTheDocument()
  })

  it.only('should be able to select a route', async () => {
    renderWithApplicationContext(<InteropSidebar routes={mockRoutes} mobile={false} />, {
      withRouterContext: true,
    })

    const user = userEvent.setup()
    const menuItem = screen.getByText('item-root-1')
    await user.click(menuItem)

    // Assert aria-selected or selected class

    await waitFor(() => {
      screen.debug()
      // expect(screen.getByTestId('item-root-1')).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('mobile sidebar', () => {
    it('should render only burger icon when menu is closed', async () => {
      renderWithApplicationContext(<InteropSidebar routes={mockRoutes} mobile={true} />, {
        withRouterContext: true,
      })

      expect(screen.queryByText('item-root-1')).not.toBeInTheDocument()
      expect(screen.queryByText('item-root-2')).not.toBeInTheDocument()
    })

    it('should render root items when menu is open and root items are not expanded', async () => {
      renderWithApplicationContext(<InteropSidebar routes={mockRoutes} mobile={true} />, {
        withRouterContext: true,
      })

      const hamburgerMobileIcon = screen.getByTestId('hamburger-mobile-icon')
      const user = userEvent.setup()
      await user.click(hamburgerMobileIcon)

      expect(screen.getByText('item-root-1')).toBeInTheDocument()
      expect(screen.getByText('item-root-2')).toBeInTheDocument()
    })
  })
})
