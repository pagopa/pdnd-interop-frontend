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

  const { data: eserviceDescriptorsPurposeTemplateList } = useSuspenseQuery(
    PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList({
      purposeTemplateId: purposeTemplate.id,
      offset: 0,
      limit: 10,
    }) //TODO: CHECK IF THIS IS THE CORRECT API
  )

  const headLabels = [tCommon('linkedEserviceName'), tCommon('linkedEserviceProviderName'), '']
  const isEmpty = eserviceDescriptorsPurposeTemplateList.results.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {eserviceDescriptorsPurposeTemplateList.results.map((eserviceDescriptorPurposeTemplate) => (
        <ConsumerPurposeTemplateLinkedEServiceTableRow
          key={eserviceDescriptorPurposeTemplate.eservice.id}
          compactEServiceWithCompactDescriptor={eserviceDescriptorPurposeTemplate}
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
