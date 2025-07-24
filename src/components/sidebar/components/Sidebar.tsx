import { Divider, IconButton, List, Tooltip, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { createContext } from '@/utils/common.utils'
import { useTranslation } from 'react-i18next'
import MenuIcon from '@mui/icons-material/Menu'
import React from 'react'
import { sidebarStyles } from '../sidebar.styles'

type SidebarProps = {
  isCollapsed: boolean
  onToggleCollapse: (isCollaped: boolean) => void
}

const { Provider, useContext } = createContext<SidebarProps>('SidebarContext', {
  isCollapsed: false,
  onToggleCollapse: () => {},
})

export { SidebarContextProvider, useContext as useSidebarContext }

type SidebarContextProviderProps = {
  children: React.ReactNode
  isCollapsed: boolean
  onToggleCollapse: (value: boolean) => void
}
const SidebarContextProvider: React.FC<SidebarContextProviderProps> = ({
  children,
  isCollapsed,
  onToggleCollapse,
}) => {
  const providerValue = React.useMemo(() => {
    return {
      isCollapsed,
      onToggleCollapse,
    }
  }, [isCollapsed, onToggleCollapse])

  return <Provider value={providerValue}>{children}</Provider>
}

export function Sidebar({
  children,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps & { children: React.ReactNode }) {
  const theme = useTheme()
  const styles = sidebarStyles(theme, isCollapsed)

  console.log('contextValue', isCollapsed)
  console.log('context invece', { isCollapsed, onToggleCollapse })
  return (
    <SidebarContextProvider isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
      <Box sx={styles.container} component="aside">
        <Stack component="nav" role="navigation" aria-expanded={!isCollapsed}>
          <List disablePadding sx={{ marginTop: 1 }}>
            {children}
          </List>
          <HamburgerBox
            collapsed={isCollapsed}
            handleCollapsed={() => onToggleCollapse(!isCollapsed)}
          />
        </Stack>
      </Box>
    </SidebarContextProvider>
  )
}

type HamburgerMenuBoxProps = {
  collapsed: boolean
  handleCollapsed: () => void
}

const HamburgerBox: React.FC<HamburgerMenuBoxProps> = ({ collapsed, handleCollapsed }) => {
  const theme = useTheme()
  const styles = sidebarStyles(theme, collapsed)
  const { t } = useTranslation('sidebar')
  const tooltipTitle = t(!collapsed ? 'collapse' : 'expand')

  return (
    <Box sx={styles.hamburgerBox} data-testid="hamburger-box-icon">
      <Divider orientation="horizontal" />
      <Box sx={styles.hamburgerIcon}>
        <Tooltip placement="right" title={tooltipTitle}>
          <IconButton
            sx={{ padding: { xs: 1 } }}
            aria-label="open or close sidebar"
            onClick={handleCollapsed}
            size="large"
          >
            <MenuIcon sx={{ fill: '#17324D' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
