import { Box } from '@mui/system'
import React, { FunctionComponent } from 'react'

export const PageTopFilters: FunctionComponent = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
      {React.Children.map(children, (c, i) => (
        <Box key={i} sx={{ ml: 2 }}>
          {c}
        </Box>
      ))}
    </Box>
  )
}
