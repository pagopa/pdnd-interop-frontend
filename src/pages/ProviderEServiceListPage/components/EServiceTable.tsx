import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { useJwt } from '@/hooks/useJwt'
import { Table } from '@/components/shared/Table'
import { useTranslation } from 'react-i18next'
import { EServiceTableRow, EServiceTableRowSkeleton } from './EServiceTableRow'

export const EServiceTable: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList.eserviceTable' })
  const { jwt } = useJwt()
  const { data: eservices } = EServiceQueries.useGetAllFlat({
    callerId: jwt?.organizationId,
    producerId: jwt?.organizationId,
  })

  const headLabels = [t('headLabels.name'), t('headLabels.version'), t('headLabels.status'), '']

  const isEmpty = eservices && eservices.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {eservices?.map((eservice) => (
        <EServiceTableRow key={eservice?.descriptorId || eservice.id} eservice={eservice} />
      ))}
    </Table>
  )
}

export const EServiceTableSkeleton: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList.eserviceTable' })
  const headLabels = [t('headLabels.name'), t('headLabels.version'), t('headLabels.status'), '']

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
