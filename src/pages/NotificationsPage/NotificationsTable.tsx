import { Table } from '@pagopa/interop-fe-commons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NotificationsTableRow, NotificationsTableRowSkeleton } from './NotificationsTableRow'
import { Box, Button, Checkbox, Stack, Typography } from '@mui/material'
import type { Notification } from '@/api/notification/notification.services'
import RefreshIcon from '@mui/icons-material/Refresh'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

type NotificationsTableProps = {
  notifications: Array<Notification>
}

export const NotificationsTable: React.FC<NotificationsTableProps> = ({ notifications }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const allSelected = notifications.length > 0 && selectedIds.length === notifications.length

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map((notification) => notification.id))
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const headLabels = [
    (
      <Checkbox
        key="selectAll"
        name="selectAll"
        data-testid="selectAll"
        checked={allSelected}
        onChange={handleSelectAll}
      />
    ) as unknown as string,
    tCommon('dateColumn'),
    tCommon('categoryColumn'),
    tCommon('objectColumn'),
    '',
  ]

  return (
    <>
      <NotficationTableRowsActions />
      <Table headLabels={headLabels} isEmpty={notifications && notifications.length === 0}>
        {notifications?.map((notification) => (
          <NotificationsTableRow
            key={notification.id}
            notification={notification}
            isSelected={selectedIds.includes(notification.id)}
            onToggle={() => toggleSelection(notification.id)}
          />
        ))}
      </Table>
    </>
  )
}

export const NotificationsTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    (<Checkbox key={''} name="selectedNotifcation" />) as unknown as string,
    tCommon('dateColumn'),
    tCommon('categoryColumn'),
    tCommon('objectColumn'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <NotificationsTableRowSkeleton />
      <NotificationsTableRowSkeleton />
      <NotificationsTableRowSkeleton />
      <NotificationsTableRowSkeleton />
      <NotificationsTableRowSkeleton />
    </Table>
  )
}

const NotficationTableRowsActions = () => {
  const { t: tNotification } = useTranslation('notifications', {
    keyPrefix: 'notifications.page.rowActions',
  })

  return (
    <Box mb={4} display="flex" justifyContent="flex-start">
      <Stack width={'100%'} direction="row">
        <Typography>{tNotification('lastUpdate')} 12/05/2036: 11:34</Typography>
        <Button sx={{ ml: 3 }} variant="naked" endIcon={<RefreshIcon />}>
          {tNotification('updateButton')}
        </Button>
      </Stack>

      <Stack width={'100%'} direction="row" ml={20} justifyContent="flex-end">
        <Typography>4 selezionati</Typography>
        <Button sx={{ ml: 3 }} variant="naked" endIcon={<MarkEmailReadIcon />}>
          {tNotification('markAsRead')}
        </Button>{' '}
        <Button sx={{ ml: 3 }} variant="naked" endIcon={<MarkEmailUnreadIcon />}>
          {tNotification('markAsUnread')}
        </Button>
        <Button sx={{ ml: 3 }} variant="naked" color="error" endIcon={<DeleteOutlineIcon />}>
          {tNotification('delete')}
        </Button>
      </Stack>
    </Box>
  )
}
