import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SidebarItemCollapsable } from '../SidebarItemCollapsable'
import HomeIcon from '@mui/icons-material/Home'

describe('SidebarItemCollapsable', () => {
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

  it('should render label and icon of root element', () => {
    render(<SidebarItemCollapsable {...defaultProps} />)
    expect(screen.getByText('item-root')).toBeInTheDocument()
  })

  it('should able to call handleExpandParent when clicked', () => {
    render(<SidebarItemCollapsable {...defaultProps} />)
    fireEvent.click(screen.getByRole('button'))
    expect(defaultProps.handleExpandParent).toHaveBeenCalled()
  })

  it('should able to show children when collapsable element is expanded', () => {
    render(<SidebarItemCollapsable {...defaultProps} isExpanded={true} />)
    expect(screen.queryByText('item-child-1')).toBeInTheDocument()
  })

  it('should not able to show children when not expanded', () => {
    render(<SidebarItemCollapsable {...defaultProps} isExpanded={false} />)
    expect(screen.queryByText('item-child-1')).not.toBeInTheDocument()
  })

  it('should render divider if divider is passed as a props', () => {
    render(<SidebarItemCollapsable {...defaultProps} divider={true} />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
})
