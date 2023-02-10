import { ClientQueries } from '@/api/client'
import { Table } from '@/components/shared/Table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClientOperatorsTableRow, ClientOperatorsTableRowSkeleton } from './ClientOperatorsTableRow'

type ClientOperatorsTableProps = {
  clientId: string
}

export const ClientOperatorsTable: React.FC<ClientOperatorsTableProps> = ({ clientId }) => {
  const { t: tCommon } = useTranslation('common')

  const { data: operators = [] } = ClientQueries.useGetOperatorsList(clientId)

  const headLabels = [tCommon('table.headData.userName'), tCommon('table.headData.status'), '']

  const isEmpty = !operators || operators.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {operators.map((operator) => (
        <ClientOperatorsTableRow
          key={operator.relationshipId}
          operator={operator}
          clientId={clientId}
        />
      ))}
    </Table>
  )
}

export const ClientOperatorsTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [tCommon('table.headData.userName'), tCommon('table.headData.status'), '']
  return (
    <Table headLabels={headLabels}>
      <ClientOperatorsTableRowSkeleton />
      <ClientOperatorsTableRowSkeleton />
      <ClientOperatorsTableRowSkeleton />
    </Table>
  )
}
