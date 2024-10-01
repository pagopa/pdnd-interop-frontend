import { ClientQueries } from '@/api/client'
import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClientOperatorsTableRow, ClientOperatorsTableRowSkeleton } from './ClientOperatorsTableRow'
import { useSuspenseQuery } from '@tanstack/react-query'

type ClientOperatorsTableProps = {
  clientId: string
}

export const ClientOperatorsTable: React.FC<ClientOperatorsTableProps> = ({ clientId }) => {
  const { t: tCommon } = useTranslation('common')

  const { data: operators } = useSuspenseQuery(ClientQueries.getOperatorsList(clientId))

  const headLabels = [tCommon('table.headData.userName'), '']
  const isEmpty = operators.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {operators.map((operator) => (
        <ClientOperatorsTableRow key={operator.userId} operator={operator} clientId={clientId} />
      ))}
    </Table>
  )
}

export const ClientOperatorsTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [tCommon('table.headData.userName'), '']
  return (
    <Table headLabels={headLabels}>
      <ClientOperatorsTableRowSkeleton />
      <ClientOperatorsTableRowSkeleton />
      <ClientOperatorsTableRowSkeleton />
      <ClientOperatorsTableRowSkeleton />
      <ClientOperatorsTableRowSkeleton />
    </Table>
  )
}
