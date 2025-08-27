import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/system'
import { useFormContext } from 'react-hook-form'
import type { NotificationSectionSchema } from './EmailNotificationUserConfigTab'
import { Typography } from '@mui/material'
import { NotificationSubSectionSchema } from './InAppNotificationUserConfigTab'

type NotificationConfigSectionProps = {
  subsection: NotificationSubSectionSchema
}
export const NotificationConfigSection: React.FC<NotificationConfigSectionProps> = ({
  subsection,
}) => {
  const { watch } = useFormContext()

  const customizeNotification = watch('generalUpdate')

  return (
    <>
      <Typography variant="body2" component="h2" mb={1} fontWeight={600}>
        {subsection.title}
      </Typography>
      <Box sx={{ ml: 3 }}>
        {subsection.components.map((component) => (
          <RHFSwitch
            sx={{ mt: 1, mb: 1 }}
            key={component.name}
            name={component.name}
            label={
              <SwitchLabelDescription label={component.title} description={component.description} />
            }
          />
        ))}
      </Box>
    </>
  )
}
