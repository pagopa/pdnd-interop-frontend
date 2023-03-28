import type { AgreementListingItem } from '@/types/agreement.types'
import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ProviderAgreementsTableRow,
  ProviderAgreementsTableRowSkeleton,
} from './ProviderAgreementsTableRow'

type ProviderAgreementsProps = {
  agreements: Array<AgreementListingItem>
}

export const ProviderAgreementsTable: React.FC<ProviderAgreementsProps> = ({ agreements }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('eserviceName'),
    tCommon('subscriberName'),
    tCommon('agreementStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels} isEmpty={agreements && agreements.length === 0}>
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
