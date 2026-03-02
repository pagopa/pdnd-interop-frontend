import { Pagination, Table, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import {
  ConsumerEServiceTemplateInstancesTableRow,
  ConsumerEServiceTemplateInstancesTableRowSkeleton,
} from './ConsumerEServiceTemplateInstancesTableRow'
import type { CompactEServiceTemplateVersion } from '@/api/api.generatedTypes'
import { Alert } from '@mui/material'

type ConsumerEServiceTemplateInstancesTableProps = {
  eserviceTemplateId: string
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
}

export const ConsumerEServiceTemplateInstancesTable: React.FC<
  ConsumerEServiceTemplateInstancesTableProps
> = ({ eserviceTemplateId, eserviceTemplateVersions }) => {
  const { paginationParams, paginationProps, getTotalPageCount, rowPerPageOptions } =
    usePagination()

  const queryParams = { ...paginationParams }

  const { data: templateInstancesCount } = useQuery({
    ...EServiceTemplateQueries.getMyEServiceTemplateInstancesList({
      ...queryParams,
      eserviceTemplateId: eserviceTemplateId,
    }),
    select: (data) => data.pagination.totalCount,
  })

  return (
    <>
      <React.Suspense fallback={<ConsumerEServiceTemplateInstancesTableSkeleton />}>
        <ConsumerEServiceTemplateInstancesTableWrapper
          params={queryParams}
          eserviceTemplateId={eserviceTemplateId}
          eserviceTemplateVersions={eserviceTemplateVersions}
        />
      </React.Suspense>
      <Pagination
        {...paginationProps}
        rowPerPageOptions={rowPerPageOptions}
        totalPages={getTotalPageCount(templateInstancesCount)}
      />
    </>
  )
}

const ConsumerEServiceTemplateInstancesTableWrapper: React.FC<{
  params: { offset: number; limit: number }
  eserviceTemplateId: string
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
}> = ({ params, eserviceTemplateId, eserviceTemplateVersions }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'list.myInstancesTable' })

  const { data: templateInstances } = useSuspenseQuery(
    EServiceTemplateQueries.getMyEServiceTemplateInstancesList({
      ...params,
      eserviceTemplateId: eserviceTemplateId,
    })
  )

  const headLabels = [
    tCommon('eserviceTemplateInstanceLabel'),
    tCommon('eserviceTemplateInstanceVersion'),
    tCommon('eserviceTemplateInstanceState'),
    '',
  ]
  const isEmpty = templateInstances.results.length === 0

  return (
    <>
      {isEmpty ? (
        <Alert severity="info"> {t('noDataLabel')} </Alert>
      ) : (
        <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noDataLabel')}>
          {templateInstances?.results.map((instance) => (
            <ConsumerEServiceTemplateInstancesTableRow
              key={instance.id}
              instance={instance}
              eserviceTemplateVersions={eserviceTemplateVersions}
            />
          ))}
        </Table>
      )}
    </>
  )
}

export const ConsumerEServiceTemplateInstancesTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [
    tCommon('table.headData.eserviceTemplateInstanceLabel'),
    tCommon('table.headData.eserviceTemplateInstanceVersion'),
    tCommon('table.headData.eserviceTemplateInstanceState'),
    '',
  ]
  return (
    <Table headLabels={headLabels}>
      <ConsumerEServiceTemplateInstancesTableRowSkeleton />
      <ConsumerEServiceTemplateInstancesTableRowSkeleton />
      <ConsumerEServiceTemplateInstancesTableRowSkeleton />
      <ConsumerEServiceTemplateInstancesTableRowSkeleton />
      <ConsumerEServiceTemplateInstancesTableRowSkeleton />
    </Table>
  )
}
