import React from 'react'
import { useTranslation } from 'react-i18next'
import { HeadSection } from '@/components/shared/HeadSection'
import type { ActionItemButton } from '@/types/common.types'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import { NotificationsTable, NotificationsTableSkeleton } from './NotificationsTable'
import { NotificationMutations, NotificationQueries } from '@/api/notification'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GetNotificationsParams } from '@/api/api.generatedTypes'
import { Link, useNavigate } from '@/router'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { format } from 'date-fns'

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('notification', { keyPrefix: 'notifications.page' })
  const navigate = useNavigate()

  const action: ActionItemButton[] = [
    {
      action: () => navigate('NOTIFICATIONS_CONFIG'),
      label: t('addNotificationConfigBtn'),
      color: 'primary',
      variant: 'contained',
    },
  ]

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetNotificationsParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: t('filters.objectField.label'), type: 'freetext' },
    {
      name: 'category',
      label: t('filters.categoryField.label'),
      type: 'autocomplete-single',
      options: [
        { label: t('filters.categoryField.optionLabels.Providers'), value: 'Providers' },
        {
          label: t('filters.categoryField.optionLabels.Subscribers'),
          value: 'Subscribers',
        },
        {
          label: t('filters.categoryField.optionLabels.Delegations'),
          value: 'Delegations',
        },
        {
          label: t('filters.categoryField.optionLabels.AttributesAndKeys'),
          value: 'AttributesAndKeys',
        },
      ],
    },
    {
      name: 'unread',
      label: t('filters.stateField.label'),
      type: 'autocomplete-single',
      options: [
        {
          label: t('filters.stateField.optionLabels.Read'),
          value: 'false',
        },
        {
          label: t('filters.stateField.optionLabels.NotRead'),
          value: 'true',
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

      {filtersParams || totalPageCount > 0 ? (
        <>
          <Filters {...filtersHandlers} />
          <NotificationsTableWrapper params={params} />
          <Pagination
            {...paginationProps}
            rowPerPageOptions={{
              onLimitChange: paginationProps.onLimitChange,
              limit: paginationParams.limit,
            }}
            totalPages={totalPageCount}
          />
        </>
      ) : (
        <NoItemResults>
          <div>
            {t('notNotificationAvailable')}{' '}
            <Link to="NOTIFICATIONS_CONFIG">{t('noItemsConfigurationLink')}</Link>
          </div>
        </NoItemResults>
      )}
    </>
  )
}

const NotificationsTableWrapper: React.FC<{
  params: GetNotificationsParams
}> = ({ params }) => {
  const { data, isFetching, refetch, dataUpdatedAt } = useQuery({
    ...NotificationQueries.getUserNotificationsList(params),
  })

  const { mutate: markBulkAsRead } = NotificationMutations.useBulkMarkAsRead()
  const { mutate: markBulkAsUnread } = NotificationMutations.useBulkMarkAsNotRead()
  const { mutate: deleteNotifications } = NotificationMutations.useDeleteNotifications()

  const handleMultipleRowMarkAsRead = (notificationIds: string[]) => {
    markBulkAsRead({ ids: notificationIds })
  }

  const handleMultipleRowMarkAsUnread = (notificationIds: string[]) => {
    markBulkAsUnread({ ids: notificationIds })
  }

  const handleMultipleRowDelete = (notificationIds: string[]) => {
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
      dataUpdatedAt={format(dataUpdatedAt, 'dd/MM/yyyy HH:mm')}
    />
  )
}

export default NotificationsPage
