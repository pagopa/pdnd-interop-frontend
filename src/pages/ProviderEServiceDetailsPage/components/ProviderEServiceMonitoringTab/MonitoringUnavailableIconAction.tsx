import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Tooltip } from '@mui/material'
import { MIIconButton } from '@pagopa/mui-italia'

type MonitoringUnavailableIconActionProps = {
  label: string
  reason: string
}

/**
 * Disabled row chevron for destinations that do not exist (never a silent no-op). The reason is
 * part of the accessible name and is shown as a tooltip; phrasing markup keeps MITable cells valid.
 */
export function MonitoringUnavailableIconAction({
  label,
  reason,
}: Readonly<MonitoringUnavailableIconActionProps>) {
  return (
    <Tooltip title={reason} arrow>
      <Box component="span" sx={{ display: 'inline-flex' }}>
        <MIIconButton disabled aria-label={`${label}. ${reason}`}>
          <ChevronRightIcon />
        </MIIconButton>
      </Box>
    </Tooltip>
  )
}
