import { Box } from '@mui/system'
import { theme } from '@pagopa/interop-fe-commons'

export const NotificationBadgeDot = () => {
  return (
    <Box
      component="span"
      alignSelf="center"
      sx={{
        height: 8,
        width: 8,
        ml: 2,
        borderRadius: 5,
        background: theme.palette.primary.main,
      }}
    />
  )
}
