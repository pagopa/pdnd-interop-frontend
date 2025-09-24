import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { Box, Checkbox, Skeleton, TableCell } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import useGetNotificationsActions from '@/hooks/useGetNotificationsActions'
import type { Notification } from '@/api/notification/notification.services'
import { Link } from '@/router'
import { useTranslation } from 'react-i18next'
import { Stack } from '@mui/system'
import { theme } from '@pagopa/interop-fe-commons'

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
    <TableRow
      cellData={[
        <Stack key={notification.id} direction="row">
          <Checkbox
            key={notification.id}
            data-testid={`checkbox-${notification.id}`}
            checked={isSelected}
            onChange={onToggle}
          />
          {isReaded && <NotificaitonBadgeDot />}
        </Stack>,
        <TableCell sx={{ fontWeight: isReaded ? 600 : 'normal' }} width={250} key={notification.id}>
          {notification.createdAt}
        </TableCell>,
        <TableCell sx={{ fontWeight: isReaded ? 600 : 'normal' }} width={250} key={notification.id}>
          {notification.notificationType}
        </TableCell>,
        <TableCell sx={{ fontWeight: isReaded ? 600 : 'normal' }} width={250} key={notification.id}>
          {notification.body}
        </TableCell>,
      ]}
    >
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
