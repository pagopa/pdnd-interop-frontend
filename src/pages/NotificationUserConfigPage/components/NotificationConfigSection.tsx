import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/system'
import { useFormContext } from 'react-hook-form'
import { Typography } from '@mui/material'
import type { NotificationSubSectionSchema } from './InAppNotificationUserConfigTab'

type NotificationConfigSectionProps = {
  subsection: NotificationSubSectionSchema
}
export const NotificationConfigSection: React.FC<NotificationConfigSectionProps> = ({
  subsection,
}) => {
  return (
    <>
      <Typography variant="body2" component="h2" mb={1} fontWeight={600}>
        {subsection.title}
      </Typography>
      <Box sx={{ ml: 3 }}>
        {subsection.components.map((component) => (
          <RHFSwitch
            sx={{ mt: 1, mb: 1 }}
            key={component.key}
            name={component.key}
            defaultChecked={component.defaultValue}
            label={
              <SwitchLabelDescription label={component.title} description={component.description} />
            }
          />
        ))}
      </Box>
    </>
  )
}
