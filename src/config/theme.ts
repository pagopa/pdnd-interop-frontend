import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material'
import { theme as muiItaliaTheme } from '@pagopa/mui-italia'

import type {} from '@mui/x-date-pickers/themeAugmentation'
import type {} from '@mui/types/OverridableComponentAugmentation'
import type {} from '@mui/lab/themeAugmentation'

export const theme = createTheme(
  deepmerge(
    {
      components: {
        MuiTooltip: { defaultProps: { placement: 'top' } },
        MuiChip: { defaultProps: { size: 'small' } },
        MuiTextField: {
          styleOverrides: { root: { width: '100%' } },
          defaultProps: { variant: 'outlined' },
        },
        MuiTabPanel: { styleOverrides: { root: { paddingRight: 0, paddingLeft: 0 } } },
        MuiTypography: { styleOverrides: { root: { wordBreak: 'break-word' } } },
        MuiDialog: {
          styleOverrides: {
            paper: {
              paddingRight: 32,
              paddingLeft: 32,
              paddingTop: 24,
              paddingBottom: 24,
            },
          },
        },
        MuiDialogContent: {
          styleOverrides: {
            root: {
              paddingRight: 0,
              paddingLeft: 0,
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        },
        MuiDialogActions: {
          styleOverrides: {
            root: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        },
      },
    },
    muiItaliaTheme
  )
)
