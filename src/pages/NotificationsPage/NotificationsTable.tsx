import { Table } from '@pagopa/interop-fe-commons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NotificationsTableRow, NotificationsTableRowSkeleton } from './NotificationsTableRow'
import { Checkbox } from '@mui/material'
import type { UserNotification } from '@/api/notification/notification.services'

type NotificationsTableProps = {
  notifications: Array<UserNotification>
}

export const NotificationsTable: React.FC<NotificationsTableProps> = ({ notifications }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const allSelected = notifications.length > 0 && selectedIds.length === notifications.length //TODO ONLY VISIBLE NOTIFICATION IN PAGE
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
      <Checkbox key="selectAll" name="selectAll" checked={allSelected} onChange={handleSelectAll} />
    ) as unknown as string,
    tCommon('dateColumn'),
    tCommon('categoryColumn'),
    tCommon('objectColumn'),
    '',
  ]

  return (
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
