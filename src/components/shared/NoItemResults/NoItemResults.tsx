import { Paper } from '@mui/material'
import { Box } from '@mui/system'

type NoItemResultsProps = {
  children: string | React.ReactNode
}
export const NoItemResults: React.FC<NoItemResultsProps> = ({ children }) => {
  return (
    <Box bgcolor="#EEEEEE" p={4}>
      <Paper variant="elevation" sx={{ p: 2, justifyContent: 'center', display: 'flex' }}>
        {children}
      </Paper>
    </Box>
  )
}
