import React from 'react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { SideNavItemLink, SideNavItemLinkSkeleton } from '../SideNavItemLink'
import { render } from '@testing-library/react'
import HomeIcon from '@mui/icons-material/Home'

describe('SideNavItemLink', () => {
  it('should match the snapshot', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => false })
    const { baseElement } = renderWithApplicationContext(<SideNavItemLink routeKey="TOS" />, {
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with EndIcon', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => false })
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink EndIcon={HomeIcon} routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with StartIcon', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => false })
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink StartIcon={HomeIcon} routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with StartIcon and EndIcon', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => true })
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink StartIcon={HomeIcon} EndIcon={HomeIcon} routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot indented', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => false })
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink indented routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot selected', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => true })
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink indented routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('SideNavItemLinkSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<SideNavItemLinkSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
