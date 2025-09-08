import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { Box, Checkbox, Skeleton, TableCell } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import useGetNotificationsActions from '@/hooks/useGetNotificationsActions'
import type { UserNotification } from '@/api/notification/notification.services'
import { Link } from '@/router'
import { useTranslation } from 'react-i18next'

export const NotificationsTableRow: React.FC<{
  notification: UserNotification
  isSelected: boolean
  enableMultipleSelection: boolean
  onToggle: () => void
}> = ({ notification, isSelected, onToggle, enableMultipleSelection }) => {
  const { actions } = useGetNotificationsActions(notification)
  const { t: tCommon } = useTranslation('common')

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
        <TableCell width={250} key={0}>
          {notification.data}
        </TableCell>,
        notification.category,
        notification.object,
      ]}
    >
      <Link
        key={notification.id}
        as="button"
        onPointerEnter={() => console.log('handle prefetch TODO')}
        onFocusVisible={() => console.log('handle prefetch TODO')}
        variant="outlined"
        size="small"
        to="DELEGATION_DETAILS"
        params={{ delegationId: '1234' }}
      >
        {tCommon('actions.inspect')}
      </Link>

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
