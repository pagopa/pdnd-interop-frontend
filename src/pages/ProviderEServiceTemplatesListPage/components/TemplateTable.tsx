import React from 'react'
import { useTranslation } from 'react-i18next'
import { TemplateTableRow, TemplateTableRowSkeleton } from './TemplateTableRow'
import { Table } from '@pagopa/interop-fe-commons'
import { ProducerEServiceTemplate } from '@/api/api.generatedTypes'

type TemplateTableProps = {
  templates: Array<ProducerEServiceTemplate>
}

export const TemplateTable: React.FC<TemplateTableProps> = ({ templates }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('template')

  const headLabels = [tCommon('templateName'), tCommon('version'), tCommon('status'), '']

  const isEmpty = templates && templates.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noMultiDataLabel')}>
      {templates?.map((template) => <TemplateTableRow key={template.id} template={template} />)}
    </Table>
  )
}

export const TemplateTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('templateName'), t('version'), t('status'), '']

  return (
    <Table headLabels={headLabels}>
      <TemplateTableRowSkeleton />
      <TemplateTableRowSkeleton />
      <TemplateTableRowSkeleton />
      <TemplateTableRowSkeleton />
      <TemplateTableRowSkeleton />
    </Table>
  )
}
