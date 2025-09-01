import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import { Table } from '@pagopa/interop-fe-commons'

import { useTranslation } from 'react-i18next'
import {
  ConsumerPurposeTemplateTableRow,
  ConsumerPurposeTemplateTableRowSkeleton,
} from './ConsumerPurposeTemplateTableRow'

type ConsumerPurposeTemplatesTableProps = {
  purposeTemplates: Array<PurposeTemplate>
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
      isEmpty={purposeTemplates && purposeTemplates.length === 0}
      noDataLabel={t('noDataLabel')}
    >
      {purposeTemplates?.map((purposeTemplate) => (
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
