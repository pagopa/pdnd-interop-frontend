import { Table } from '@/components/shared/Table'
import { AgreementListingItem } from '@/types/agreement.types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConsumerAgreementsTableRow,
  ConsumerAgreementsTableRowSkeleton,
} from './ConsumerAgreementsTableRow'

type ConsumerAgreementsProps = {
  agreements: Array<AgreementListingItem>
}

export const ConsumerAgreementsTable: React.FC<ConsumerAgreementsProps> = ({ agreements }) => {
  const { t } = useTranslation('agreement')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('providerName'),
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
        <ConsumerAgreementsTableRow key={agreement.id} agreement={agreement} />
      ))}
    </Table>
  )
}

export const ConsumerAgreementsTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('providerName'),
    tCommon('agreementStatus'),
    '',
  ]
  return (
    <Table headLabels={headLabels}>
      <ConsumerAgreementsTableRowSkeleton />
      <ConsumerAgreementsTableRowSkeleton />
      <ConsumerAgreementsTableRowSkeleton />
      <ConsumerAgreementsTableRowSkeleton />
      <ConsumerAgreementsTableRowSkeleton />
    </Table>
  )
}
