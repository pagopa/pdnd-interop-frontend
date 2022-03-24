import { Box } from '@mui/system'
import React, { FunctionComponent } from 'react'

export const PageBottomActions: FunctionComponent = ({ children }) => {
  return (
    <Box sx={{ mt: 8, display: 'flex' }}>
      {React.Children.map(children, (c, i) => (
        <Box key={i} sx={{ mr: 2 }}>
          {c}
        </Box>
      ))}
    </Box>
  )
}
