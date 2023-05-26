import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { SideNavItemLink, SideNavItemLinkSkeleton } from '../SideNavItemLink'
import { render } from '@testing-library/react'
import HomeIcon from '@mui/icons-material/Home'
import { vi } from 'vitest'
import * as useIsRouteInCurrentSubtree from '../hooks/useIsRouteInCurrentSubtree'
import type { RouteKey } from '@/router'

const useIsRouteInCurrentSubtreeMock = (implementation = (_routeKey: RouteKey) => false) => {
  vi.spyOn(useIsRouteInCurrentSubtree, 'useIsRouteInCurrentSubtree').mockReturnValue(implementation)
}

describe('SideNavItemLink', () => {
  it('should match the snapshot', () => {
    useIsRouteInCurrentSubtreeMock(() => false)
    const { baseElement } = renderWithApplicationContext(<SideNavItemLink routeKey="TOS" />, {
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with EndIcon', () => {
    useIsRouteInCurrentSubtreeMock(() => false)
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink EndIcon={HomeIcon} routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with StartIcon', () => {
    useIsRouteInCurrentSubtreeMock(() => false)
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink StartIcon={HomeIcon} routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with StartIcon and EndIcon', () => {
    useIsRouteInCurrentSubtreeMock(() => true)
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink StartIcon={HomeIcon} EndIcon={HomeIcon} routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot indented', () => {
    useIsRouteInCurrentSubtreeMock(() => false)
    const { baseElement } = renderWithApplicationContext(
      <SideNavItemLink indented routeKey="TOS" />,
      {
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot selected', () => {
    useIsRouteInCurrentSubtreeMock(() => true)
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
