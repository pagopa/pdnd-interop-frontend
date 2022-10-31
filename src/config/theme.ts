import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material'
import { theme as muiItaliaTheme } from '@pagopa/mui-italia'

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
        MuiInputLabel: { defaultProps: { shrink: true } },
      },
    },
    muiItaliaTheme
  )
)
