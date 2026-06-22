import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { AuthHooks } from '@/api/auth'
import type { NotificationSubSectionSchema } from '../types'

type NotificationConfigSubSectionProps = {
  subsection: NotificationSubSectionSchema
}
export const NotificationConfigSubSection: React.FC<NotificationConfigSubSectionProps> = ({
  subsection,
}) => {
  const { currentRoles } = AuthHooks.useJwt()

  const shouldSubSectionVisible = subsection.components.some(({ visibility }) =>
    visibility.some((role) => currentRoles.includes(role))
  )

  if (!shouldSubSectionVisible) {
    return null
  }

  return (
    <>
      <Typography variant="body2" component="h2" mb={1} fontWeight={600}>
        {subsection.title}
      </Typography>
      <Box sx={{ ml: 3, mb: 2 }}>
        {subsection.components.map(
          (component) =>
            // is currentRoles authorized to show the switch  ?
            currentRoles.some((item) => component.visibility.includes(item)) && (
              <RHFSwitch
                sx={{ mt: 1, mb: 1 }}
                data-testid={component.key}
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
