import type { AgreementListingItem } from '@/types/agreement.types'
import { Table } from '@pagopa/interop-fe-commons'
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
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('providerName'),
    tCommon('agreementStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels} isEmpty={agreements && agreements.length === 0}>
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
