import { PurposeQueries } from '@/api/purpose'
import { Table } from '@/components/shared/Table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  EServicePurposesTableRow,
  EServicePurposesTableRowSkeleton,
} from './EServicePurposesTableRow'

type EServicePurposesTableProps = {
  eserviceId: string
}

export const EServicePurposesTable: React.FC<EServicePurposesTableProps> = ({ eserviceId }) => {
  const { t } = useTranslation('purpose')
  const { data: purposes } = PurposeQueries.useGetList({
    states: ['WAITING_FOR_APPROVAL'],
    eserviceId,
  })

  const headLabels = ['Nome finalità', 'Stima di carico', 'Data di completamento', '']

  const isEmpty = !purposes || purposes?.length === 0

  return (
    <Table
      headLabels={headLabels}
      isEmpty={isEmpty}
      noDataLabel={t('tablePurposeInEService.noDataLabel')}
    >
      {!isEmpty &&
        purposes.map((purpose) => <EServicePurposesTableRow key={purpose.id} purpose={purpose} />)}
    </Table>
  )
}

export const EServicePurposesTableSkeleton: React.FC = () => {
  const headLabels = ['Nome finalità', 'Stima di carico', 'Data di completamento', '']

  return (
    <Table headLabels={headLabels}>
      <EServicePurposesTableRowSkeleton />
      <EServicePurposesTableRowSkeleton />
      <EServicePurposesTableRowSkeleton />
    </Table>
  )
}
