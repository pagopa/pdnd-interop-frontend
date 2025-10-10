import { Typography } from '@mui/material'
import { Box } from '@mui/system'

type SwitchLabelDescriptionProps = {
  label: string
  description: string
}

export const SwitchLabelDescription: React.FC<SwitchLabelDescriptionProps> = ({
  label,
  description,
}) => {
  return (
    <Box component="div" display="flex" flexDirection="column">
      <Typography component="p" variant="body2" fontWeight={400}>
        {label}
      </Typography>
      <Typography component="p" color="text.secondary" variant="caption">
        {description}
      </Typography>
    </Box>
  )
}
