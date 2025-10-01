import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { Box, Checkbox, Skeleton, TableCell, TableRow as MuiTableRow } from '@mui/material'
import React from 'react'
import useGetNotificationsActions from '@/hooks/useGetNotificationsActions'
import { Link } from '@/router'
import { useTranslation } from 'react-i18next'
import { Stack } from '@mui/system'
import { TableRow, theme } from '@pagopa/interop-fe-commons'
import { type Notification } from '@/api/api.generatedTypes'
import { NotificationMutations } from '@/api/notification'

const NotificaitonBadgeDot = () => {
  return (
    <Box
      component="span"
      alignSelf="center"
      sx={{
        height: 8,
        width: 8,
        ml: 2,
        borderRadius: 5,
        background: theme.palette.primary.main,
      }}
    />
  )
}
export const NotificationsTableRow: React.FC<{
  notification: Notification
  isSelected: boolean
  onToggle: () => void
}> = ({ notification, isSelected, onToggle }) => {
  const { actions } = useGetNotificationsActions(notification)
  const { t: tCommon } = useTranslation('common')
  const isReaded = notification.readAt !== null

  return (
    <MuiTableRow selected={isSelected}>
      <TableCell>
        <Stack key={notification.id} direction="row">
          <Checkbox
            key={notification.id}
            data-testid={`checkbox-${notification.id}`}
            checked={isSelected}
            onChange={onToggle}
          />
          {isReaded && <NotificaitonBadgeDot />}
        </Stack>
      </TableCell>

      <TableCell sx={{ fontWeight: isReaded ? 600 : 'normal' }} width={250} key={notification.id}>
        {new Date(notification.createdAt).toLocaleDateString('it-IT', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: isReaded ? 600 : 'normal' }} width={250} key={notification.id}>
        {/* {notification.notificationType} */}
      </TableCell>
      <TableCell sx={{ fontWeight: isReaded ? 600 : 'normal' }} width={450} key={notification.id}>
        {notification.body}
      </TableCell>
      <TableCell sx={{ fontWeight: isReaded ? 600 : 'normal' }}>
        <Link
          key={notification.id}
          as="button"
          variant="outlined"
          size="small"
          to="DELEGATION_DETAILS"
          params={{ delegationId: '1234' }}
        >
          {tCommon('actions.inspect')}
        </Link>
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
