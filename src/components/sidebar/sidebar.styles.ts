import { alpha, type SxProps, type Theme } from '@mui/material'

export const sidebarStyles = (theme: Theme, open: boolean): Record<string, SxProps> => ({
  container: {
    top: '0rem',
    background: theme.palette.background.paper,
    zIndex: open ? 10 : 1,
    display: 'block',
    position: 'sticky',
    height: 'calc(100vh - 8rem)',
    width: open ? '300px' : 'fit-content',
    overscrollBehavior: 'auto',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
  },

  itemButtonActive: {
    '&.active': {
      fontWeight: 'bold',
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      borderRight: '2px solid',
      borderColor: theme.palette.primary.dark,
      '.MuiTypography-root': {
        fontWeight: 600,
        color: theme.palette.primary.dark,
      },
      '.MuiListItemIcon-root': {
        color: theme.palette.primary.dark,
      },
    },
  },
  hamburgerBox: {
    marginTop: 'auto',
  },
  hamburgerIcon: {
    pt: 3,
    pb: 6,
    pl: 2,
    [theme.breakpoints.down('lg')]: {
      mr: 0,
    },
  },
})
