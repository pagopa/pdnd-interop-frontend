import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { Box, Checkbox, Skeleton, TableCell, TableRow as MuiTableRow, Button } from '@mui/material'
import React from 'react'
import useGetNotificationsActions from '@/hooks/useGetNotificationsActions'
import { useTranslation } from 'react-i18next'
import { Stack } from '@mui/system'
import { TableRow } from '@pagopa/interop-fe-commons'
import { type Notification } from '@/api/api.generatedTypes'
import { Link } from 'react-router-dom'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { format } from 'date-fns'
import { NotificationBadgeDot } from '@/components/shared/NotificationBadgeDot/NotificationBadgeDot'

export const NotificationsTableRow: React.FC<{
  notification: Notification
  isSelected: boolean
  onToggle: () => void
}> = ({ notification, isSelected, onToggle }) => {
  const { actions } = useGetNotificationsActions(notification)
  const { t: tCommon } = useTranslation('common')
  const { t: tNotification } = useTranslation('notification', {
    keyPrefix: 'notifications.page.filters.categoryField.optionLabels',
  })

  const currentLang = useCurrentLanguage()
  const isRead = notification.readAt !== null
  const notificationLink = `/${currentLang}${notification.deepLink}`
  const fontWeightRow = isRead ? 'normal' : 600

  return (
    <MuiTableRow selected={isSelected} key={notification.id}>
      <TableCell>
        <Stack direction="row">
          <Checkbox
            data-testid={`checkbox-${notification.id}`}
            checked={isSelected}
            onChange={onToggle}
          />
          {!isRead && <NotificationBadgeDot />}
        </Stack>
      </TableCell>

      <TableCell sx={{ fontWeight: isRead ? 'normal' : 'normal' }} width={250}>
        {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
      </TableCell>
      <TableCell sx={{ fontWeight: fontWeightRow }} width={250}>
        {tNotification(
          notification.category as 'Providers' | 'Subscribers' | 'Delegation' | 'AttributesAndKeys'
        )}
      </TableCell>
      <TableCell
        sx={{ fontWeight: isRead ? 600 : 'normal' }}
        width={450}
        dangerouslySetInnerHTML={{ __html: notification.body }}
      />
      <TableCell sx={{ fontWeight: isRead ? 600 : 'normal' }}>
        <Button component={Link} size="small" variant="outlined" to={notificationLink}>
          {tCommon('actions.inspect')}
        </Button>
      </TableCell>
      <TableCell>
        <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
          <ActionMenu actions={actions} />
        </Box>
      </TableCell>
    </MuiTableRow>
  )
}

export const NotificationsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={80} />,
        <Skeleton key={1} width={180} />,
        <Skeleton key={2} width={180} />,
        <Skeleton key={3} width={180} />,
      ]}
    >
      <ActionMenuSkeleton />
    </TableRow>
  )
}
