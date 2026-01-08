import { Table } from '@pagopa/interop-fe-commons'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NotificationsTableRow, NotificationsTableRowSkeleton } from './NotificationsTableRow'
import { Box, Button, Checkbox, Stack, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { match } from 'ts-pattern'
import { type Notification } from '@/api/api.generatedTypes'
import { NotificationMutations } from '@/api/notification'

type NotificationsTableProps = {
  notifications: Array<Notification>
  handleRefetch: () => void
  dataUpdatedAt: string
  offset: number
}

type NotficationTableRowsActionsProps = {
  handleRefetch: () => void
  handleMultipleRowMarkAsRead: () => void
  handleMultipleRowMarkAsUnread: () => void
  handleMultipleRowDelete: () => void
  rowSelected: number
  dataUpdatedAt: string
}

export const NotificationsTable: React.FC<NotificationsTableProps> = ({
  notifications,
  handleRefetch,
  dataUpdatedAt,
  offset,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  useEffect(() => {
    setSelectedIds([])
  }, [offset])

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const allSelected = notifications.length > 0 && selectedIds.length === notifications.length

  const { mutate: markBulkAsRead } = NotificationMutations.useBulkMarkAsRead()
  const { mutate: markBulkAsUnread } = NotificationMutations.useBulkMarkAsNotRead()
  const { mutate: deleteNotifications } = NotificationMutations.useDeleteNotifications()

  const handleMultipleRowMarkAsRead = (notificationIds: string[]) => {
    markBulkAsRead(
      { ids: notificationIds },
      {
        onSuccess: () => setSelectedIds([]),
      }
    )
  }

  const handleMultipleRowMarkAsUnread = (notificationIds: string[]) => {
    markBulkAsUnread(
      { ids: notificationIds },
      {
        onSuccess: () => {
          setSelectedIds([])
        },
      }
    )
  }

  const handleMultipleRowDelete = (notificationIds: string[]) => {
    deleteNotifications(
      { ids: notificationIds },
      {
        onSuccess: () => {
          setSelectedIds([])
        },
      }
    )
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map((notification) => notification.id))
    }
  }

  const toggleSelection = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id]
    setSelectedIds(newIds)
  }

  const headLabels = [
    notifications.length > 0 &&
      ((
        <Checkbox
          key="selectAll"
          name="selectAll"
          data-testid="selectAll"
          checked={allSelected}
          onChange={handleSelectAll}
        />
      ) as unknown as string),
    tCommon('dateColumn'),
    tCommon('categoryColumn'),
    tCommon('objectColumn'),
    '',
    '',
  ] as string[]

  return (
    <>
      <NotficationTableRowsActions
        rowSelected={selectedIds.length}
        handleRefetch={handleRefetch}
        dataUpdatedAt={dataUpdatedAt}
        handleMultipleRowMarkAsRead={() => {
          handleMultipleRowMarkAsRead(selectedIds)
        }}
        handleMultipleRowMarkAsUnread={() => {
          handleMultipleRowMarkAsUnread(selectedIds)
        }}
        handleMultipleRowDelete={() => {
          handleMultipleRowDelete(selectedIds)
        }}
      />
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

const NotficationTableRowsActions: React.FC<NotficationTableRowsActionsProps> = ({
  handleRefetch,
  handleMultipleRowMarkAsRead,
  handleMultipleRowMarkAsUnread,
  handleMultipleRowDelete,
  rowSelected,
  dataUpdatedAt,
}) => {
  const { t: tNotification } = useTranslation('notification', {
    keyPrefix: 'notifications.page.rowActions',
  })

  const atLeastOneRowSelected = rowSelected > 0
  return (
    <Box mb={4} display="flex" justifyContent="flex-start">
      <Stack width={'100%'} direction="row">
        <Typography>
          {tNotification('lastUpdate')} {dataUpdatedAt}
        </Typography>
        <Button onClick={handleRefetch} sx={{ ml: 3 }} variant="naked" endIcon={<RefreshIcon />}>
          {tNotification('updateButton')}
        </Button>
      </Stack>

      <Stack width={'100%'} direction="row" ml={20} justifyContent="flex-end">
        <Typography>
          {match(rowSelected)
            .with(0, () => '')
            .with(1, () => `${rowSelected} ${tNotification('selectedSingle')}`)
            .otherwise(() => `${rowSelected} ${tNotification('selectedPlural')}`)}
        </Typography>
        {atLeastOneRowSelected && (
          <>
            <Button
              onClick={handleMultipleRowMarkAsRead}
              sx={{ ml: 3 }}
              variant="naked"
              startIcon={<MarkAsUnreadIcon />}
            >
              {tNotification('markAsRead')}
            </Button>
            <Button
              onClick={handleMultipleRowMarkAsUnread}
              sx={{ ml: 3 }}
              variant="naked"
              startIcon={<MarkEmailUnreadIcon />}
            >
              {tNotification('markAsUnread')}
            </Button>
            <Button
              onClick={handleMultipleRowDelete}
              sx={{ ml: 3 }}
              variant="naked"
              color="error"
              startIcon={<DeleteOutlineIcon />}
            >
              {tNotification('delete')}
            </Button>
          </>
        )}
      </Stack>
    </Box>
  )
}
