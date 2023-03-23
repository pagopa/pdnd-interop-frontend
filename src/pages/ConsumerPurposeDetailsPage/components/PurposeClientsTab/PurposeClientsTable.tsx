import { PurposeQueries } from '@/api/purpose'
import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeClientsTableRow, PurposeClientsTableRowSkeleton } from './PurposeClientsTableRow'

interface PurposeClientsTableProps {
  purposeId: string
}

export const PurposeClientsTable: React.FC<PurposeClientsTableProps> = ({ purposeId }) => {
  const { t } = useTranslation('client')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)

  const headLabels = [tCommon('clientName'), '']

  const clients = purpose?.clients || []
  const isEmpty = clients.length === 0

  return (
    <Table
      isEmpty={isEmpty}
      headLabels={headLabels}
      noDataLabel={t('tableClientInPurpose.noClientsAssociatedToPurposeLabel')}
    >
      {clients.map((client) => (
        <PurposeClientsTableRow key={client.id} purposeId={purposeId} client={client} />
      ))}
    </Table>
  )
}

export const PurposeClientsTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [t('clientName'), '']

  return (
    <Table headLabels={headLabels}>
      <PurposeClientsTableRowSkeleton />
      <PurposeClientsTableRowSkeleton />
      <PurposeClientsTableRowSkeleton />
    </Table>
  )
}
