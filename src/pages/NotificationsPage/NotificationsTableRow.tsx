import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { Box, Checkbox, Skeleton, TableCell } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import useGetNotificationsActions from '@/hooks/useGetNotificationsActions'
import type { UserNotification } from '@/api/notification/notification.services'

export const NotificationsTableRow: React.FC<{
  notification: UserNotification
  isSelected: boolean
  enableMultipleSelection: boolean
  onToggle: () => void
}> = ({ notification, isSelected, onToggle, enableMultipleSelection }) => {
  const { actions } = useGetNotificationsActions(notification)

  return (
    <TableRow
      cellData={[
        ...(enableMultipleSelection
          ? [
              <Checkbox
                key={notification.id}
                name="selectedNotification"
                checked={isSelected}
                onChange={onToggle}
              />,
            ]
          : []),
        <TableCell width={180} key={0}>
          {notification.data}
        </TableCell>,
        notification.category,
        notification.object,
      ]}
    >
      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
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
