import type { RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AttributesTableRow, AttributesTableRowSkeleton } from './AttributesTableRow'

type AttributesTableProps = {
  attributes: Array<RequesterCertifiedAttribute>
}

export const AttributesTable: React.FC<AttributesTableProps> = ({ attributes }) => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [t('assigneeTenant'), t('certifiedAttribute'), '']

  const isEmpty = attributes && attributes.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {attributes?.map((attribute) => (
        <AttributesTableRow key={attribute.attributeId} attribute={attribute} />
      ))}
    </Table>
  )
}

export const AttributesTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('assigneeTenant'), t('certifiedAttribute'), '']

  return (
    <Table headLabels={headLabels}>
      <AttributesTableRowSkeleton />
      <AttributesTableRowSkeleton />
      <AttributesTableRowSkeleton />
      <AttributesTableRowSkeleton />
      <AttributesTableRowSkeleton />
    </Table>
  )
}
