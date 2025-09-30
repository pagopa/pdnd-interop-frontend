import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  EServiceTemplateTableRow,
  EServiceTemplateTableRowSkeleton,
} from './EServiceTemplateTableRow'
import { Table } from '@pagopa/interop-fe-commons'
import type { ProducerEServiceTemplate } from '@/api/api.generatedTypes'

type TemplateTableProps = {
  eserviceTemplates: Array<ProducerEServiceTemplate>
}

export const EServiceTemplateTable: React.FC<TemplateTableProps> = ({ eserviceTemplates }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('eserviceTemplate')

  const headLabels = [tCommon('eserviceTemplateName'), tCommon('version'), tCommon('status'), '']

  const isEmpty = eserviceTemplates && eserviceTemplates.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noMultiDataLabel')}>
      {eserviceTemplates?.map((eserviceTemplate) => (
        <EServiceTemplateTableRow key={eserviceTemplate.id} eserviceTemplate={eserviceTemplate} />
      ))}
    </Table>
  )
}

export const TemplateTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('eserviceTemplateName'), t('version'), t('status'), '']

  return (
    <Table headLabels={headLabels}>
      <EServiceTemplateTableRowSkeleton />
      <EServiceTemplateTableRowSkeleton />
      <EServiceTemplateTableRowSkeleton />
      <EServiceTemplateTableRowSkeleton />
      <EServiceTemplateTableRowSkeleton />
    </Table>
  )
}
