import { Table } from '@pagopa/interop-fe-commons'
import type { Purpose } from '@/api/api.generatedTypes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ProviderPurposesTableRow,
  ProviderPurposesTableRowSkeleton,
} from './ProviderPurposesTableRow'

type ProviderPurposesTableProps = {
  purposes: Array<Purpose>
}

export const ProviderPurposesTable: React.FC<ProviderPurposesTableProps> = ({ purposes }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('purposeName'),
    tCommon('subscriberName'),
    tCommon('purposeStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels} isEmpty={purposes && purposes.length === 0}>
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
