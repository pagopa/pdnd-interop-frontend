import { Table } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import {
  ConsumerLinkedPurposeTemplatesTableRow,
  ConsumerLinkedPurposeTemplatesTableRowSkeleton,
} from './ConsumerLinkedPurposeTemplatesTableRow'
import type { CatalogPurposeTemplate } from '@/api/api.generatedTypes'

type ConsumerPurposeTemplatesTableProps = {
  purposeTemplates: Array<CatalogPurposeTemplate>
}

export const ConsumerLinkedPurposeTemplatesTable: React.FC<ConsumerPurposeTemplatesTableProps> = ({
  purposeTemplates,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('purposeTemplateName'),
    tCommon('purposeTemplateCreatorName'),
    tCommon('purposeTemplateTarget'),
    '',
  ]

  return (
    <Table
      headLabels={headLabels}
      isEmpty={purposeTemplates && purposeTemplates.length === 0}
      noDataLabel={t('noDataLabel')}
    >
      {purposeTemplates?.map((purposeTemplate) => (
        <ConsumerLinkedPurposeTemplatesTableRow
          key={purposeTemplate.id}
          purposeTemplate={purposeTemplate}
        />
      ))}
    </Table>
  )
}

export const ConsumerLinkedPurposeTemplatesTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('purposeTemplateName'),
    tCommon('purposeTemplateCreatorName'),
    tCommon('purposeTemplateTarget'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <ConsumerLinkedPurposeTemplatesTableRowSkeleton />
      <ConsumerLinkedPurposeTemplatesTableRowSkeleton />
      <ConsumerLinkedPurposeTemplatesTableRowSkeleton />
      <ConsumerLinkedPurposeTemplatesTableRowSkeleton />
      <ConsumerLinkedPurposeTemplatesTableRowSkeleton />
    </Table>
  )
}
