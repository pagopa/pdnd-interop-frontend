import type { GetProducerDelegationsParams } from '@/api/api.generatedTypes'
import { DelegationQueries } from '@/api/delegation'
import { Table } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DelegationsTableRow, DelegationsTableRowSkeleton } from './DelegationsTableRow'
import { match } from 'ts-pattern'
import type { DelegationType } from '@/types/party.types'

type DelegationsTableProps = {
  params: GetProducerDelegationsParams
  delegationType: DelegationType
}

export const DelegationsTable: React.FC<DelegationsTableProps> = ({ params, delegationType }) => {
  const { t } = useTranslation('party', { keyPrefix: 'delegations' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { data: delegations } = useSuspenseQuery({
    ...DelegationQueries.getProducerDelegationsList(params),
    select: ({ results }) => results,
  })

  const delegateOrDelegatorHeadLabel = match(delegationType)
    .with('DELEGATION_RECEIVED', () => tCommon('delegatorName'))
    .with('DELEGATION_GRANTED', () => tCommon('delegateName'))
    .exhaustive()

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('delegationKind'),
    delegateOrDelegatorHeadLabel,
    tCommon('status'),
    '',
  ]

  const isEmpty = !delegations || delegations.length === 0

  return (
    <Table isEmpty={isEmpty} headLabels={headLabels} noDataLabel={t('list.noDelegationsLabel')}>
      {delegations.map((delegation) => (
        <DelegationsTableRow
          key={delegation.id}
          delegation={delegation}
          delegationType={delegationType}
        />
      ))}
    </Table>
  )
}

export const DelegationsTableSkeleton: React.FC<Pick<DelegationsTableProps, 'delegationType'>> = ({
  delegationType,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const delegateOrDelegatorHeadLabel = match(delegationType)
    .with('DELEGATION_RECEIVED', () => tCommon('delegatorName'))
    .with('DELEGATION_GRANTED', () => tCommon('delegateName'))
    .exhaustive()

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('delegationKind'),
    delegateOrDelegatorHeadLabel,
    tCommon('status'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <DelegationsTableRowSkeleton />
      <DelegationsTableRowSkeleton />
      <DelegationsTableRowSkeleton />
      <DelegationsTableRowSkeleton />
      <DelegationsTableRowSkeleton />
    </Table>
  )
}
