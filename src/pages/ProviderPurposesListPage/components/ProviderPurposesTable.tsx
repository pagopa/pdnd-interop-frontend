import { Table } from '@/components/shared/Table'
import type { PurposeListingItem } from '@/types/purpose.types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ProviderPurposesTableRow,
  ProviderPurposesTableRowSkeleton,
} from './ProviderPurposesTableRow'

type ProviderPurposesTableProps = {
  purposes: Array<PurposeListingItem>
}

export const ProviderPurposesTable: React.FC<ProviderPurposesTableProps> = ({ purposes }) => {
  const { t } = useTranslation('agreement')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('purposeName'),
    tCommon('subscriberName'),
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
        <ProviderPurposesTableRow key={purpose.id} purpose={purpose} />
      ))}
    </Table>
  )
}

export const ProviderPurposesTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('purposeName'),
    tCommon('subscriberName'),
    tCommon('purposeStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <ProviderPurposesTableRowSkeleton />
      <ProviderPurposesTableRowSkeleton />
      <ProviderPurposesTableRowSkeleton />
      <ProviderPurposesTableRowSkeleton />
      <ProviderPurposesTableRowSkeleton />
    </Table>
  )
}
