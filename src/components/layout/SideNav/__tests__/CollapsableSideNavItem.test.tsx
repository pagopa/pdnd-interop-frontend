import React from 'react'
import { CollapsableSideNavItem } from '../CollapsableSideNavItem'
import { render } from '@testing-library/react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const CollapsableSideNavItemTest = ({
  isOpen,
  toggleCollapse = () => undefined,
}: {
  isOpen: boolean
  toggleCollapse?: (id: string | undefined) => void
}) => {
  return (
    <CollapsableSideNavItem
      item={{
        id: 'test',
        routeKey: 'PROVIDE',
        children: ['PROVIDE_AGREEMENT_LIST', 'PROVIDE_ESERVICE_LIST'],
      }}
      isOpen={isOpen}
      toggleCollapse={toggleCollapse}
    />
  )
}

const renderCollapsableSideNavItem = ({
  isOpen,
  toggleCollapse,
}: {
  isOpen: boolean
  toggleCollapse?: (id: string | undefined) => void
}) => {
  return render(<CollapsableSideNavItemTest isOpen={isOpen} toggleCollapse={toggleCollapse} />)
}

const renderCollapsableSideNavItemWithContext = ({
  isOpen,
  toggleCollapse,
}: {
  isOpen: boolean
  toggleCollapse?: (id: string | undefined) => void
}) => {
  return renderWithApplicationContext(
    <CollapsableSideNavItemTest isOpen={isOpen} toggleCollapse={toggleCollapse} />,
    {
      withRouterContext: true,
    }
  )
}

describe('CollapsableSideNavItem', () => {
  it('should match the snapshot (closed - selected)', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: (item) => item === 'PROVIDE_AGREEMENT_LIST' })
    const { baseElement } = renderCollapsableSideNavItem({ isOpen: false })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (closed - not selected)', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => false })
    const { baseElement } = renderCollapsableSideNavItem({ isOpen: false })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (opened - selected)', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: (item) => item === 'PROVIDE_AGREEMENT_LIST' })
    const { baseElement } = renderCollapsableSideNavItemWithContext({ isOpen: true })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (opened - not selected)', () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => false })
    const { baseElement } = renderCollapsableSideNavItemWithContext({ isOpen: true })
    expect(baseElement).toMatchSnapshot()
  })

  it('should fire the tooggleCollapse callback function on click', async () => {
    mockUseCurrentRoute({ isRouteInCurrentSubtree: () => false })
    const toggleCollapseFn = vi.fn()
    const screen = renderCollapsableSideNavItemWithContext({
      isOpen: true,
      toggleCollapse: toggleCollapseFn,
    })

    const user = userEvent.setup()
    const collapse = screen.getByRole('button')
    await user.click(collapse)
    expect(toggleCollapseFn).toHaveBeenCalledWith('test')
  })
})
