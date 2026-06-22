import React from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceTableRow, EServiceTableRowSkeleton } from './EServiceTableRow'
import { Table } from '@pagopa/interop-fe-commons'
import type { ProducerEService } from '@/api/api.generatedTypes'

type EServiceTableProps = {
  eservices: Array<ProducerEService>
}

export const EServiceTable: React.FC<EServiceTableProps> = ({ eservices }) => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [t('eserviceName'), t('version'), t('status'), '']

  const isEmpty = eservices && eservices.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {eservices?.map((eservice) => (
        <EServiceTableRow key={eservice.id} eservice={eservice} />
      ))}
    </Table>
  )
}

export const EServiceTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('eserviceName'), t('version'), t('status'), '']

  return (
    <Table headLabels={headLabels}>
      <EServiceTableRowSkeleton />
      <EServiceTableRowSkeleton />
      <EServiceTableRowSkeleton />
      <EServiceTableRowSkeleton />
      <EServiceTableRowSkeleton />
    </Table>
  )
}
