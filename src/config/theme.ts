import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material'
import { theme as muiItaliaTheme } from '@pagopa/mui-italia'

export const theme = createTheme(
  deepmerge({ components: { MuiTooltip: { defaultProps: { placement: 'top' } } } }, muiItaliaTheme)
)

// {
//   ...muiItaliaTheme,
//   components: {
//     ...muiItaliaTheme.components,
//     MuiTooltip: {
//       ...muiItaliaTheme.components?.MuiTooltip,
//       defaultProps: {
//         ...muiItaliaTheme.components?.MuiTooltip?.defaultProps,
//         placement: 'top',
//       },
//     },
//   },
// }
