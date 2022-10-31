import { PurposeQueries } from '@/api/purpose'
import { Table } from '@/components/shared/Table'
import { useJwt } from '@/hooks/useJwt'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConsumerPurposesTableRow,
  ConsumerPurposesTableRowSkeleton,
} from './ConsumerPurposesTableRow'

export const ConsumerPurposesTable: React.FC = () => {
  const { t } = useTranslation('agreement')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { jwt } = useJwt()
  const { data: purposes } = PurposeQueries.useGetAll({
    consumerId: jwt?.organizationId,
  })

  const headLabels = [
    tCommon('purposeName'),
    tCommon('eserviceName'),
    tCommon('providerName'),
    tCommon('purposeStatus'),
    '',
  ]

  return (
    <Table
      headLabels={headLabels}
      noDataLabel={t('noMultiDataLabel')}
      isEmpty={purposes && purposes.length === 0}
    >
      {purposes?.map((purpose) => (
        <ConsumerPurposesTableRow key={purpose.id} purpose={purpose} />
      ))}
    </Table>
  )
}

export const ConsumerPurposesTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('purposeName'),
    tCommon('eserviceName'),
    tCommon('providerName'),
    tCommon('purposeStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <ConsumerPurposesTableRowSkeleton />
      <ConsumerPurposesTableRowSkeleton />
      <ConsumerPurposesTableRowSkeleton />
      <ConsumerPurposesTableRowSkeleton />
      <ConsumerPurposesTableRowSkeleton />
    </Table>
  )
}
