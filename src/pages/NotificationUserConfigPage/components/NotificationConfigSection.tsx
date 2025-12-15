import { Card, Typography, Button } from '@mui/material'
import { Box, Stack } from '@mui/system'
import type { NotificationSectionSchema, NotificationSubSectionSchema } from '../types'
import { useTranslation } from 'react-i18next'
import { NotificationConfigSubSection } from './NotificationConfigSubSection'

type NotificationConfigSectionProps = {
  name: string
  notificationSchema: NotificationSectionSchema
  type: 'email' | 'inApp'
  onClickEnableAllSectionSwitch: (sectionName: string, enable: boolean) => void
  isAllSwitchWithinSectionDisabled: boolean
}

export const NotificationConfigSection: React.FC<NotificationConfigSectionProps> = ({
  name,
  notificationSchema,
  type,
  onClickEnableAllSectionSwitch,
  isAllSwitchWithinSectionDisabled,
}) => {
  const { icon: Icon, subsections, title } = notificationSchema

  const { t } = useTranslation('notification', {
    keyPrefix: `notifications.configurationPage.${type}`,
  })

  return (
    <Box key={name} data-testid={`config-section-${name}`} sx={{ mb: 3 }}>
      <Card sx={{ ml: -2, px: 3, mb: 2 }} variant="outlined">
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4, mt: 3 }}
        >
          <Stack alignItems="center" direction="row" gap={1}>
            <Icon />
            <Typography variant="button">{title}</Typography>
          </Stack>
          <Button
            data-testid={`enableSectionAllNotifications-${name}`}
            variant="naked"
            sx={{ mr: 3 }}
            onClick={() => onClickEnableAllSectionSwitch(name, !isAllSwitchWithinSectionDisabled)}
          >
            {isAllSwitchWithinSectionDisabled
              ? t('disableSectionAllNotifications')
              : t('enableSectionAllNotifications')}
          </Button>
        </Box>

        {subsections.map((subsection: NotificationSubSectionSchema) => {
          return (
            <NotificationConfigSubSection
              data-testid={name}
              key={`${name}-${subsection.title}`}
              subsection={subsection}
            />
          )
        })}
      </Card>
    </Box>
  )
}
