import React from 'react'
import { useTranslation } from 'react-i18next'
import { HeadSection } from '@/components/shared/HeadSection'
import type { ActionItemButton } from '@/types/common.types'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import { NotificationsTable, NotificationsTableSkeleton } from './NotificationsTable'
import type { GetUserNotificationsParams } from '@/api/notification/notification.services'
import { NotificationMutations, NotificationQueries } from '@/api/notification'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { Link } from '@/router'

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('notifications', { keyPrefix: 'notifications.page' })

  const action: ActionItemButton[] = [
    {
      action: () => {}, //TODO
      label: t('addNotificationConfigBtn'),
      color: 'primary',
      variant: 'contained',
    },
  ]

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetUserNotificationsParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: t('filters.objectField.label'), type: 'freetext' },
    {
      name: 'category',
      label: t('filters.categoryField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: t('filters.categoryField.optionLabels.Deliver'), value: 'DELIVER' },
        {
          label: t('filters.categoryField.optionLabels.Receive'),
          value: 'RECEIVE',
        },
        {
          label: t('filters.categoryField.optionLabels.Delegation'),
          value: 'DELEGATION',
        },
        {
          label: t('filters.categoryField.optionLabels.keyAttributes'),
          value: 'KEY_ATTRIBUTES',
        },
      ],
    },
    {
      name: 'state',
      label: t('filters.stateField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: t('filters.stateField.optionLabels.Read'), value: 'Letto' },
        {
          label: t('filters.stateField.optionLabels.NotRead'),
          value: 'Non letto',
        },
      ],
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const queryParams = { ...paginationParams, ...filtersParams }

  const { data: totalPageCount = 0 } = useQuery({
    ...NotificationQueries.getUserNotificationsList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  const params = {
    ...filtersParams,
    ...paginationParams,
  }

  return (
    <>
      <HeadSection
        title={t('title')}
        description={t('description')}
        headVariant="primary"
        actions={action}
      />

      <>
        <Filters {...filtersHandlers} />
        <NotificationsTableWrapper params={params} />
        <Pagination {...paginationProps} totalPages={totalPageCount} />
      </>
      {/* {filtersParams && totalPageCount <= 0 ? (
        <>
          <Filters {...filtersHandlers} />
          <NotificationsTableWrapper params={params} />
          <Pagination {...paginationProps} totalPages={totalPageCount} />
        </>
      ) : (
        <NoItemResults>
          <div>
            {t('notNotificationAvailable')} <Link to="DEFAULT">TODO</Link>
          </div>
        </NoItemResults>
      )} */}
    </>
  )
}

const NotificationsTableWrapper: React.FC<{
  params: GetUserNotificationsParams
}> = ({ params }) => {
  const { data, isFetching, refetch, dataUpdatedAt } = useQuery({
    ...NotificationQueries.getUserNotificationsList(params),
  })

  const { mutate: markBulkAsRead } = NotificationMutations.useBulkMarkAsRead()
  const { mutate: markBulkAsUnread } = NotificationMutations.useBulkMarkAsNotRead()
  const { mutate: deleteNotifications } = NotificationMutations.useDeleteNotifications()

  const handleMultipleRowMarkAsRead = (notificationIds: string[]) => {
    console.log('MarkAsRead', notificationIds)
    markBulkAsRead({ ids: notificationIds })
  }

  const handleMultipleRowMarkAsUnread = (notificationIds: string[]) => {
    console.log('MarkAsUnread', notificationIds)
    markBulkAsUnread({ ids: notificationIds })
  }

  const handleMultipleRowDelete = (notificationIds: string[]) => {
    console.log('delete:', notificationIds)
    deleteNotifications({ ids: notificationIds })
  }

  if (!data && isFetching) return <NotificationsTableSkeleton />
  return (
    <NotificationsTable
      handleMultipleRowDelete={handleMultipleRowDelete}
      handleMultipleRowMarkAsRead={handleMultipleRowMarkAsRead}
      handleMultipleRowMarkAsUnread={handleMultipleRowMarkAsUnread}
      handleRefetch={refetch}
      notifications={data?.results ?? []}
      dataUpdatedAt={new Date(dataUpdatedAt).toLocaleTimeString()}
    />
  )
}

export default NotificationsPage
