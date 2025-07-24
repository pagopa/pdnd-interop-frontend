import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SidebarItem } from '../components/SidebarItem'
import HomeIcon from '@mui/icons-material/Home'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

describe('SidebarItemLink ', () => {
  const defaultProps = {
    label: 'Test Link',
    collapsed: false,
    notification: { show: true, content: 3 },
    isSelected: false,
    StartIcon: HomeIcon,
    EndIcon: ArrowForwardIcon,
    to: '/test-link',
  }

  it('should render label and icon ', () => {
    render(<SidebarItem {...defaultProps} />)
    expect(screen.getByText('Test Link')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-icon')).toBeInTheDocument()
  })

  it('should render notification badge with corrent number if notification object is provided', () => {
    render(<SidebarItem {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should render as collapsed ,it means just the StartIcon should be rendered', () => {
    render(<SidebarItem {...defaultProps} collapsed={true} />)
    expect(screen.queryByText('Test Link')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('sidebar-icon')).toHaveLength(1)
  })
})
