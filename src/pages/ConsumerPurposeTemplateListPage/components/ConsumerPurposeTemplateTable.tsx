import { Table } from '@pagopa/interop-fe-commons'

import { useTranslation } from 'react-i18next'
import {
  ConsumerPurposeTemplateTableRow,
  ConsumerPurposeTemplateTableRowSkeleton,
} from './ConsumerPurposeTemplateTableRow'
import type { CreatorPurposeTemplate } from '@/api/api.generatedTypes'

type ConsumerPurposeTemplatesTableProps = {
  purposeTemplates: Array<CreatorPurposeTemplate>
}

export const ConsumerPurposeTemplateTable: React.FC<ConsumerPurposeTemplatesTableProps> = ({
  purposeTemplates,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('targetOrganization'),
    tCommon('purposeTemplateName'),
    tCommon('purposeStatus'),
    '',
  ]

  return (
    <Table
      headLabels={headLabels}
      isEmpty={purposeTemplates.length === 0}
      noDataLabel={t('noDataLabel')}
    >
      {purposeTemplates.map((purposeTemplate: CreatorPurposeTemplate) => (
        <ConsumerPurposeTemplateTableRow
          key={purposeTemplate.id}
          purposeTemplate={purposeTemplate}
        />
      ))}
    </Table>
  )
}

export const ConsumerPurposeTemplateTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })

  const headLabels = [
    tCommon('targetOrganization'),
    tCommon('purposeTemplateName'),
    tCommon('purposeStatus'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <ConsumerPurposeTemplateTableRowSkeleton />
      <ConsumerPurposeTemplateTableRowSkeleton />
      <ConsumerPurposeTemplateTableRowSkeleton />
      <ConsumerPurposeTemplateTableRowSkeleton />
      <ConsumerPurposeTemplateTableRowSkeleton />
    </Table>
  )
}
