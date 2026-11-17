import React, { useId } from 'react'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { MIButton, MITable, type MITableColumn } from '@pagopa/mui-italia'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { AuthHooks } from '@/api/auth'
import { ProducerQueries } from '@/api/producer'
import type {
  DateNameSortBy,
  GetProducerEServiceMonitoringConsumerPurposesParams,
  ProducerEServiceMonitoringConsumerPurposes,
  ProducerEServiceMonitoringConsumerPurposesItem,
  PurposeVersionState,
} from '@/api/api.generatedTypes'
import { PageContainer } from '@/components/layout/containers'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { StatusChip } from '@/components/shared/StatusChip'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import type { FilterFieldsValues } from '@/types/filters.types'
import { routes, useGeneratePath, useParams, type RouteKey } from '@/router'
import { formatDateStringNumeric, formatThousands } from '@/utils/format.utils'
import { ConsumerEServiceSummary } from './components/ConsumerEServiceSummary'
import {
  buildWaitingPurposesListSearch,
  PURPOSE_STATE_FILTER_OPTIONS,
  PURPOSES_DEFAULT_SORT,
  PURPOSES_SORT_OPTIONS,
  ROUTE_KEY_BY_ORIGIN,
  type ConsumerEServiceDetailOrigin,
} from './consumerEServiceDetail.utils'

type Identity = Pick<
  GetProducerEServiceMonitoringConsumerPurposesParams,
  'eserviceId' | 'descriptorId' | 'consumerId'
>

const isSameIdentity = (a: Partial<Identity> | undefined, b: Identity) =>
  a?.eserviceId === b.eserviceId &&
  a?.descriptorId === b.descriptorId &&
  a?.consumerId === b.consumerId

type ProviderDashboardConsumerEServiceDetailProps = {
  origin: ConsumerEServiceDetailOrigin
}

/**
 * Projected consumption and purposes of one consumer for one e-service version.
 * Reached from the dashboard consumer detail or from the e-service monitoring tab: each entry point
 * has its own route alias so breadcrumbs are derived from the URL and survive refresh/sharing.
 */
