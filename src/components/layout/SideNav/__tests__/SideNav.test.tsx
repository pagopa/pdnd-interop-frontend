import React from 'react'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { SideNav, SideNavSkeleton } from '../SideNav'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import * as useIsRouteInCurrentSubtree from '../hooks/useIsRouteInCurrentSubtree'

mockUseCurrentRoute({ routeKey: 'TOS' })
vi.spyOn(useIsRouteInCurrentSubtree, 'useIsRouteInCurrentSubtree').mockReturnValue(() => false)

describe('SideNav', () => {
  it('should match the snapshot', () => {
    mockUseJwt({ isAdmin: true, currentRoles: ['admin'] })
    const { baseElement } = renderWithApplicationContext(<SideNav />, { withRouterContext: true })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot while user security operator', () => {
    mockUseJwt({ isAdmin: false, currentRoles: ['security'] })
    const { baseElement } = renderWithApplicationContext(<SideNav />, { withRouterContext: true })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot while user api operator', () => {
    mockUseJwt({ isAdmin: false, currentRoles: ['api'] })
    const { baseElement } = renderWithApplicationContext(<SideNav />, { withRouterContext: true })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot while user is security and api operator', () => {
    mockUseJwt({ isAdmin: false, currentRoles: ['api', 'security'] })
    const { baseElement } = renderWithApplicationContext(<SideNav />, { withRouterContext: true })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in loading state (skeleton)', () => {
    mockUseJwt({ jwt: undefined })
    const { baseElement } = renderWithApplicationContext(<SideNav />, { withRouterContext: true })
    expect(baseElement).toMatchSnapshot()
  })

  it('should toggle collapsable menu items', async () => {
    mockUseJwt({ isAdmin: true, currentRoles: ['admin'] })
    const screen = renderWithApplicationContext(<SideNav />, { withRouterContext: true })
    const user = userEvent.setup()
    const collapsable = screen.getByRole('button', { name: 'PROVIDE' })

    await user.click(collapsable)

    const link = screen.queryByRole('link', { name: 'PROVIDE_ESERVICE_LIST' })
    expect(link).toBeInTheDocument()

    await user.click(collapsable)
    expect(link).not.toBeInTheDocument()
  })
})

describe('SideNavSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<SideNavSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
