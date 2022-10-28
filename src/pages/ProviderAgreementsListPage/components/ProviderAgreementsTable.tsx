import { AgreementQueries } from '@/api/agreement'
import { Table } from '@/components/shared/Table'
import { useJwt } from '@/hooks/useJwt'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ProviderAgreementsTableRow,
  ProviderAgreementsTableRowSkeleton,
} from './ProviderAgreementsTableRow'

export const ProviderAgreementsTable: React.FC = () => {
  const { t } = useTranslation('agreement')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { jwt } = useJwt()
  const { data: agreements } = AgreementQueries.useGetAll({
    producerId: jwt?.organizationId,
    states: ['ACTIVE', 'ARCHIVED', 'PENDING', 'SUSPENDED', 'REJECTED'],
  })

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('subscriberName'),
    tCommon('agreementStatus'),
    '',
  ]

  return (
    <Table
      headLabels={headLabels}
      noDataLabel={t('noMultiDataLabel')}
      isEmpty={agreements && agreements.length === 0}
    >
      {agreements?.map((agreement) => (
        <ProviderAgreementsTableRow key={agreement.id} agreement={agreement} />
      ))}
    </Table>
  )
}

export const ProviderAgreementsTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('subscriberName'),
    tCommon('agreementStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <ProviderAgreementsTableRowSkeleton />
      <ProviderAgreementsTableRowSkeleton />
      <ProviderAgreementsTableRowSkeleton />
      <ProviderAgreementsTableRowSkeleton />
      <ProviderAgreementsTableRowSkeleton />
    </Table>
  )
}
