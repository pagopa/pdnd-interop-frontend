import { Box, Typography } from '@mui/material'

export type NoDataBoxProps = {
  label: string
  isInTab?: boolean
}

const NoDataBox: React.FC<NoDataBoxProps> = ({ label, isInTab }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'grey.200',
        p: 2,
        mt: isInTab ? 5 : 0,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          justifyContent: 'center',
          borderRadius: 1,
          display: 'flex',
          py: 2,
        }}
      >
        <Typography variant="body2" textAlign="center">
          {label}
        </Typography>
      </Box>
    </Box>
  )
}

export default NoDataBox
