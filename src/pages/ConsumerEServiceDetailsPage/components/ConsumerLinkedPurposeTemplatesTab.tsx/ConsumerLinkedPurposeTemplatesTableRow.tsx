import type { CatalogPurposeTemplate } from '@/api/api.generatedTypes'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

export const ConsumerLinkedPurposeTemplatesTableRow: React.FC<{
  purposeTemplate: CatalogPurposeTemplate
}> = ({ purposeTemplate }) => {
  const { t: tCommon } = useTranslation('common')

  return (
    <TableRow
      cellData={[
        purposeTemplate.purposeTitle,
        purposeTemplate.creator.name,
        purposeTemplate.targetTenantKind,
      ]}
    >
      <Link
        as="button"
        variant="outlined"
        size="small"
        to="SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS"
        params={{ purposeTemplateId: purposeTemplate.id }}
      >
        {tCommon('actions.inspect')}
      </Link>
    </TableRow>
  )
}

export const ConsumerLinkedPurposeTemplatesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={180} />,
        <Skeleton key={1} width={180} />,
        <Skeleton key={2} width={180} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
    </TableRow>
  )
}
