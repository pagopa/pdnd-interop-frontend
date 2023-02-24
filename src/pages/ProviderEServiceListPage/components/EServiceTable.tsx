import React from 'react'
import { Table } from '@/components/shared/Table'
import { useTranslation } from 'react-i18next'
import { EServiceTableRow, EServiceTableRowSkeleton } from './EServiceTableRow'
import type { EServiceProvider } from '@/types/eservice.types'

type EServiceTableProps = {
  eservices: Array<EServiceProvider>
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
