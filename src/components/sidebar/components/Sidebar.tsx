import { Divider, IconButton, List, Tooltip, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { createContext } from '@/utils/common.utils'
import { useTranslation } from 'react-i18next'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState } from 'react'
import { sidebarStyles } from '../sidebar.styles'

type SidebarContextProps = {
  /**
   *  Open state of the sidebar
   */
  open: boolean
  onSidebarOpen: (open: boolean) => void
  mobile: boolean
}

const { Provider, useContext } = createContext<SidebarContextProps>('SidebarContext', {
  mobile: false,
  open: true,
  onSidebarOpen: () => {},
})

export { SidebarContextProvider, useContext as useSidebarContext }

type SidebarContextProviderProps = {
  children: React.ReactNode
  open: boolean
  onSidebarOpen: (value: boolean) => void
  mobile: boolean
}
const SidebarContextProvider: React.FC<SidebarContextProviderProps> = ({
  children,
  open,
  onSidebarOpen,
  mobile,
}) => {
  const providerValue = React.useMemo(() => {
    return {
      open,
      onSidebarOpen,
      mobile,
    }
  }, [open, onSidebarOpen, mobile])

  return <Provider value={providerValue}>{children}</Provider>
}

export function Sidebar({
  children,
  open,
  onSidebarOpen,
  mobile,
  labelMobile,
}: SidebarContextProps & { children: React.ReactNode; labelMobile: string }) {
  const theme = useTheme()

  const styles = sidebarStyles(theme, open)

  return (
    <SidebarContextProvider mobile={mobile} open={open} onSidebarOpen={onSidebarOpen}>
      {!mobile ? (
        <Box sx={styles.container} component="aside">
          <Stack component="nav" role="navigation" aria-expanded={!open}>
            <List disablePadding sx={{ marginTop: 1 }}>
              {children}
            </List>
            <HamburgerBox open={open} handleSidebarOpen={() => onSidebarOpen(!open)} />
          </Stack>
        </Box>
      ) : (
        <SidebarMobile labelMobile={labelMobile}>{children}</SidebarMobile>
      )}
    </SidebarContextProvider>
  )
}

type HamburgerMenuBoxProps = {
  open: boolean
  handleSidebarOpen: () => void
}

const HamburgerBox: React.FC<HamburgerMenuBoxProps> = ({ open, handleSidebarOpen }) => {
  const theme = useTheme()
  const styles = sidebarStyles(theme, open)
  const { t } = useTranslation('sidebar')
  const tooltipTitle = t(!open ? 'expand' : 'collapse')

  return (
    <Box sx={styles.hamburgerBox} data-testid="hamburger-box-icon">
      <Divider orientation="horizontal" />
      <Box sx={styles.hamburgerIcon}>
        <Tooltip placement="right" title={tooltipTitle}>
          <IconButton
            sx={{ padding: { xs: 1 } }}
            aria-label="open or close sidebar"
            onClick={handleSidebarOpen}
            size="large"
          >
            <MenuIcon sx={{ fill: '#17324D' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

const SidebarMobile: React.FC<{ children: React.ReactNode; labelMobile: string }> = ({
  children,
  labelMobile,
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar)
  }

  return (
    <>
      <Box display="flex" flexDirection="row" padding={1}>
        <Tooltip placement="right" title="Menu">
          <IconButton
            sx={{ padding: { xs: 1 } }}
            data-testid="hamburger-mobile-icon"
            aria-label="hamburger-mobile-icon"
            onClick={handleOpenSidebar}
            size="large"
          >
            <MenuIcon color="disabled" />
          </IconButton>
        </Tooltip>
        <Typography ml={1} mt={1} variant="h6" component="h6">
          {labelMobile}
        </Typography>
      </Box>
      <Divider orientation="horizontal" component="div" />
      {isOpenSidebar && (
        <>
          <List disablePadding sx={{ marginTop: 1 }}>
            {children}
          </List>
        </>
      )}
    </>
  )
}
