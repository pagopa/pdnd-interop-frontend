import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import type { NotificationSubSectionSchema } from './InAppNotificationUserConfigTab'
import { AuthHooks } from '@/api/auth'

type NotificationConfigSectionProps = {
  subsection: NotificationSubSectionSchema
}
export const NotificationConfigSection: React.FC<NotificationConfigSectionProps> = ({
  subsection,
}) => {
  const { currentRoles } = AuthHooks.useJwt()

  return (
    <>
      <Typography variant="body2" component="h2" mb={1} fontWeight={600}>
        {subsection.title}
      </Typography>
      <Box sx={{ ml: 3 }}>
        {subsection.components.map(
          (component) =>
            // is currentRoles authorized to show the switch  ?
            currentRoles.some((item) => component.visibility.includes(item)) && (
              <RHFSwitch
                sx={{ mt: 1, mb: 1 }}
                key={component.key}
                name={component.key}
                label={
                  <SwitchLabelDescription
                    label={component.title}
                    description={component.description}
                  />
                }
              />
            )
        )}
      </Box>
    </>
  )
}
