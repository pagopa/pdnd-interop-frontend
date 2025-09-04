import React from 'react'
import { useTranslation } from 'react-i18next'
import { HeadSection } from '@/components/shared/HeadSection'
import type { ActionItemButton } from '@/types/common.types'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import { NotificationsTable, NotificationsTableSkeleton } from './NotificationsTable'
import type { GetUserNotificationsParams } from '@/api/notification/notification.services'
import { NotificationQueries } from '@/api/notification'
import { useQuery } from '@tanstack/react-query'
import { Stack } from '@mui/system'
import { Button } from '@mui/material'

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('notifications', { keyPrefix: 'notifications.page' })
  const [enableMultipleSelection, setEnableMultipleSelection] = React.useState(false)

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
  const totalPageCount = 10 //TODO TO REMOVE
  // const { data: totalPageCount = 0 } = useQuery({
  //   ...TemplateQueries.getProviderTemplatesList(queryParams),
  //   placeholderData: keepPreviousData,
  //   select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  // })

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
      <Filters {...filtersHandlers} />
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
        <Button
          onClick={() => setEnableMultipleSelection(!enableMultipleSelection)}
          variant="naked"
        >
          {enableMultipleSelection ? 'Disattiva selezione multipla' : 'Attiva selezione multipla'}
        </Button>
      </Stack>
      <NotificationsTableWrapper
        enableMultipleSelection={enableMultipleSelection}
        params={params}
      />
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </>
  )
}

const NotificationsTableWrapper: React.FC<{
  params: GetUserNotificationsParams
  enableMultipleSelection: boolean
}> = ({ params, enableMultipleSelection }) => {
  const { data, isFetching } = useQuery({
    ...NotificationQueries.getUserNotificationsList(params),
  })

  if (!data && isFetching) return <NotificationsTableSkeleton />
  return (
    <NotificationsTable
      enableMultipleSelection={enableMultipleSelection}
      notifications={data ?? []}
    />
  )
}

export default NotificationsPage
