import { Paper } from '@mui/material'
import { Box } from '@mui/system'

type NoItemResultsProps = {
  children: string | React.ReactNode
  padding?: number
}
export const NoItemResults: React.FC<NoItemResultsProps> = ({ children, padding }) => {
  return (
    <Box bgcolor="#EEEEEE" p={padding ? padding : 4}>
      <Paper variant="elevation" sx={{ p: 2, justifyContent: 'center', display: 'flex' }}>
        {children}
      </Paper>
    </Box>
  )
}
