import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import {
  ConsumerPurposeTemplateLinkedEServiceTableRow,
  ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton,
} from './ConsumerPurposeTemplateLinkedEServiceTableRow'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'

type ConsumerPurposeTemplateLinkedEServiceTableProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateLinkedEServiceTable: React.FC<
  ConsumerPurposeTemplateLinkedEServiceTableProps
> = ({ purposeTemplate }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const { data: linkedEservices } = useSuspenseQuery(
    PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList() //TODO: CHECK IF THIS IS THE CORRECT API
  )

  const headLabels = [tCommon('linkedEserviceName'), tCommon('linkedEserviceProviderName'), '']
  const isEmpty = linkedEservices.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {linkedEservices.map((eservice) => (
        <ConsumerPurposeTemplateLinkedEServiceTableRow
          key={eservice.eserviceId}
          eservice={eservice}
        />
      ))}
    </Table>
  )
}

export const ConsumerPurposeTemplateLinkedEServiceTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [tCommon('linkedEserviceName'), tCommon('linkedEserviceProviderName'), '']
  return (
    <Table headLabels={headLabels}>
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
      <ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton />
    </Table>
  )
}
