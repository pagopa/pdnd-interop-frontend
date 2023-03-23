import type { PurposeListingItem } from '@/types/purpose.types'
import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConsumerPurposesTableRow,
  ConsumerPurposesTableRowSkeleton,
} from './ConsumerPurposesTableRow'

type ConsumerPurposesTableProps = {
  purposes: Array<PurposeListingItem>
}

export const ConsumerPurposesTable: React.FC<ConsumerPurposesTableProps> = ({ purposes }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('purposeName'),
    tCommon('eserviceName'),
    tCommon('providerName'),
    tCommon('purposeStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels} isEmpty={purposes && purposes.length === 0}>
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
