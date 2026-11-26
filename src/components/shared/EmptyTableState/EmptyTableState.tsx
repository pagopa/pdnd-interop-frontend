import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Alert } from '@mui/material'
import { theme } from '@pagopa/mui-italia'

/** Loaded, successful empty table results; surrounding filters remain outside this panel. */
export function EmptyTableState({ message }: Readonly<{ message: string }>) {
  return (
    <Alert
      severity="info"
      icon={<ErrorOutlineIcon sx={{ width: '1.25rem', height: '1.25rem' }} />}
      role="status"
      aria-live="polite"
      sx={{
        minHeight: 200,
        border: '8px solid',
        borderColor: theme.colors.neutral.grey[100],
        borderRadius: 0,
        bgcolor: 'background.paper',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'text.secondary',
        fontWeight: 600,
        '& .MuiAlert-icon': { mr: 0, mb: 1, color: '#BCC2D6', opacity: 1 },
      }}
    >
      {message}
    </Alert>
  )
}
