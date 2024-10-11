import React from 'react'
import {
  mockUseCurrentRoute,
  mockUseGetActiveUserParty,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { SideNav } from '../SideNav'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import * as useIsRouteInCurrentSubtree from '../hooks/useIsRouteInCurrentSubtree'

mockUseCurrentRoute({ routeKey: 'TOS' })
vi.spyOn(useIsRouteInCurrentSubtree, 'useIsRouteInCurrentSubtree').mockReturnValue(() => false)

describe('SideNav', () => {
  it('should toggle collapsable menu items', async () => {
    mockUseJwt({ isAdmin: true, currentRoles: ['admin'] })
    mockUseGetActiveUserParty()
    const screen = renderWithApplicationContext(<SideNav />, {
      withRouterContext: true,
    })
    const user = userEvent.setup()

    const collapsable = screen.getByRole('button', { name: 'PROVIDE' })

    await user.click(collapsable)

    const link = screen.queryByRole('link', { name: 'PROVIDE_ESERVICE_LIST' })
    expect(link).toBeInTheDocument()

    await user.click(collapsable)
    expect(link).not.toBeInTheDocument()
  })
})
