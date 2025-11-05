import React from 'react'
import { render, screen } from '@testing-library/react'
import { SidebarItem } from '../components/SidebarItem'
import HomeIcon from '@mui/icons-material/Home'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Sidebar } from '../components/Sidebar'

describe('SidebarItem ', () => {
  const defaultProps = {
    label: 'Test Link',
    notification: 3,
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

  it('should render just icon when from context open is false, it means just the StartIcon should be rendered', () => {
    render(
      <Sidebar open={false} onSidebarOpen={vi.fn()} labelMobile="test" mobile={false}>
        <SidebarItem {...defaultProps} />
      </Sidebar>
    )
    expect(screen.queryByText('Test Link')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('sidebar-icon')).toHaveLength(1)
  })
})
