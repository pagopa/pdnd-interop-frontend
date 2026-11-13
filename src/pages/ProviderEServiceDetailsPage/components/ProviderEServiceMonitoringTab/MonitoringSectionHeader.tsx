import { Stack, Typography } from '@mui/material'

type MonitoringSectionHeaderProps = {
  id: string
  title: string
  description: string
  action?: React.ReactNode
}

/** Section heading matching the dashboard page header hierarchy, with an optional side action. */
export function MonitoringSectionHeader({
  id,
  title,
  description,
  action,
}: Readonly<MonitoringSectionHeaderProps>) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
      spacing={2}
    >
      <Stack spacing={1}>
        <Typography id={id} component="h2" variant="h5">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      {action}
    </Stack>
  )
}
