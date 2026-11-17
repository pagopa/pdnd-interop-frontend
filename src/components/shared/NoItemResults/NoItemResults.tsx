import { Paper } from '@mui/material'
import { Box } from '@mui/system'

type NoItemResultsProps = {
  children: string | React.ReactNode
  padding?: number
  borderRadius?: number
}
export const NoItemResults: React.FC<NoItemResultsProps> = ({
  children,
  padding,
  borderRadius,
}) => {
  return (
    <Box bgcolor="#EEEEEE" p={padding ?? 4}>
      <Paper
        variant="elevation"
        sx={{
          p: 2,
          justifyContent: 'center',
          display: 'flex',
          borderRadius: borderRadius ?? 1,
        }}
      >
        {children}
      </Paper>
    </Box>
  )
}
