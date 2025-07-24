import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SidebarItemGroup } from '../components/SidebarItemGroup'
import HomeIcon from '@mui/icons-material/Home'
import { renderWithSidebarContext } from './testing.sidebar.commons'

describe('SidebarItemGroup', () => {
  const defaultProps = {
    notification: { show: true, content: 1 },
    label: 'item-root',
    isExpanded: false,
    isSelected: false,
    icon: HomeIcon,
    collapsed: false,
    children: <div data-testid="child-content">item-child-1</div>,
    to: '/test',
    handleExpandParent: vi.fn(),
  }

  beforeEach(() => {
    renderWithSidebarContext({
      children: <SidebarItemGroup {...defaultProps} renderOnCollapsed={<div>item-root</div>} />,
    })
  })

  it('should render label and icon of root element', () => {
    expect(screen.getByText('item-root')).toBeInTheDocument()
  })

  it('should able to call handleExpandParent when clicked', () => {
    fireEvent.click(screen.getByTestId('sidebar-item-group-button'))
    expect(defaultProps.handleExpandParent).toHaveBeenCalled()
  })

  it('should able to show children when collapsable element is expanded', () => {
    renderWithSidebarContext({
      children: (
        <SidebarItemGroup
          {...defaultProps}
          isExpanded={true}
          renderOnCollapsed={<div>item-root</div>}
        />
      ),
    })
    expect(screen.queryByText('item-child-1')).toBeInTheDocument()
  })

  it('should not able to show children when not expanded', () => {
    expect(screen.queryByText('item-child-1')).not.toBeInTheDocument()
  })

  it('should render divider if divider is passed as a props', () => {
    renderWithSidebarContext({
      children: (
        <SidebarItemGroup
          {...defaultProps}
          renderOnCollapsed={<div>item-root</div>}
          divider={true}
        />
      ),
    })
    expect(screen.getByTestId('sidebar-item-group-divider')).toBeInTheDocument()
  })
})