export default function ProviderDashboardConsumerEServiceDetail({
  origin,
}: Readonly<ProviderDashboardConsumerEServiceDetailProps>) {
  const { t } = useTranslation('pages', { keyPrefix: 'providerDashboardConsumerEServiceDetail' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list.filters.statusField' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'status.purpose' })
  const routeKey = ROUTE_KEY_BY_ORIGIN[origin]
  const { eserviceId, descriptorId, consumerId } = useParams<typeof routeKey>()
  const identity: Identity = { eserviceId, descriptorId, consumerId }
  const generatePath = useGeneratePath()
  const { currentRoles } = AuthHooks.useJwt()
  const exportDescriptionId = useId()

  const canAccess = (key: RouteKey) =>
    routes[key].authLevels.some((role) => currentRoles.includes(role))
  const canViewPurposeDetails = canAccess('PROVIDE_PURPOSE_DETAILS')
  const canViewPurposeList = canAccess('PROVIDE_PURPOSE_LIST')

  const filtersHandlers = useFilters<{ q: string; states: string[] }>(
    [{ name: 'q', label: t('searchPlaceholder'), type: 'freetext' }],
    [
      {
        title: t('filters.title'),
        fields: [
          {
            name: 'states',
            label: t('filters.states'),
            type: 'select-multiple',
            options: PURPOSE_STATE_FILTER_OPTIONS.map((value) => ({
              value,
              label: tCommon(value),
            })),
          },
        ],
      },
    ]
  )
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()
  const sorting = useSorting(
    PURPOSES_SORT_OPTIONS.map((value) => ({ value, label: t(`sorting.${value}`) })),
    PURPOSES_DEFAULT_SORT
  )

  const states = (filtersHandlers.filters.states ?? []).filter(
    (state): state is PurposeVersionState =>
      (PURPOSE_STATE_FILTER_OPTIONS as string[]).includes(state)
  )

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    ...ProducerQueries.getEServiceMonitoringConsumerPurposes({
      ...identity,
      ...paginationParams,
      q: filtersHandlers.filters.q || undefined,
      sortBy: sorting.sortBy as DateNameSortBy,
      states: states.length > 0 ? states : undefined,
      includeArchived: false,
    }),
    throwOnError: false,
    // Keep rows only while paging/filtering the same consumer/e-service version.
    placeholderData: (previous, previousQuery) =>
      isSameIdentity(previousQuery?.queryKey[1] as Partial<Identity> | undefined, identity)
        ? previous
        : undefined,
  })

  const consumer = isError ? undefined : data?.consumer
  const isNoRelationship = !isError && Boolean(data) && !data?.consumer

  // The response has no "waiting for approval" counter: ask for a single row of that state to know
  // whether any exist regardless of the filters the user applied to the table.
  const {
    data: waitingForApprovalCount = 0,
    isError: isWaitingForApprovalError,
    isFetching: isWaitingForApprovalFetching,
    refetch: refetchWaitingForApproval,
  } = useQuery({
    ...ProducerQueries.getEServiceMonitoringConsumerPurposes({
      ...identity,
      offset: 0,
      limit: 1,
      states: ['WAITING_FOR_APPROVAL'],
      includeArchived: false,
    }),
    enabled: Boolean(consumer),
    throwOnError: false,
    select: (response: ProducerEServiceMonitoringConsumerPurposes) =>
      response.consumer ? response.pagination.totalCount : 0,
  })

  const title = consumer?.name ?? t('fallbackTitle')
  const eserviceName = isError ? undefined : data?.eservice.name

  const breadcrumbRouteLabelOverrides: Partial<Record<RouteKey, string | false>> = {
    ...(origin === 'dashboard'
      ? consumer && { PROVIDE_DASHBOARD_CONSUMER_DETAIL: consumer.name }
      : { PROVIDE_ESERVICE_MANAGE: t('breadcrumbManageEService') }),
    ...(eserviceName && { [routeKey]: eserviceName }),
  }

  const getVersionPath = (otherDescriptorId: string) =>
    generatePath(routeKey, { ...identity, descriptorId: otherDescriptorId })

  const columns: MITableColumn<ProducerEServiceMonitoringConsumerPurposesItem>[] = [
    {
      id: 'title',
      header: t('columns.title'),
      renderCell: (row) => (
        <Typography component="span" variant="body2" fontWeight={600}>
          {row.title}
        </Typography>
      ),
    },
    {
      id: 'dailyCalls',
      header: t('columns.dailyCalls'),
      renderCell: (row) => formatThousands(row.dailyCalls),
    },
    {
      id: 'state',
      header: t('columns.state'),
      renderCell: (row) => (
        <StatusChip
          for="purposeState"
          state={row.state}
          suspendedByConsumer={row.suspendedByConsumer}
          suspendedByProducer={row.suspendedByProducer}
        />
      ),
    },
    {
      id: 'updatedAt',
      header: t('columns.updatedAt'),
      renderCell: (row) => formatDateStringNumeric(row.updatedAt),
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      isAction: true,
      renderCell: (row) =>
        canViewPurposeDetails ? (
          <IconButton
            component={RouterLink}
            color="inherit"
            to={generatePath('PROVIDE_PURPOSE_DETAILS', { purposeId: row.purposeId })}
            aria-label={t('goToPurpose', { title: row.title })}
          >
            <ChevronRightIcon />
          </IconButton>
        ) : null,
    },
  ]

  const exportAction = (
    // No export implementation exists yet: disabled with a visible explanation.
    <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
      <MIButton
        type="button"
        variant="outlined"
        size="small"
        color="primary"
        startIcon={<FileDownloadOutlinedIcon />}
        disabled
        aria-describedby={exportDescriptionId}
      >
        {t('export')}
      </MIButton>
      <Typography id={exportDescriptionId} variant="caption" color="text.secondary">
        {t('exportUnavailable')}
      </Typography>
    </Stack>
  )

  const renderBody = () => {
    if (isError) {
      return (
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()} disabled={isFetching}>
              {t('retry')}
            </Button>
          }
        >
          {t('loadError')}
        </Alert>
      )
    }

    if (isPending || !data) {
      return (
        <Box role="status" aria-busy="true" sx={{ mt: 3 }}>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
          <Skeleton width="50%" />
          <Skeleton variant="rectangular" height={240} sx={{ mt: 4 }} />
        </Box>
      )
    }

    if (isNoRelationship || !consumer) {
      return (
        <Alert severity="info" sx={{ mt: 3 }}>
          {t('noRelationship')}
        </Alert>
      )
    }

    return (
      <>
        <ConsumerEServiceSummary data={data} getVersionPath={getVersionPath} />

        {isWaitingForApprovalError && (
          <Alert
            severity="warning"
            sx={{ mt: 4, alignItems: 'center' }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => refetchWaitingForApproval()}
                disabled={isWaitingForApprovalFetching}
              >
                {t('retry')}
              </Button>
            }
          >
            {t('waitingApproval.loadError')}
          </Alert>
        )}

        {!isWaitingForApprovalError && waitingForApprovalCount > 0 && (
          <Alert
            severity="warning"
            sx={{ mt: 4, alignItems: 'center' }}
            action={
              canViewPurposeList ? (
                <Button
                  component={RouterLink}
                  to={`${generatePath('PROVIDE_PURPOSE_LIST')}?${buildWaitingPurposesListSearch({
                    eservice: data.eservice,
                    consumer,
                    waitingForApprovalLabel: tPurpose('optionLabels.WAITING_FOR_APPROVAL'),
                  })}`}
                  variant="text"
                  size="small"
                  color="primary"
                  endIcon={<ArrowForward />}
                >
                  {t('waitingApproval.action')}
                </Button>
              ) : undefined
            }
          >
            <AlertTitle>{t('waitingApproval.title')}</AlertTitle>
            {/* Only state that the threshold is exceeded when the approved estimate really exceeds it. */}
            {data.approvedDailyCalls > data.dailyCallsPerConsumer
              ? t('waitingApproval.descriptionThresholdExceeded')
              : t('waitingApproval.description')}
          </Alert>
        )}

        <Box sx={{ mt: 4 }}>
          <FiltersSection
            {...filtersHandlers}
            // `select-multiple` values are string[] at runtime; the shared value type predates them.
            filters={filtersHandlers.filters as FilterFieldsValues}
            results={data.pagination.totalCount}
            submitButtonVariant="outlined"
            sorting={{
              ...sorting,
              onSortingChange: (value) => {
                sorting.onSortingChange(value)
                paginationProps.onPageChange(1)
              },
            }}
          />
          <Box aria-busy={isFetching}>
            <MITable
              columns={columns}
              rows={data.results}
              getRowId={(row) => row.purposeId}
              desktopTableProps={{
                'aria-label': t('tableAriaLabel', { name: consumer.name }),
                'aria-busy': isFetching,
              }}
              mobileTableProps={{
                'aria-label': t('tableAriaLabel', { name: consumer.name }),
                'aria-busy': isFetching,
              }}
              pagination={
                data.pagination.totalCount > 0
                  ? {
                      page: paginationProps.page,
                      itemsPerPageOptions: paginationProps.itemsPerPageOptions,
                      count: getTotalPageCount(data.pagination.totalCount),
                      onChange: (_, page) => paginationProps.onPageChange(page),
                    }
                  : undefined
              }
            />
            {data.results.length === 0 && <Typography role="status">{t('empty')}</Typography>}
          </Box>
        </Box>
      </>
    )
  }

  return (
    <PageContainer
      dashboardFlow
      isLoading={isPending}
      title={title}
      description={t('description')}
      titleAction={exportAction}
      breadcrumbRouteLabelOverrides={breadcrumbRouteLabelOverrides}
    >
      {renderBody()}
    </PageContainer>
  )
}
